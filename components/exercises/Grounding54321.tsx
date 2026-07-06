import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, radius, typography } from '../../../constants/theme';

const steps = [
  { count: 5, sense: 'See', prompt: 'Name 5 things you can see right now. Look slowly around the room.', color: colors.teal },
  { count: 4, sense: 'Hear', prompt: 'Notice 4 sounds. Near sounds, distant sounds, sounds inside your body.', color: colors.purple },
  { count: 3, sense: 'Feel', prompt: "Notice 3 physical sensations — the weight of your body, temperature, texture of what you're touching.", color: colors.activated },
  { count: 2, sense: 'Smell', prompt: 'Find 2 things you can smell, or imagine 2 scents you enjoy.', color: colors.tealDim },
  { count: 1, sense: 'Taste', prompt: 'Notice 1 taste, or bring a favorite taste to mind.', color: colors.purpleDim },
];

export function Grounding54321() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const current = steps[step];

  if (done) {
    return (
      <View style={styles.done}>
        <Text style={styles.doneEmoji}>🌿</Text>
        <Text style={styles.doneTitle}>You're here.</Text>
        <Text style={styles.doneBody}>You just guided your attention through five senses. That's your body learning "right now, I'm safe."</Text>
        <TouchableOpacity style={styles.resetBtn} onPress={() => { setStep(0); setDone(false); }}>
          <Text style={styles.resetText}>Do it again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.progress}>
        {steps.map((s, i) => <View key={i} style={[styles.dot, { backgroundColor: i <= step ? s.color : colors.border }]} />)}
      </View>
      <View style={[styles.card, { borderColor: current.color }]}>
        <Text style={[styles.countBig, { color: current.color }]}>{current.count}</Text>
        <Text style={[styles.senseLabel, { color: current.color }]}>things to {current.sense}</Text>
        <Text style={styles.prompt}>{current.prompt}</Text>
      </View>
      <Text style={styles.hint}>Take your time. There's no rush.</Text>
      <TouchableOpacity style={[styles.nextBtn, { backgroundColor: current.color }]}
        onPress={() => step < steps.length - 1 ? setStep(step + 1) : setDone(true)}>
        <Text style={styles.nextText}>
          {step < steps.length - 1 ? `Next — ${steps[step + 1].count} things to ${steps[step + 1].sense}` : 'Done'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingVertical: spacing.lg, alignItems: 'center' },
  progress: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.xl },
  dot: { width: 10, height: 10, borderRadius: 5 },
  card: { width: '90%', borderRadius: radius.xl, borderWidth: 2, padding: spacing.xl, alignItems: 'center', backgroundColor: colors.surface, marginBottom: spacing.lg },
  countBig: { fontSize: 72, fontWeight: '700', lineHeight: 80 },
  senseLabel: { ...typography.heading3, marginBottom: spacing.lg },
  prompt: { ...typography.body, textAlign: 'center', lineHeight: 26 },
  hint: { ...typography.bodySmall, marginBottom: spacing.xl },
  nextBtn: { width: '90%', paddingVertical: spacing.md, borderRadius: radius.full, alignItems: 'center' },
  nextText: { ...typography.body, fontWeight: '600', color: colors.bg },
  done: { alignItems: 'center', paddingVertical: spacing.xl, paddingHorizontal: spacing.xl },
  doneEmoji: { fontSize: 56, marginBottom: spacing.lg },
  doneTitle: { ...typography.heading1, color: colors.teal, marginBottom: spacing.md },
  doneBody: { ...typography.body, textAlign: 'center', marginBottom: spacing.xl, lineHeight: 26 },
  resetBtn: { paddingVertical: spacing.md, paddingHorizontal: spacing.xl, borderRadius: radius.full, borderWidth: 1, borderColor: colors.teal },
  resetText: { ...typography.body, color: colors.teal, fontWeight: '600' },
});
