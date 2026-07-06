import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, spacing, radius, typography } from '../../constants/theme';
import { StateCard } from '../../components/StateCard';
import { CrisisButton } from '../../components/CrisisButton';
import { exercisesForState } from '../../constants/exercises';
import type { NervousSystemState } from '../../constants/exercises';

export default function CalmNow() {
  const [selectedState, setSelectedState] = useState<NervousSystemState | null>(null);
  const router = useRouter();
  const exercises = selectedState ? exercisesForState(selectedState) : [];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Regulate</Text>
          <Text style={styles.subheading}>How does your body feel right now?</Text>
        </View>

        {(['activated', 'calm', 'shutdown'] as NervousSystemState[]).map((state) => (
          <StateCard
            key={state}
            state={state}
            selected={selectedState === state}
            onPress={() => setSelectedState(selectedState === state ? null : state)}
          />
        ))}

        {selectedState && exercises.length > 0 && (
          <View style={styles.exercisesSection}>
            <Text style={styles.sectionLabel}>Exercises for you right now</Text>
            {exercises.map((ex) => (
              <TouchableOpacity
                key={ex.id}
                style={styles.exerciseCard}
                onPress={() => router.push(`/exercise/${ex.id}`)}
                activeOpacity={0.75}
              >
                <View style={styles.exLeft}>
                  <Text style={styles.exTitle}>{ex.title}</Text>
                  <Text style={styles.exSub}>{ex.subtitle}</Text>
                  <Text style={styles.exDuration}>~{ex.durationMin} min</Text>
                </View>
                <MaterialIcons name="chevron-right" size={24} color={colors.textMuted} />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {!selectedState && (
          <View style={styles.emptyHint}>
            <Text style={styles.emptyText}>
              Pick the state that's closest to how you feel. You'll get matched exercises to help you settle.
            </Text>
          </View>
        )}

        <CrisisButton />
        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { flex: 1 },
  content: { padding: spacing.lg, paddingTop: spacing.xl },
  header: { marginBottom: spacing.xl },
  greeting: { ...typography.heading1, marginBottom: spacing.xs },
  subheading: { ...typography.body, color: colors.textSecondary },
  exercisesSection: { marginTop: spacing.xl },
  sectionLabel: { ...typography.label, marginBottom: spacing.md },
  exerciseCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface,
    borderRadius: radius.lg, padding: spacing.md, marginBottom: spacing.sm,
    borderWidth: 1, borderColor: colors.border,
  },
  exLeft: { flex: 1 },
  exTitle: { ...typography.body, fontWeight: '600' },
  exSub: { ...typography.bodySmall, marginTop: 2 },
  exDuration: { ...typography.label, marginTop: spacing.xs, color: colors.teal },
  emptyHint: {
    marginTop: spacing.xl, padding: spacing.lg, backgroundColor: colors.surface,
    borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border,
  },
  emptyText: { ...typography.body, color: colors.textSecondary, textAlign: 'center', lineHeight: 24 },
});
