import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, radius, typography } from '../../../constants/theme';

const PERCENTAGES = [5, 10, 20, 30, 40, 50, 60, 70, 80, 90];

function getReflection(pct: number): string {
  if (pct <= 10) return 'Less than 1 in 10 chance. Carnegie studied thousands of worries and found the vast majority never came true. This looks like one of those.';
  if (pct <= 30) return "A small but real chance. Worth having a plan — but not worth constant mental energy. Most of your attention should be on what you can do, not on dreading the outcome.";
  if (pct <= 50) return "About a coin flip. That also means there's a 50%+ chance it doesn't happen. Are you spending 50% of your mental energy on the half that might not come true?";
  if (pct <= 70) return "A real possibility. This one deserves a plan. What would you do if it happened? A clear plan reduces the grip worry has — you stop having to work it out mid-panic.";
  return "High odds. This deserves your full attention — but as action, not worry. Worry and action feel similar from the inside but produce very different results.";
}

type Step = 'pick' | 'reflect' | 'done';

export function LawOfAverages() {
  const [selected, setSelected] = useState<number | null>(null);
  const [step, setStep] = useState<Step>('pick');

  if (step === 'pick') {
    return (
      <View style={styles.container}>
        <Text style={styles.emoji}>🎲</Text>
        <Text style={styles.title}>What are the actual odds?</Text>
        <Text style={styles.body}>Carnegie found that most worriers dramatically overestimate the probability of bad outcomes. Be honest: what are the realistic odds your worry comes true?</Text>
        <View style={styles.grid}>
          {PERCENTAGES.map(pct => (
            <TouchableOpacity key={pct} style={[styles.pctBtn, selected === pct && styles.pctBtnSelected]} onPress={() => setSelected(pct)}>
              <Text style={[styles.pctText, selected === pct && styles.pctTextSelected]}>{pct}%</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={[styles.btn, selected === null && styles.btnDisabled]} disabled={selected === null} onPress={() => setStep('reflect')}>
          <Text style={styles.btnText}>See what this means →</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (step === 'reflect') {
    return (
      <View style={styles.container}>
        <View style={styles.oddsDisplay}>
          <Text style={styles.oddsBig}>{selected}%</Text>
          <Text style={styles.oddsLabel}>estimated chance</Text>
        </View>
        <Text style={styles.body}>{getReflection(selected!)}</Text>
        <View style={styles.statCard}>
          <Text style={styles.statTitle}>What people actually worry about:</Text>
          <Text style={styles.statItem}>• ~40% of worries never happen</Text>
          <Text style={styles.statItem}>• ~30% already happened and can't be changed</Text>
          <Text style={styles.statItem}>• ~22% are about trivial things</Text>
          <Text style={styles.statItem}>• ~8% are real — and those are solvable</Text>
        </View>
        <TouchableOpacity style={styles.btn} onPress={() => setStep('done')}>
          <Text style={styles.btnText}>I see it →</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>💡</Text>
      <Text style={styles.title}>You estimated {selected}%.</Text>
      <Text style={styles.body}>Whether that's low or high, the next step is the same: decide what you'll do about it, then move your attention there. Worry is thinking about a problem. Action is doing something about it.</Text>
      <Text style={[styles.body, { color: colors.teal, fontWeight: '600' }]}>"Do the thing you fear to do, and the death of fear is certain." — Carnegie</Text>
      <TouchableOpacity style={styles.resetBtn} onPress={() => { setSelected(null); setStep('pick'); }}>
        <Text style={styles.resetText}>Try a different number</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', paddingVertical: spacing.lg, paddingHorizontal: spacing.md },
  emoji: { fontSize: 48, marginBottom: spacing.md },
  title: { ...typography.heading2, textAlign: 'center', marginBottom: spacing.md },
  body: { ...typography.body, textAlign: 'center', lineHeight: 26, marginBottom: spacing.lg, color: colors.textSecondary },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, justifyContent: 'center', marginBottom: spacing.xl },
  pctBtn: { width: 68, paddingVertical: spacing.md, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, alignItems: 'center' },
  pctBtnSelected: { borderColor: colors.teal, backgroundColor: `${colors.teal}22` },
  pctText: { ...typography.body, fontWeight: '600', color: colors.textMuted },
  pctTextSelected: { color: colors.teal },
  btn: { width: '100%', backgroundColor: colors.teal, borderRadius: radius.full, paddingVertical: spacing.md, alignItems: 'center' },
  btnDisabled: { backgroundColor: colors.surfaceHigh },
  btnText: { ...typography.body, fontWeight: '700', color: colors.bg },
  oddsDisplay: { marginBottom: spacing.lg, alignItems: 'center' },
  oddsBig: { fontSize: 64, fontWeight: '700', color: colors.teal, lineHeight: 72 },
  oddsLabel: { ...typography.label, color: colors.textMuted },
  statCard: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.lg, width: '100%', borderWidth: 1, borderColor: colors.border },
  statTitle: { ...typography.bodySmall, marginBottom: spacing.sm, color: colors.textSecondary },
  statItem: { ...typography.body, marginBottom: spacing.xs },
  resetBtn: { paddingVertical: spacing.sm, paddingHorizontal: spacing.xl, borderRadius: radius.full, borderWidth: 1, borderColor: colors.teal, marginTop: spacing.md },
  resetText: { ...typography.body, color: colors.teal, fontWeight: '600' },
});
