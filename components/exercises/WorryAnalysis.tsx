import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { colors, spacing, radius, typography } from '../../../constants/theme';

const STEPS = ['intro', 'write_it_down', 'worst_case', 'accept', 'improve', 'done'] as const;
type Step = typeof STEPS[number];

export function WorryAnalysis() {
  const [step, setStep] = useState<Step>('intro');
  const [worry, setWorry] = useState('');
  const [worstCase, setWorstCase] = useState('');
  const [improvement, setImprovement] = useState('');

  function next() {
    const idx = STEPS.indexOf(step);
    if (idx < STEPS.length - 1) setStep(STEPS[idx + 1]);
  }
  function reset() { setStep('intro'); setWorry(''); setWorstCase(''); setImprovement(''); }

  if (step === 'intro') {
    return (
      <View style={styles.container}>
        <Text style={styles.emoji}>✍️</Text>
        <Text style={styles.title}>Carnegie's Magic Formula</Text>
        <Text style={styles.body}>Dale Carnegie found that worry almost always lives in the imagination — not on paper. When you write it down and face it directly, it loses most of its power.</Text>
        <Text style={styles.body}>This takes about 5 minutes. You'll write down the worry, identify the worst that could happen, accept it mentally, and then focus on what you can actually do.</Text>
        <TouchableOpacity style={styles.btn} onPress={next}><Text style={styles.btnText}>Begin</Text></TouchableOpacity>
      </View>
    );
  }
  if (step === 'write_it_down') {
    return (
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
        <View style={styles.container}>
          <Text style={styles.stepLabel}>Step 1 of 4</Text>
          <Text style={styles.title}>Write it down</Text>
          <Text style={styles.body}>What exactly are you worried about? Be as specific as you can. Vague worries are the most powerful — naming them precisely weakens them.</Text>
          <TextInput style={styles.input} placeholder="I'm worried that..." placeholderTextColor={colors.textMuted} multiline value={worry} onChangeText={setWorry} autoFocus />
          <TouchableOpacity style={[styles.btn, !worry.trim() && styles.btnDisabled]} onPress={next} disabled={!worry.trim()}><Text style={styles.btnText}>Next →</Text></TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }
  if (step === 'worst_case') {
    return (
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
        <View style={styles.container}>
          <Text style={styles.stepLabel}>Step 2 of 4</Text>
          <Text style={styles.title}>What's the worst that could happen?</Text>
          <View style={styles.quoteCard}><Text style={styles.worryText}>"{worry}"</Text></View>
          <Text style={styles.body}>If this worry came true, what's the realistic worst outcome? Not catastrophizing — what would actually happen?</Text>
          <TextInput style={styles.input} placeholder="The worst that could realistically happen is..." placeholderTextColor={colors.textMuted} multiline value={worstCase} onChangeText={setWorstCase} autoFocus />
          <TouchableOpacity style={[styles.btn, !worstCase.trim() && styles.btnDisabled]} onPress={next} disabled={!worstCase.trim()}><Text style={styles.btnText}>Next →</Text></TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }
  if (step === 'accept') {
    return (
      <View style={styles.container}>
        <Text style={styles.stepLabel}>Step 3 of 4</Text>
        <Text style={styles.title}>Accept it mentally</Text>
        <View style={styles.quoteCard}><Text style={styles.worryText}>Worst case: "{worstCase}"</Text></View>
        <Text style={styles.body}>Carnegie's key insight: once you clearly accept the worst that could happen, you stop fighting it in your mind. That releases the mental energy you've been burning on worry.</Text>
        <Text style={styles.body}>This doesn't mean you want it to happen. It means: "If this is what happens, I would survive it and find a way forward."</Text>
        <Text style={[styles.body, { color: colors.teal, fontWeight: '600' }]}>Say to yourself: "If this is what happens, I can face it."</Text>
        <TouchableOpacity style={styles.btn} onPress={next}><Text style={styles.btnText}>I can face it →</Text></TouchableOpacity>
      </View>
    );
  }
  if (step === 'improve') {
    return (
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
        <View style={styles.container}>
          <Text style={styles.stepLabel}>Step 4 of 4</Text>
          <Text style={styles.title}>Now improve on it</Text>
          <Text style={styles.body}>You've accepted the worst. Now: what's one thing you could actually do — starting today — that would reduce the chances of that worst case happening, or make it easier to handle if it did?</Text>
          <TextInput style={styles.input} placeholder="One thing I could do is..." placeholderTextColor={colors.textMuted} multiline value={improvement} onChangeText={setImprovement} autoFocus />
          <TouchableOpacity style={[styles.btn, !improvement.trim() && styles.btnDisabled]} onPress={next} disabled={!improvement.trim()}><Text style={styles.btnText}>Done ✓</Text></TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.emoji}>✅</Text>
      <Text style={styles.title}>You've faced it.</Text>
      <View style={styles.summaryCard}>
        <Text style={styles.summaryLabel}>The worry</Text>
        <Text style={styles.summaryText}>{worry}</Text>
        <Text style={[styles.summaryLabel, { marginTop: spacing.md }]}>Worst case</Text>
        <Text style={styles.summaryText}>{worstCase}</Text>
        <Text style={[styles.summaryLabel, { marginTop: spacing.md }]}>Your next step</Text>
        <Text style={[styles.summaryText, { color: colors.teal }]}>{improvement}</Text>
      </View>
      <Text style={styles.body}>Carnegie found that this process — writing it down, facing the worst, and making a plan — eliminated most worry immediately. The worry isn't gone, but you're no longer stuck inside it.</Text>
      <TouchableOpacity style={[styles.btn, { backgroundColor: colors.surfaceHigh, borderWidth: 1, borderColor: colors.teal }]} onPress={reset}>
        <Text style={[styles.btnText, { color: colors.teal }]}>Start over with a new worry</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { alignItems: 'center', paddingVertical: spacing.lg, paddingHorizontal: spacing.md },
  emoji: { fontSize: 48, marginBottom: spacing.md },
  stepLabel: { ...typography.label, color: colors.textMuted, marginBottom: spacing.sm },
  title: { ...typography.heading2, textAlign: 'center', marginBottom: spacing.md },
  body: { ...typography.body, textAlign: 'center', lineHeight: 26, marginBottom: spacing.md, color: colors.textSecondary },
  quoteCard: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.md, marginBottom: spacing.md, borderLeftWidth: 3, borderLeftColor: colors.teal, width: '100%' },
  worryText: { ...typography.bodySmall, fontStyle: 'italic', lineHeight: 22 },
  input: { width: '100%', backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.md, ...typography.body, color: colors.textPrimary, minHeight: 100, textAlignVertical: 'top', borderWidth: 1, borderColor: colors.border, marginBottom: spacing.lg },
  btn: { width: '100%', backgroundColor: colors.teal, borderRadius: radius.full, paddingVertical: spacing.md, alignItems: 'center' },
  btnDisabled: { backgroundColor: colors.surfaceHigh },
  btnText: { ...typography.body, fontWeight: '700', color: colors.bg },
  summaryCard: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.lg, width: '100%', borderWidth: 1, borderColor: colors.border },
  summaryLabel: { ...typography.label, color: colors.textMuted, marginBottom: spacing.xs },
  summaryText: { ...typography.body, lineHeight: 24 },
});
