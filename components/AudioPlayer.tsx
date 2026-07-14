import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Modal,
  Pressable, ActivityIndicator, Platform,
} from 'react-native';
import { Audio, AVPlaybackStatus } from 'expo-av';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, spacing, radius, typography } from '../constants/theme';
import type { PodcastEpisode, GuidedSession } from '../constants/audioContent';
import { getAudioSource } from '../services/elevenlabs';

// ─── Types ────────────────────────────────────────────────────────────────────

type AudioItem =
  | { type: 'episode'; data: PodcastEpisode }
  | { type: 'session'; data: GuidedSession };

interface AudioPlayerProps {
  item: AudioItem | null;
  onClose: () => void;
}

const SPEEDS = [0.75, 1.0, 1.25, 1.5] as const;
type Speed = typeof SPEEDS[number];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatTime(ms: number): string {
  if (!isFinite(ms) || ms < 0) return '0:00';
  const totalSec = Math.floor(ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${min}:${sec.toString().padStart(2, '0')}`;
}

function getTitle(item: AudioItem): string { return item.data.title; }
function getSummary(item: AudioItem): string { return item.data.summary; }
function getEmoji(item: AudioItem): string { return item.data.emoji; }
function getDurationMin(item: AudioItem): number { return item.data.durationMin; }
function getTag(item: AudioItem): string {
  if (item.type === 'episode') return item.data.tag;
  const labels: Record<string, string> = { activated: 'For activated state', shutdown: 'For shutdown state', any: 'Any state' };
  return labels[item.data.targetState] ?? 'Guided session';
}
function getVoiceFile(item: AudioItem): string {
  if (item.type === 'episode') return item.data.audioFile;
  return item.data.voiceFile;
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────

function ProgressBar({
  position, duration, onSeek,
}: {
  position: number; duration: number; onSeek: (ms: number) => void;
}) {
  const [barWidth, setBarWidth] = useState(1);
  const progress = duration > 0 ? Math.min(position / duration, 1) : 0;

  return (
    <View style={pb.container}>
      <Text style={pb.time}>{formatTime(position)}</Text>
      <Pressable
        style={pb.track}
        onLayout={(e) => setBarWidth(e.nativeEvent.layout.width)}
        onPress={(e) => {
          const ratio = e.nativeEvent.locationX / barWidth;
          onSeek(Math.max(0, Math.min(ratio, 1)) * duration);
        }}
      >
        <View style={pb.rail} />
        <View style={[pb.fill, { width: `${progress * 100}%` }]} />
        <View style={[pb.thumb, { left: `${progress * 100}%` }]} />
      </Pressable>
      <Text style={pb.time}>{formatTime(duration)}</Text>
    </View>
  );
}

const pb = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginVertical: spacing.lg },
  time: { ...typography.label, minWidth: 36, textAlign: 'center' },
  track: { flex: 1, height: 28, justifyContent: 'center' },
  rail: { height: 3, backgroundColor: colors.surfaceHigh, borderRadius: 2, position: 'absolute', left: 0, right: 0 },
  fill: { height: 3, backgroundColor: colors.teal, borderRadius: 2, position: 'absolute', left: 0 },
  thumb: { width: 14, height: 14, borderRadius: 7, backgroundColor: colors.teal, position: 'absolute', marginLeft: -7 },
});

// ─── Main component ───────────────────────────────────────────────────────────

export function AudioPlayer({ item, onClose }: AudioPlayerProps) {
  const soundRef = useRef<Audio.Sound | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'playing' | 'paused' | 'error'>('idle');
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speed, setSpeed] = useState<Speed>(1.0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const unload = useCallback(async () => {
    if (soundRef.current) {
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }
    setStatus('idle');
    setPosition(0);
    setDuration(0);
  }, []);

  useEffect(() => {
    if (!item) { unload(); return; }
    setStatus('loading');
    setErrorMsg(null);
    setPosition(0);
    setDuration(0);
    let cancelled = false;

    async function load() {
      await unload();
      if (cancelled) return;
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });
      const src = getAudioSource(getVoiceFile(item!));
      if (!src) {
        setStatus('error');
        setErrorMsg('Audio not yet generated. Run scripts/generate-podcasts.js first.');
        return;
      }
      try {
        const source = typeof src === 'string' ? { uri: src } : src;
        const { sound } = await Audio.Sound.createAsync(
          source as Parameters<typeof Audio.Sound.createAsync>[0],
          { shouldPlay: true, rate: speed, positionMillis: 0 },
          onPlaybackStatus,
        );
        if (cancelled) { sound.unloadAsync(); return; }
        soundRef.current = sound;
        if (cancelled) return;
        setStatus('playing');
      } catch (e: any) {
        if (cancelled) return;
        setStatus('error');
        setErrorMsg(e?.message ?? 'Could not load audio');
      }
    }

    load();
    return () => { cancelled = true; };
  }, [item]);

  useEffect(() => () => { unload(); }, []);

  function onPlaybackStatus(s: AVPlaybackStatus) {
    if (!s.isLoaded) return;
    setPosition(s.positionMillis);
    setDuration(s.durationMillis ?? 0);
    if (s.didJustFinish) setStatus('paused');
  }

  async function togglePlay() {
    if (!soundRef.current) return;
    if (status === 'playing') {
      await soundRef.current.pauseAsync();
      setStatus('paused');
    } else {
      await soundRef.current.playAsync();
      setStatus('playing');
    }
  }

  async function seek(ms: number) {
    if (!soundRef.current) return;
    await soundRef.current.setPositionAsync(ms);
    setPosition(ms);
  }

  async function skip(deltaMs: number) {
    const target = Math.max(0, Math.min(position + deltaMs, duration));
    await seek(target);
  }

  async function cycleSpeed() {
    const idx = SPEEDS.indexOf(speed);
    const next = SPEEDS[(idx + 1) % SPEEDS.length];
    setSpeed(next);
    if (soundRef.current) await soundRef.current.setRateAsync(next, true);
  }

  if (!item) return null;
  const isLoading = status === 'loading';
  const isPlaying = status === 'playing';

  return (
    <Modal visible={!!item} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={styles.safe}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
            <MaterialIcons name="keyboard-arrow-down" size={28} color={colors.textSecondary} />
          </TouchableOpacity>
          <Text style={styles.headerTag}>{getTag(item)}</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.artwork}>
          <Text style={styles.artworkEmoji}>{getEmoji(item)}</Text>
          {item.type === 'session' && (
            <View style={styles.sessionBadge}>
              <MaterialIcons name="music-note" size={12} color={colors.teal} />
              <Text style={styles.sessionBadgeText}>Voice + music</Text>
            </View>
          )}
        </View>

        <View style={styles.info}>
          <Text style={styles.title}>{getTitle(item)}</Text>
          <Text style={styles.summary} numberOfLines={3}>{getSummary(item)}</Text>
          <Text style={styles.duration}>~{getDurationMin(item)} min</Text>
        </View>

        <ProgressBar position={position} duration={duration || getDurationMin(item) * 60 * 1000} onSeek={seek} />

        <View style={styles.controls}>
          <TouchableOpacity onPress={() => skip(-15000)} style={styles.skipBtn} disabled={isLoading}>
            <MaterialIcons name="replay-10" size={32} color={isLoading ? colors.textMuted : colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={togglePlay} style={styles.playBtn} disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator size="large" color={colors.bg} />
            ) : (
              <MaterialIcons name={isPlaying ? 'pause' : 'play-arrow'} size={40} color={colors.bg} />
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => skip(30000)} style={styles.skipBtn} disabled={isLoading}>
            <MaterialIcons name="forward-30" size={32} color={isLoading ? colors.textMuted : colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={cycleSpeed} style={styles.speedBtn}>
          <Text style={styles.speedText}>{speed}×</Text>
        </TouchableOpacity>

        {status === 'error' && errorMsg && (
          <View style={styles.errorBox}>
            <MaterialIcons name="error-outline" size={18} color={colors.crisis} />
            <Text style={styles.errorText}>{errorMsg}</Text>
          </View>
        )}

        {item.type === 'session' && status !== 'error' && (
          <View style={styles.musicNote}>
            <MaterialIcons name="info-outline" size={14} color={colors.textMuted} />
            <Text style={styles.musicNoteText}>
              Background music plays automatically with this session. Use headphones for the best experience.
            </Text>
          </View>
        )}

        <View style={{ height: Platform.OS === 'ios' ? 32 : spacing.xl }} />
      </View>
    </Modal>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: spacing.xl, paddingTop: spacing.lg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.xl },
  closeBtn: { padding: spacing.xs },
  headerTag: { ...typography.label, color: colors.teal },
  artwork: {
    alignSelf: 'center', width: 180, height: 180, borderRadius: radius.xl,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center', marginBottom: spacing.xl,
  },
  artworkEmoji: { fontSize: 72 },
  sessionBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    position: 'absolute', bottom: spacing.sm,
    backgroundColor: `${colors.teal}22`, paddingHorizontal: spacing.sm, paddingVertical: 3, borderRadius: radius.full,
  },
  sessionBadgeText: { ...typography.label, color: colors.teal, fontSize: 10 },
  info: { marginBottom: spacing.sm },
  title: { ...typography.heading2, marginBottom: spacing.xs },
  summary: { ...typography.bodySmall, lineHeight: 20, marginBottom: spacing.xs },
  duration: { ...typography.label, color: colors.teal },
  controls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xl, marginBottom: spacing.md },
  skipBtn: { padding: spacing.sm },
  playBtn: {
    width: 72, height: 72, borderRadius: 36, backgroundColor: colors.teal,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: colors.teal, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 12, elevation: 8,
  },
  speedBtn: {
    alignSelf: 'center', paddingVertical: spacing.xs, paddingHorizontal: spacing.md,
    backgroundColor: colors.surfaceHigh, borderRadius: radius.full, marginBottom: spacing.lg,
  },
  speedText: { ...typography.label, color: colors.textSecondary },
  errorBox: {
    flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm,
    backgroundColor: colors.crisisBg, borderRadius: radius.md, padding: spacing.md,
    borderWidth: 1, borderColor: colors.crisis, marginBottom: spacing.md,
  },
  errorText: { ...typography.bodySmall, color: colors.crisis, flex: 1, lineHeight: 18 },
  musicNote: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.xs, marginBottom: spacing.md },
  musicNoteText: { ...typography.bodySmall, color: colors.textMuted, flex: 1, lineHeight: 18, fontSize: 12 },
});
