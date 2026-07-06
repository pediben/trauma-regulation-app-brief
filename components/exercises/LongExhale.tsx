import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { colors, spacing, typography } from '../../../constants/theme';

type Phase = 'inhale' | 'hold' | 'exhale';
const SEQUENCE: { phase: Phase; duration: number }[] = [
  { phase: 'inhale', duration: 4 },
  { phase: 'hold', duration: 2 },
  { phase: 'exhale', duration: 7 },
];
const phaseLabel: Record<Phase, string> = { inhale: 'Inhale', hold: 'Hold', exhale: 'Exhale slowly' };
const phaseColor: Record<Phase, string> = { inhale: colors.teal, hold: colors.purple, exhale: colors.tealDim };

export function LongExhale() {
  const [idx, setIdx] = useState(0);
  const [count, setCount] = useState(SEQUENCE[0].duration);
  const progress = useRef(new Animated.Value(0)).current;
  const { phase, duration } = SEQUENCE[idx];

  useEffect(() => {
    setCount(duration);
    Animated.timing(progress, {
      toValue: idx === 0 ? 1 : idx === 1 ? 1 : 0,
      duration: duration * 1000,
      useNativeDriver: false,
    }).start();
    const interval = setInterval(() => {
      setCount((c) => {
        if (c <= 1) { setIdx((i) => (i + 1) % SEQUENCE.length); return SEQUENCE[(idx + 1) % SEQUENCE.length].duration; }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [idx]);

  const barWidth = progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });

  return (
    <View style={styles.container}>
      <View style={styles.barTrack}>
        <Animated.View style={[styles.barFill, { width: barWidth, backgroundColor: phaseColor[phase] }]} />
      </View>
      <Text style={[styles.countText, { color: phaseColor[phase] }]}>{count}</Text>
      <Text style={[styles.phaseLabel, { color: phaseColor[phase] }]}>{phaseLabel[phase]}</Text>
      <View style={styles.pattern}>
        <Text style={styles.patternText}>4 — 2 — 7 pattern</Text>
        <Text style={styles.patternSub}>The long exhale activates your body's natural braking system (the vagus nerve). You don't need to force it — just let the air fall out.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', paddingVertical: spacing.xl },
  barTrack: { width: '80%', height: 12, borderRadius: 6, backgroundColor: colors.surfaceHigh, marginBottom: spacing.xl, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 6 },
  countText: { fontSize: 72, fontWeight: '200', marginBottom: spacing.sm },
  phaseLabel: { ...typography.heading2, marginBottom: spacing.xxl },
  pattern: { paddingHorizontal: spacing.xl, alignItems: 'center', gap: spacing.sm },
  patternText: { ...typography.label, color: colors.textMuted },
  patternSub: { ...typography.bodySmall, textAlign: 'center', lineHeight: 22 },
});
