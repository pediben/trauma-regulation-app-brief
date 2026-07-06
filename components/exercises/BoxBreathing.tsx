import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { colors, spacing, typography } from '../../../constants/theme';

type Phase = 'inhale' | 'hold-in' | 'exhale' | 'hold-out';
const PHASES: Phase[] = ['inhale', 'hold-in', 'exhale', 'hold-out'];
const DURATION = 4;
const phaseLabel: Record<Phase, string> = { 'inhale': 'Inhale', 'hold-in': 'Hold', 'exhale': 'Exhale', 'hold-out': 'Hold' };
const phaseInstruction: Record<Phase, string> = {
  'inhale': 'breathe in slowly through your nose',
  'hold-in': 'hold gently',
  'exhale': 'release slowly through your mouth',
  'hold-out': 'rest — lungs empty',
};

export function BoxBreathing() {
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [count, setCount] = useState(DURATION);
  const scale = useRef(new Animated.Value(1)).current;
  const phase = PHASES[phaseIdx];

  useEffect(() => {
    if (phase === 'inhale') Animated.timing(scale, { toValue: 1.5, duration: DURATION * 1000, useNativeDriver: true }).start();
    else if (phase === 'exhale') Animated.timing(scale, { toValue: 1, duration: DURATION * 1000, useNativeDriver: true }).start();
  }, [phase]);

  useEffect(() => {
    setCount(DURATION);
    const interval = setInterval(() => {
      setCount((c) => {
        if (c <= 1) { setPhaseIdx((p) => (p + 1) % PHASES.length); return DURATION; }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [phaseIdx]);

  return (
    <View style={styles.container}>
      <View style={styles.circleWrapper}>
        <Animated.View style={[styles.circleOuter, { transform: [{ scale }] }]}>
          <View style={styles.circleInner}>
            <Text style={styles.countText}>{count}</Text>
          </View>
        </Animated.View>
      </View>
      <Text style={styles.phaseLabel}>{phaseLabel[phase]}</Text>
      <Text style={styles.instruction}>{phaseInstruction[phase]}</Text>
      <View style={styles.steps}>
        {PHASES.map((p, i) => (
          <View key={p} style={[styles.step, i === phaseIdx && styles.stepActive]}>
            <Text style={[styles.stepText, i === phaseIdx && styles.stepTextActive]}>{phaseLabel[p]} 4</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', paddingVertical: spacing.xl },
  circleWrapper: { width: 200, height: 200, justifyContent: 'center', alignItems: 'center', marginBottom: spacing.xl },
  circleOuter: { width: 140, height: 140, borderRadius: 70, backgroundColor: `${colors.teal}22`, borderWidth: 2, borderColor: `${colors.teal}66`, justifyContent: 'center', alignItems: 'center' },
  circleInner: { width: 80, height: 80, borderRadius: 40, backgroundColor: `${colors.teal}44`, justifyContent: 'center', alignItems: 'center' },
  countText: { ...typography.heading1, color: colors.teal, fontSize: 36 },
  phaseLabel: { ...typography.heading2, color: colors.teal, marginBottom: spacing.sm },
  instruction: { ...typography.bodySmall, textAlign: 'center', marginBottom: spacing.xl, paddingHorizontal: spacing.xl },
  steps: { flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap', justifyContent: 'center' },
  step: { paddingVertical: spacing.xs, paddingHorizontal: spacing.sm, borderRadius: 6, borderWidth: 1, borderColor: colors.border },
  stepActive: { borderColor: colors.teal, backgroundColor: `${colors.teal}22` },
  stepText: { ...typography.label, color: colors.textMuted },
  stepTextActive: { color: colors.teal },
});
