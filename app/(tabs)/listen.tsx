import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, spacing, radius, typography } from '../../constants/theme';
import { CrisisButton } from '../../components/CrisisButton';
import { AudioPlayer } from '../../components/AudioPlayer';
import { episodes, guidedSessions } from '../../constants/audioContent';
import type { PodcastEpisode, GuidedSession } from '../../constants/audioContent';

type Tab = 'episodes' | 'sessions';
type AudioItem =
  | { type: 'episode'; data: PodcastEpisode }
  | { type: 'session'; data: GuidedSession };

// ─── Episode card ─────────────────────────────────────────────────────────────

function EpisodeCard({ episode, onPlay }: { episode: PodcastEpisode; onPlay: () => void }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPlay} activeOpacity={0.75}>
      <View style={styles.cardArtwork}>
        <Text style={styles.cardEmoji}>{episode.emoji}</Text>
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.cardTag}>{episode.tag}</Text>
        <Text style={styles.cardTitle} numberOfLines={2}>{episode.title}</Text>
        <Text style={styles.cardSub} numberOfLines={1}>{episode.summary}</Text>
        <Text style={styles.cardDuration}>~{episode.durationMin} min</Text>
      </View>
      <View style={styles.playCircle}>
        <MaterialIcons name="play-arrow" size={20} color={colors.bg} />
      </View>
    </TouchableOpacity>
  );
}

// ─── Session card ─────────────────────────────────────────────────────────────

const STATE_LABEL: Record<string, { label: string; color: string }> = {
  activated: { label: 'For activated', color: colors.activated },
  shutdown: { label: 'For shutdown', color: colors.shutDown },
  any: { label: 'Any state', color: colors.teal },
};

function SessionCard({ session, onPlay }: { session: GuidedSession; onPlay: () => void }) {
  const state = STATE_LABEL[session.targetState] ?? STATE_LABEL['any'];
  return (
    <TouchableOpacity style={styles.sessionCard} onPress={onPlay} activeOpacity={0.75}>
      <View style={styles.sessionTop}>
        <Text style={styles.sessionEmoji}>{session.emoji}</Text>
        <View style={{ flex: 1, marginLeft: spacing.md }}>
          <View style={styles.sessionMeta}>
            <View style={[styles.statePill, { backgroundColor: `${state.color}22`, borderColor: `${state.color}55` }]}>
              <Text style={[styles.statePillText, { color: state.color }]}>{state.label}</Text>
            </View>
            <View style={styles.musicPill}>
              <MaterialIcons name="music-note" size={10} color={colors.teal} />
              <Text style={styles.musicPillText}>Voice + music</Text>
            </View>
          </View>
          <Text style={styles.sessionTitle}>{session.title}</Text>
          <Text style={styles.sessionDuration}>~{session.durationMin} min</Text>
        </View>
      </View>
      <Text style={styles.sessionSub} numberOfLines={2}>{session.summary}</Text>
      <View style={styles.sessionPlayRow}>
        <TouchableOpacity style={styles.sessionPlayBtn} onPress={onPlay}>
          <MaterialIcons name="play-arrow" size={18} color={colors.bg} />
          <Text style={styles.sessionPlayText}>Play session</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

// ─── Main tab ─────────────────────────────────────────────────────────────────

export default function ListenTab() {
  const [activeTab, setActiveTab] = useState<Tab>('episodes');
  const [playing, setPlaying] = useState<AudioItem | null>(null);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.heading}>Listen</Text>
          <Text style={styles.sub}>Audio guides for your nervous system — wherever you are.</Text>
        </View>

        <View style={styles.segmented}>
          <TouchableOpacity
            style={[styles.segment, activeTab === 'episodes' && styles.segmentActive]}
            onPress={() => setActiveTab('episodes')}
          >
            <MaterialIcons name="headphones" size={14} color={activeTab === 'episodes' ? colors.bg : colors.textMuted} />
            <Text style={[styles.segmentText, activeTab === 'episodes' && styles.segmentTextActive]}>Episodes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.segment, activeTab === 'sessions' && styles.segmentActive]}
            onPress={() => setActiveTab('sessions')}
          >
            <MaterialIcons name="self-improvement" size={14} color={activeTab === 'sessions' ? colors.bg : colors.textMuted} />
            <Text style={[styles.segmentText, activeTab === 'sessions' && styles.segmentTextActive]}>Sessions</Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'episodes' && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionLabel}>{episodes.length} short episodes · narrated by AI</Text>
            </View>
            {episodes.map((ep) => (
              <EpisodeCard key={ep.id} episode={ep} onPlay={() => setPlaying({ type: 'episode', data: ep })} />
            ))}
            <View style={styles.generationNote}>
              <MaterialIcons name="info-outline" size={14} color={colors.textMuted} />
              <Text style={styles.generationNoteText}>
                Episodes are narrated using ElevenLabs AI voice. Run{' '}
                <Text style={{ fontFamily: 'monospace', color: colors.teal }}>scripts/generate-podcasts.js</Text>{' '}
                to generate audio files before publishing.
              </Text>
            </View>
          </>
        )}

        {activeTab === 'sessions' && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionLabel}>Guided sessions · voice + background music</Text>
            </View>
            <View style={styles.sessionIntro}>
              <Text style={styles.sessionIntroText}>
                Each session combines a guided voice narration with background music generated by Suno — matched to help your nervous system move toward the target state. Headphones recommended.
              </Text>
            </View>
            {guidedSessions.map((session) => (
              <SessionCard key={session.id} session={session} onPlay={() => setPlaying({ type: 'session', data: session })} />
            ))}
          </>
        )}

        <CrisisButton />
        <View style={{ height: spacing.xl }} />
      </ScrollView>

      <AudioPlayer item={playing} onClose={() => setPlaying(null)} />
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { flex: 1 },
  content: { padding: spacing.lg, paddingTop: spacing.xl },
  header: { marginBottom: spacing.lg },
  heading: { ...typography.heading1, marginBottom: spacing.xs },
  sub: { ...typography.body, color: colors.textSecondary, lineHeight: 24 },
  segmented: {
    flexDirection: 'row', backgroundColor: colors.surface, borderRadius: radius.full,
    padding: 3, marginBottom: spacing.xl, borderWidth: 1, borderColor: colors.border,
  },
  segment: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: spacing.sm, borderRadius: radius.full },
  segmentActive: { backgroundColor: colors.teal },
  segmentText: { ...typography.label, color: colors.textMuted, fontSize: 12 },
  segmentTextActive: { color: colors.bg },
  sectionHeader: { marginBottom: spacing.md },
  sectionLabel: { ...typography.label },
  card: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface,
    borderRadius: radius.lg, padding: spacing.md, marginBottom: spacing.sm,
    borderWidth: 1, borderColor: colors.border, gap: spacing.md,
  },
  cardArtwork: {
    width: 52, height: 52, borderRadius: radius.md, backgroundColor: colors.surfaceHigh,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  cardEmoji: { fontSize: 26 },
  cardBody: { flex: 1 },
  cardTag: { ...typography.label, color: colors.teal, marginBottom: 2 },
  cardTitle: { ...typography.body, fontWeight: '600', lineHeight: 20, marginBottom: 2 },
  cardSub: { ...typography.bodySmall, lineHeight: 18, marginBottom: 4 },
  cardDuration: { ...typography.label, color: colors.textMuted },
  playCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.teal, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  generationNote: {
    flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm,
    backgroundColor: colors.surfaceHigh, borderRadius: radius.md, padding: spacing.md,
    marginTop: spacing.md, borderWidth: 1, borderColor: colors.border,
  },
  generationNoteText: { ...typography.bodySmall, flex: 1, lineHeight: 18, color: colors.textMuted, fontSize: 12 },
  sessionIntro: {
    backgroundColor: `${colors.teal}11`, borderRadius: radius.md, padding: spacing.md,
    marginBottom: spacing.lg, borderWidth: 1, borderColor: `${colors.teal}22`,
  },
  sessionIntroText: { ...typography.bodySmall, lineHeight: 20, color: colors.textSecondary },
  sessionCard: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.md, marginBottom: spacing.md, borderWidth: 1, borderColor: colors.border },
  sessionTop: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: spacing.sm },
  sessionEmoji: { fontSize: 32, marginTop: 2 },
  sessionMeta: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, marginBottom: spacing.xs },
  statePill: { paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: radius.full, borderWidth: 1 },
  statePillText: { fontSize: 10, fontWeight: '600', letterSpacing: 0.3 },
  musicPill: {
    flexDirection: 'row', alignItems: 'center', gap: 3, paddingHorizontal: spacing.sm, paddingVertical: 2,
    borderRadius: radius.full, backgroundColor: `${colors.teal}15`, borderWidth: 1, borderColor: `${colors.teal}33`,
  },
  musicPillText: { fontSize: 10, fontWeight: '600', color: colors.teal, letterSpacing: 0.3 },
  sessionTitle: { ...typography.body, fontWeight: '600', lineHeight: 22 },
  sessionDuration: { ...typography.label, color: colors.textMuted, marginTop: 2 },
  sessionSub: { ...typography.bodySmall, lineHeight: 20, marginBottom: spacing.md },
  sessionPlayRow: { alignItems: 'flex-start' },
  sessionPlayBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.teal,
    paddingVertical: spacing.sm, paddingHorizontal: spacing.md, borderRadius: radius.full,
  },
  sessionPlayText: { ...typography.label, color: colors.bg, fontSize: 12 },
});
