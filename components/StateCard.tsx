import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { colors, spacing, radius, typography } from '../constants/theme';
import type { NervousSystemState } from '../constants/exercises';

const stateConfig: Record<NervousSystemState, { label: string; sub: string; color: string; bg: string; emoji: string }> = {
  activated: { label: 'On Alert', sub: "Anxious · tense · hypervigilant · can't stop thinking", color: colors.activated, bg: colors.activatedBg, emoji: '⚡' },
  calm: { label: 'In the Window', sub: 'Present · grounded · able to think and feel', color: colors.calm, bg: colors.calmBg, emoji: '🌿' },
  shutdown: { label: 'Shut Down', sub: 'Numb · foggy · frozen · disconnected', color: colors.shutDown, bg: colors.shutDownBg, emoji: '🌫️' },
};

interface Props { state: NervousSystemState; onPress: () => void; selected?: boolean; compact?: boolean; }

export function StateCard({ state, onPress, selected, compact }: Props) {
  const cfg = stateConfig[state];
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.75}
      style={[styles.card, { backgroundColor: cfg.bg, borderColor: selected ? cfg.color : 'transparent' }, compact && styles.compact]}>
      <View style={styles.row}>
        <Text style={[styles.emoji, compact && styles.emojiCompact]}>{cfg.emoji}</Text>
        <View style={{ flex: 1 }}>
          <Text style={[styles.label, { color: cfg.color }, compact && styles.labelCompact]}>{cfg.label}</Text>
          {!compact && <Text style={styles.sub}>{cfg.sub}</Text>}
        </View>
        {selected && <View style={[styles.dot, { backgroundColor: cfg.color }]} />}
      </View>
    </TouchableOpacity>
  );
}

export function stateLabel(state: NervousSystemState) { return stateConfig[state].label; }
export function stateColor(state: NervousSystemState) { return stateConfig[state].color; }

const styles = StyleSheet.create({
  card: { borderRadius: radius.lg, padding: spacing.md, marginBottom: spacing.sm, borderWidth: 2 },
  compact: { padding: spacing.sm, marginBottom: spacing.xs },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  emoji: { fontSize: 28 },
  emojiCompact: { fontSize: 20 },
  label: { ...typography.heading3, marginBottom: 2 },
  labelCompact: { fontSize: 15 },
  sub: { ...typography.bodySmall },
  dot: { width: 10, height: 10, borderRadius: 5 },
});
