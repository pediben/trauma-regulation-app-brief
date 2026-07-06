import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { colors, spacing, radius, typography } from '../../../constants/theme';

const PROMPTS = [
  "Something or someone in my life that's working well right now...",
  'A small thing I often overlook but actually appreciate...',
  "Something about my situation — even minor — that could be worse but isn't...",
];

export function GratitudePractice() {
  const [items, setItems] = useState(['', '', '']);
  const [done, setDone] = useState(false);

  function updateItem(i: number, val: string) {
    const next = [...items]; next[i] = val; setItems(next);
  }

  const allFilled = items.every(s => s.trim().length > 0);

  if (done) {
    return (
      <View style={styles.container}>
        <Text style={styles.emoji}>🌟</Text>
        <Text style={styles.title}>Three things right now.</Text>
        {items.map((item, i) => (
          <View key={i} style={styles.itemCard}>
            <Text style={styles.itemNum}>{i + 1}</Text>
            <Text style={styles.itemText}>{item}</Text>
          </View>
        ))}
        <View style={styles.quoteCard}>
          <Text style={styles.quoteText}>"Two people looked out from prison bars. One saw mud, the other saw stars."</Text>
          <Text style={styles.quoteAttr}>— Dale Carnegie</Text>
        </View>
        <Text style={styles.body}>Same life. Different focus. Gratitude doesn't erase what's hard — it puts it in the context of what's also true.</Text>
        <TouchableOpacity style={styles.resetBtn} onPress={() => { setItems(['', '', '']); setDone(false); }}>
          <Text style={styles.resetText}>Write new ones</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
      <View style={styles.container}>
        <Text style={styles.emoji}>🌿</Text>
        <Text style={styles.title}>Count your blessings</Text>
        <Text style={styles.body}>Carnegie found that shifting attention to what's working is one of the fastest ways to settle worry. Not toxic positivity — just honest accounting of what's also true right now.</Text>
        {PROMPTS.map((prompt, i) => (
          <View key={i} style={styles.inputGroup}>
            <Text style={styles.inputNum}>{i + 1}.</Text>
            <TextInput style={styles.input} placeholder={prompt} placeholderTextColor={colors.textMuted} multiline value={items[i]} onChangeText={(v) => updateItem(i, v)} />
          </View>
        ))}
        <TouchableOpacity style={[styles.btn, !allFilled && styles.btnDisabled]} disabled={!allFilled} onPress={() => setDone(true)}>
          <Text style={styles.btnText}>Done ✓</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { alignItems: 'center', paddingVertical: spacing.lg, paddingHorizontal: spacing.md },
  emoji: { fontSize: 48, marginBottom: spacing.md },
  title: { ...typography.heading2, textAlign: 'center', marginBottom: spacing.md },
  body: { ...typography.body, textAlign: 'center', lineHeight: 26, marginBottom: spacing.lg, color: colors.textSecondary },
  inputGroup: { flexDirection: 'row', gap: spacing.sm, width: '100%', marginBottom: spacing.md, alignItems: 'flex-start' },
  inputNum: { ...typography.heading3, color: colors.teal, marginTop: spacing.sm, minWidth: 20 },
  input: { flex: 1, backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.md, ...typography.body, color: colors.textPrimary, minHeight: 70, textAlignVertical: 'top', borderWidth: 1, borderColor: colors.border },
  btn: { width: '100%', backgroundColor: colors.teal, borderRadius: radius.full, paddingVertical: spacing.md, alignItems: 'center', marginTop: spacing.sm },
  btnDisabled: { backgroundColor: colors.surfaceHigh },
  btnText: { ...typography.body, fontWeight: '700', color: colors.bg },
  itemCard: { flexDirection: 'row', gap: spacing.md, width: '100%', backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.md, marginBottom: spacing.sm, borderWidth: 1, borderColor: colors.border, alignItems: 'flex-start' },
  itemNum: { ...typography.heading3, color: colors.teal, minWidth: 20 },
  itemText: { ...typography.body, flex: 1, lineHeight: 24 },
  quoteCard: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.lg, width: '100%', borderLeftWidth: 3, borderLeftColor: colors.teal },
  quoteText: { ...typography.body, fontStyle: 'italic', lineHeight: 26, marginBottom: spacing.xs },
  quoteAttr: { ...typography.label, color: colors.textMuted },
  resetBtn: { paddingVertical: spacing.sm, paddingHorizontal: spacing.xl, borderRadius: radius.full, borderWidth: 1, borderColor: colors.teal, marginTop: spacing.md },
  resetText: { ...typography.body, color: colors.teal, fontWeight: '600' },
});
