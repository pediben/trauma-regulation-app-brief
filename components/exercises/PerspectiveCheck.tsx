import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, radius, typography } from '../../../constants/theme';

const TIME_FRAMES = [
  { label: '10 years', emoji: '🌍', question: 'Will this matter in 10 years?', context: 'Think about where you were 10 years ago. Most of what you worried about then has completely faded.' },
  { label: '5 years', emoji: '📅', question: 'Will this matter in 5 years?', context: 'Five years is a long time. Careers shift, relationships change, crises that felt permanent fade away.' },
  { label: '1 year', emoji: '🗓️', question: 'Will this matter in 1 year?', context: 'A year from now, will you still be thinking about this? Will it still feel this big?' },
  { label: '1 month', emoji: '📆', question: 'Will this matter in 1 month?', context: 'In 30 days, how large will this loom? Will it still feel this pressing?' },
  { label: '1 week', emoji: '🕐', question: 'Will this matter in 1 week?', context: 'By next week, will this still feel this big?' },
];

type Answer = 'yes' | 'no' | 'maybe';

export function PerspectiveCheck() {
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [done, setDone] = useState(false);

  function answer(a: Answer) {
    const next = [...answers, a];
    setAnswers(next);
    if (idx < TIME_FRAMES.length - 1) setIdx(idx + 1);
    else setDone(true);
  }

  if (done) {
    const noCount = answers.filter(a => a === 'no').length;
    const maybeCount = answers.filter(a => a === 'maybe').length;
    let message = noCount >= 3
      ? "Across most of these time frames, this worry doesn't hold up. That's not dismissal — it's perspective. The worry feels urgent right now, but time will diminish it."
      : maybeCount + noCount >= 3
      ? "The worry shrinks as you look further out. That's normal. Worries feel enormous in the present and smaller at a distance."
      : "This seems like something with real long-term weight. That means it deserves a clear action plan — not just worry. Consider using the Worry Analysis exercise.";

    return (
      <View style={styles.container}>
        <Text style={styles.emoji}>🔭</Text>
        <Text style={styles.title}>Perspective gained.</Text>
        <View style={styles.summaryCard}>
          {TIME_FRAMES.map((f, i) => (
            <View key={i} style={styles.answerRow}>
              <Text style={styles.answerFrame}>{f.emoji} {f.label}</Text>
              <Text style={[styles.answerBadge, { color: answers[i] === 'no' ? colors.calm : answers[i] === 'maybe' ? colors.activated : colors.textMuted }]}>
                {answers[i] === 'yes' ? 'Yes' : answers[i] === 'no' ? 'No' : 'Maybe'}
              </Text>
            </View>
          ))}
        </View>
        <Text style={styles.body}>{message}</Text>
        <TouchableOpacity style={styles.resetBtn} onPress={() => { setIdx(0); setAnswers([]); setDone(false); }}>
          <Text style={styles.resetText}>Try again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const frame = TIME_FRAMES[idx];
  return (
    <View style={styles.container}>
      <View style={styles.progress}>
        {TIME_FRAMES.map((_, i) => <View key={i} style={[styles.dot, i < idx && styles.dotDone, i === idx && styles.dotActive]} />)}
      </View>
      <Text style={styles.frameEmoji}>{frame.emoji}</Text>
      <Text style={styles.title}>{frame.question}</Text>
      <Text style={styles.context}>{frame.context}</Text>
      <View style={styles.btnRow}>
        <TouchableOpacity style={[styles.answerBtn, { borderColor: colors.calm }]} onPress={() => answer('no')}>
          <Text style={[styles.answerBtnText, { color: colors.calm }]}>No</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.answerBtn, { borderColor: colors.activated }]} onPress={() => answer('maybe')}>
          <Text style={[styles.answerBtnText, { color: colors.activated }]}>Maybe</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.answerBtn, { borderColor: colors.textMuted }]} onPress={() => answer('yes')}>
          <Text style={[styles.answerBtnText, { color: colors.textMuted }]}>Yes</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.hint}>"An old man was asked what had robbed him most of joy in life. He said: 'Things that never happened.'" — Carnegie</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', paddingVertical: spacing.lg, paddingHorizontal: spacing.md },
  progress: { flexDirection: 'row', gap: 6, marginBottom: spacing.xl },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.border },
  dotDone: { backgroundColor: colors.teal },
  dotActive: { width: 20, backgroundColor: colors.teal },
  frameEmoji: { fontSize: 56, marginBottom: spacing.md },
  title: { ...typography.heading2, textAlign: 'center', marginBottom: spacing.md },
  context: { ...typography.body, textAlign: 'center', color: colors.textSecondary, lineHeight: 26, marginBottom: spacing.xl },
  btnRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.xl },
  answerBtn: { flex: 1, borderWidth: 2, borderRadius: radius.full, paddingVertical: spacing.md, alignItems: 'center' },
  answerBtnText: { ...typography.body, fontWeight: '600' },
  hint: { ...typography.bodySmall, textAlign: 'center', fontStyle: 'italic', paddingHorizontal: spacing.md },
  emoji: { fontSize: 48, marginBottom: spacing.md },
  summaryCard: { width: '100%', backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.lg, borderWidth: 1, borderColor: colors.border },
  answerRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.xs },
  answerFrame: { ...typography.body },
  answerBadge: { ...typography.body, fontWeight: '600' },
  body: { ...typography.body, textAlign: 'center', lineHeight: 26, marginBottom: spacing.lg, color: colors.textSecondary },
  resetBtn: { paddingVertical: spacing.sm, paddingHorizontal: spacing.xl, borderRadius: radius.full, borderWidth: 1, borderColor: colors.teal },
  resetText: { ...typography.body, color: colors.teal, fontWeight: '600' },
});
