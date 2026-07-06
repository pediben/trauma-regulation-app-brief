import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Modal, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, spacing, radius, typography } from '../../constants/theme';
import { CrisisButton } from '../../components/CrisisButton';
import { learnCards, type LearnCard } from '../../constants/learnContent';

function parseBody(text: string): { bold: boolean; text: string }[][] {
  return text.split('\n').map((line) => {
    const parts: { bold: boolean; text: string }[] = [];
    const regex = /\*\*(.*?)\*\*/g;
    let last = 0; let match;
    while ((match = regex.exec(line)) !== null) {
      if (match.index > last) parts.push({ bold: false, text: line.slice(last, match.index) });
      parts.push({ bold: true, text: match[1] });
      last = match.index + match[0].length;
    }
    if (last < line.length) parts.push({ bold: false, text: line.slice(last) });
    return parts;
  });
}

function CardDetail({ card, onClose }: { card: LearnCard; onClose: () => void }) {
  const lines = parseBody(card.body);
  return (
    <Modal visible animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView style={detail.safe}>
        <View style={detail.header}>
          <TouchableOpacity onPress={onClose} style={detail.closeBtn}>
            <MaterialIcons name="close" size={22} color={colors.textSecondary} />
          </TouchableOpacity>
          <Text style={detail.tag}>{card.tag}</Text>
        </View>
        <ScrollView style={detail.scroll} contentContainerStyle={detail.content}>
          <Text style={detail.emoji}>{card.emoji}</Text>
          <Text style={detail.title}>{card.title}</Text>
          <Text style={detail.summary}>{card.summary}</Text>
          <View style={detail.divider} />
          {lines.map((parts, li) => (
            <Text key={li} style={detail.bodyLine}>
              {parts.map((p, pi) => (
                <Text key={pi} style={p.bold ? detail.bold : undefined}>{p.text}</Text>
              ))}
            </Text>
          ))}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const detail = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', padding: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border },
  closeBtn: { padding: spacing.sm, marginRight: spacing.sm },
  tag: { ...typography.label, color: colors.teal },
  scroll: { flex: 1 },
  content: { padding: spacing.xl },
  emoji: { fontSize: 48, marginBottom: spacing.md },
  title: { ...typography.heading1, marginBottom: spacing.md },
  summary: { ...typography.body, color: colors.teal, fontStyle: 'italic', marginBottom: spacing.md },
  divider: { height: 1, backgroundColor: colors.border, marginBottom: spacing.lg },
  bodyLine: { ...typography.body, lineHeight: 28, marginBottom: spacing.sm },
  bold: { fontWeight: '700', color: colors.textPrimary },
});

export default function LearnTab() {
  const [open, setOpen] = useState<LearnCard | null>(null);
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.heading}>Learn</Text>
        <Text style={styles.sub}>Understanding what's happening in your body is the first step to changing it.</Text>
        {learnCards.map((card) => (
          <TouchableOpacity key={card.id} style={styles.card} onPress={() => setOpen(card)} activeOpacity={0.75}>
            <Text style={styles.cardEmoji}>{card.emoji}</Text>
            <View style={styles.cardBody}>
              <Text style={styles.cardTag}>{card.tag}</Text>
              <Text style={styles.cardTitle}>{card.title}</Text>
              <Text style={styles.cardSummary} numberOfLines={2}>{card.summary}</Text>
            </View>
            <MaterialIcons name="chevron-right" size={22} color={colors.textMuted} />
          </TouchableOpacity>
        ))}
        <CrisisButton />
      </ScrollView>
      {open && <CardDetail card={open} onClose={() => setOpen(null)} />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.lg, paddingTop: spacing.xl },
  heading: { ...typography.heading1, marginBottom: spacing.xs },
  sub: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.xl, lineHeight: 24 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.md, marginBottom: spacing.sm, borderWidth: 1, borderColor: colors.border, gap: spacing.md },
  cardEmoji: { fontSize: 32, width: 44, textAlign: 'center' },
  cardBody: { flex: 1 },
  cardTag: { ...typography.label, color: colors.teal, marginBottom: 2 },
  cardTitle: { ...typography.body, fontWeight: '600', marginBottom: 2 },
  cardSummary: { ...typography.bodySmall },
});
