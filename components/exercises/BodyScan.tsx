import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, radius, typography } from '../../../constants/theme';

const REGIONS = [
  { id: 'feet', label: 'Feet & toes', prompt: 'Notice your feet. Are they warm or cold? What surface are they on? Can you feel your toes?' },
  { id: 'legs', label: 'Legs & hips', prompt: 'Move attention to your calves, knees, and thighs. Notice the weight of your legs. Any tightness or ease?' },
  { id: 'belly', label: 'Belly & lower back', prompt: "Notice your belly rising and falling as you breathe. Any holding or tension here? You don't need to change it." },
  { id: 'chest', label: 'Chest & upper back', prompt: 'Notice your chest. Is it open or tight? Where do you feel your breath most clearly here?' },
  { id: 'shoulders', label: 'Shoulders & neck', prompt: "Many people hold tension here. Whatever you find — just notice it. You don't need to fix it." },
  { id: 'face', label: 'Face & jaw', prompt: 'Notice your jaw — is it clenched or loose? Your forehead. Your eyes. Let your face be whatever it is right now.' },
];

export function BodyScan() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [autoSeconds, setAutoSeconds] = useState<number | null>(null);

  useEffect(() => {
    if (autoSeconds === null) return;
    if (autoSeconds <= 0) {
      if (step < REGIONS.length - 1) { setStep(s => s + 1); setAutoSeconds(20); }
      else { setDone(true); setAutoSeconds(null); }
      return;
    }
    const t = setTimeout(() => setAutoSeconds(s => (s ?? 0) - 1), 1000);
    return () => clearTimeout(t);
  }, [autoSeconds, step]);

  if (done) {
    return (
      <View style={styles.done}>
        <Text style={styles.doneEmoji}>🌊</Text>
        <Text style={styles.doneTitle}>Scan complete.</Text>
        <Text style={styles.doneBody}>You just gave your body full attention for a few minutes. That is the practice — noticing without needing to change anything.</Text>
        <TouchableOpacity style={styles.resetBtn} onPress={() => { setStep(0); setDone(false); setAutoSeconds(null); }}>
          <Text style={styles.resetText}>Start over</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const region = REGIONS[step];
  return (
    <View style={styles.container}>
      <View style={styles.progress}>
        {REGIONS.map((r, i) => <View key={r.id} style={[styles.progressDot, i < step && styles.progressDone, i === step && styles.progressActive]} />)}
      </View>
      <Text style={styles.regionLabel}>{region.label}</Text>
      <View style={styles.card}><Text style={styles.prompt}>{region.prompt}</Text></View>
      {autoSeconds !== null && <Text style={styles.autoTimer}>Moving on in {autoSeconds}s…</Text>}
      <View style={styles.buttons}>
        {autoSeconds === null ? (
          <>
            <TouchableOpacity style={styles.autoBtn} onPress={() => setAutoSeconds(20)}>
              <Text style={styles.autoBtnText}>Auto (20s each)</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.nextBtn} onPress={() => step < REGIONS.length - 1 ? setStep(s => s + 1) : setDone(true)}>
              <Text style={styles.nextText}>{step < REGIONS.length - 1 ? 'Next area →' : 'Finish'}</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity style={styles.autoBtn} onPress={() => setAutoSeconds(null)}>
            <Text style={styles.autoBtnText}>Go at my own pace</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', paddingVertical: spacing.lg },
  progress: { flexDirection: 'row', gap: 6, marginBottom: spacing.xl },
  progressDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.border },
  progressDone: { backgroundColor: colors.purple },
  progressActive: { width: 20, backgroundColor: colors.purple },
  regionLabel: { ...typography.label, color: colors.purple, marginBottom: spacing.md },
  card: { width: '90%', backgroundColor: colors.surface, borderRadius: radius.xl, borderWidth: 1, borderColor: colors.border, padding: spacing.xl, marginBottom: spacing.lg },
  prompt: { ...typography.body, lineHeight: 28, textAlign: 'center' },
  autoTimer: { ...typography.bodySmall, color: colors.textMuted, marginBottom: spacing.lg },
  buttons: { flexDirection: 'row', gap: spacing.md },
  autoBtn: { paddingVertical: spacing.sm, paddingHorizontal: spacing.lg, borderRadius: radius.full, borderWidth: 1, borderColor: colors.border },
  autoBtnText: { ...typography.bodySmall, color: colors.textSecondary },
  nextBtn: { paddingVertical: spacing.sm, paddingHorizontal: spacing.lg, borderRadius: radius.full, backgroundColor: colors.purple },
  nextText: { ...typography.bodySmall, color: '#fff', fontWeight: '600' },
  done: { alignItems: 'center', paddingVertical: spacing.xl, paddingHorizontal: spacing.xl },
  doneEmoji: { fontSize: 56, marginBottom: spacing.lg },
  doneTitle: { ...typography.heading1, color: colors.purple, marginBottom: spacing.md },
  doneBody: { ...typography.body, textAlign: 'center', marginBottom: spacing.xl, lineHeight: 26 },
  resetBtn: { paddingVertical: spacing.md, paddingHorizontal: spacing.xl, borderRadius: radius.full, borderWidth: 1, borderColor: colors.purple },
  resetText: { ...typography.body, color: colors.purple, fontWeight: '600' },
});
