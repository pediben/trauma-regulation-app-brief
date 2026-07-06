import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, radius, typography } from '../../../constants/theme';

const STEPS = [
  { title: 'Slow down', body: "Whatever pace you were moving at — let it slow. You don't need to go anywhere right now. Let your shoulders drop if they want to." },
  { title: 'Look around slowly', body: "Turn your head slowly and scan the room. Move like a curious animal checking out a new space — not searching for threats, just looking. Let your eyes rest on anything that feels neutral or pleasant." },
  { title: 'Notice something safe', body: "Find one object, texture, color, or view that feels okay to look at. It doesn't have to be beautiful — just not alarming. Let your eyes rest there for a few breaths." },
  { title: 'Notice the space around you', body: 'Widen your attention to the room. Where are the exits? Where is the light coming from? Where are you in the room? You are here. This is the present moment.' },
  { title: 'Take a breath', body: "One slow exhale. Let the room hold you for a moment. You can come back to this any time — a slow look around is one of the simplest ways to signal 'safe' to a worried nervous system." },
];

export function Orienting() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const current = STEPS[step];

  if (done) {
    return (
      <View style={styles.done}>
        <Text style={styles.doneEmoji}>🧭</Text>
        <Text style={styles.doneTitle}>You've oriented.</Text>
        <Text style={styles.doneBody}>You just did something your nervous system needed — looked around calmly and registered "I'm here, I'm safe." That signal travels all the way down from your eyes to your brainstem.</Text>
        <TouchableOpacity style={styles.resetBtn} onPress={() => { setStep(0); setDone(false); }}>
          <Text style={styles.resetText}>Do it again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.progress}>
        {STEPS.map((_, i) => <View key={i} style={[styles.dot, i < step && styles.dotDone, i === step && styles.dotActive]} />)}
      </View>
      <Text style={styles.stepNum}>Step {step + 1} of {STEPS.length}</Text>
      <View style={styles.card}>
        <Text style={styles.title}>{current.title}</Text>
        <Text style={styles.body}>{current.body}</Text>
      </View>
      <TouchableOpacity style={styles.nextBtn} onPress={() => step < STEPS.length - 1 ? setStep(s => s + 1) : setDone(true)}>
        <Text style={styles.nextText}>{step < STEPS.length - 1 ? 'Next →' : 'Done'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', paddingVertical: spacing.lg },
  progress: { flexDirection: 'row', gap: 6, marginBottom: spacing.lg },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.border },
  dotDone: { backgroundColor: colors.activated },
  dotActive: { width: 20, backgroundColor: colors.activated },
  stepNum: { ...typography.label, color: colors.textMuted, marginBottom: spacing.md },
  card: { width: '90%', backgroundColor: colors.surface, borderRadius: radius.xl, borderWidth: 1, borderColor: colors.border, padding: spacing.xl, marginBottom: spacing.xl },
  title: { ...typography.heading3, color: colors.activated, marginBottom: spacing.md },
  body: { ...typography.body, lineHeight: 28 },
  nextBtn: { paddingVertical: spacing.md, paddingHorizontal: spacing.xxl, borderRadius: radius.full, backgroundColor: colors.activated },
  nextText: { ...typography.body, color: colors.bg, fontWeight: '700' },
  done: { alignItems: 'center', paddingVertical: spacing.xl, paddingHorizontal: spacing.xl },
  doneEmoji: { fontSize: 56, marginBottom: spacing.lg },
  doneTitle: { ...typography.heading1, color: colors.activated, marginBottom: spacing.md },
  doneBody: { ...typography.body, textAlign: 'center', marginBottom: spacing.xl, lineHeight: 26 },
  resetBtn: { paddingVertical: spacing.md, paddingHorizontal: spacing.xl, borderRadius: radius.full, borderWidth: 1, borderColor: colors.activated },
  resetText: { ...typography.body, color: colors.activated, fontWeight: '600' },
});
