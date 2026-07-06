import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Easing, TouchableOpacity } from 'react-native';
import { colors, spacing, radius, typography } from '../../../constants/theme';

const SPEED_OPTIONS = [{ label: 'Slow', ms: 2000 }, { label: 'Medium', ms: 1200 }, { label: 'Fast', ms: 700 }];

export function BilateralDot() {
  const [speedIdx, setSpeedIdx] = useState(0);
  const [running, setRunning] = useState(false);
  const pos = useRef(new Animated.Value(0)).current;
  const animRef = useRef<Animated.CompositeAnimation | null>(null);
  const speed = SPEED_OPTIONS[speedIdx].ms;

  useEffect(() => {
    if (running) {
      const loop = Animated.loop(Animated.sequence([
        Animated.timing(pos, { toValue: 1, duration: speed, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(pos, { toValue: 0, duration: speed, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ]));
      animRef.current = loop;
      loop.start();
    } else {
      animRef.current?.stop();
      pos.setValue(0.5);
    }
    return () => animRef.current?.stop();
  }, [running, speed]);

  const TRACK_WIDTH = 280;
  const DOT_SIZE = 32;
  const translateX = pos.interpolate({ inputRange: [0, 1], outputRange: [0, TRACK_WIDTH - DOT_SIZE] });

  return (
    <View style={styles.container}>
      <Text style={styles.disclaimer}>⚠️ This is a calming rhythm — not EMDR therapy. If you're in EMDR treatment, follow your therapist's guidance.</Text>
      <View style={styles.track}>
        <Animated.View style={[styles.dot, { transform: [{ translateX }] }]} />
      </View>
      <Text style={styles.hint}>{running ? 'Follow the dot with your eyes. Breathe slowly.' : 'Tap Start to begin.'}</Text>
      <View style={styles.speedRow}>
        {SPEED_OPTIONS.map((s, i) => (
          <TouchableOpacity key={s.label} style={[styles.speedBtn, i === speedIdx && styles.speedBtnActive]} onPress={() => setSpeedIdx(i)}>
            <Text style={[styles.speedText, i === speedIdx && styles.speedTextActive]}>{s.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity style={[styles.startBtn, running && styles.stopBtn]} onPress={() => setRunning((r) => !r)}>
        <Text style={styles.startText}>{running ? 'Stop' : 'Start'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', paddingVertical: spacing.lg },
  disclaimer: { ...typography.bodySmall, color: colors.textMuted, textAlign: 'center', paddingHorizontal: spacing.xl, marginBottom: spacing.xl, fontStyle: 'italic' },
  track: { width: 280, height: 60, backgroundColor: colors.surface, borderRadius: radius.full, justifyContent: 'center', marginBottom: spacing.lg, overflow: 'hidden' },
  dot: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.teal, shadowColor: colors.teal, shadowRadius: 12, shadowOpacity: 0.8, shadowOffset: { width: 0, height: 0 }, elevation: 8, marginLeft: 14 },
  hint: { ...typography.bodySmall, textAlign: 'center', marginBottom: spacing.xl },
  speedRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.xl },
  speedBtn: { paddingVertical: spacing.xs, paddingHorizontal: spacing.md, borderRadius: radius.full, borderWidth: 1, borderColor: colors.border },
  speedBtnActive: { borderColor: colors.teal, backgroundColor: `${colors.teal}22` },
  speedText: { ...typography.label, color: colors.textMuted },
  speedTextActive: { color: colors.teal },
  startBtn: { width: 120, paddingVertical: spacing.md, borderRadius: radius.full, backgroundColor: colors.teal, alignItems: 'center' },
  stopBtn: { backgroundColor: colors.surfaceHigh, borderWidth: 1, borderColor: colors.teal },
  startText: { ...typography.body, fontWeight: '700', color: colors.bg },
});
