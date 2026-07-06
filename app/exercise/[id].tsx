import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { colors, spacing, radius, typography } from '../../constants/theme';
import { exerciseById } from '../../constants/exercises';
import { BoxBreathing } from '../../components/exercises/BoxBreathing';
import { LongExhale } from '../../components/exercises/LongExhale';
import { Grounding54321 } from '../../components/exercises/Grounding54321';
import { BilateralDot } from '../../components/exercises/BilateralDot';
import { BodyScan } from '../../components/exercises/BodyScan';
import { Orienting } from '../../components/exercises/Orienting';
import { WorryAnalysis } from '../../components/exercises/WorryAnalysis';
import { PerspectiveCheck } from '../../components/exercises/PerspectiveCheck';
import { LawOfAverages } from '../../components/exercises/LawOfAverages';
import { GratitudePractice } from '../../components/exercises/GratitudePractice';

const EXERCISE_COMPONENTS: Record<string, React.ComponentType> = {
  'box-breathing': BoxBreathing,
  'long-exhale': LongExhale,
  'grounding-54321': Grounding54321,
  'bilateral-tapping': BilateralDot,
  'body-scan': BodyScan,
  'orienting': Orienting,
  'activate-breath': LongExhale,
  'worry-analysis': WorryAnalysis,
  'perspective-check': PerspectiveCheck,
  'law-of-averages': LawOfAverages,
  'gratitude': GratitudePractice,
};

export default function ExerciseScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();
  const exercise = exerciseById(id);

  useEffect(() => {
    if (exercise) navigation.setOptions({ title: exercise.title });
  }, [exercise]);

  if (!exercise) {
    return (
      <View style={styles.center}>
        <Text style={typography.body}>Exercise not found.</Text>
      </View>
    );
  }

  const ExerciseComponent = EXERCISE_COMPONENTS[id];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.descCard}>
          <Text style={styles.description}>{exercise.description}</Text>
        </View>
        {ExerciseComponent ? (
          <ExerciseComponent />
        ) : (
          <View style={styles.placeholder}>
            <Text style={typography.bodySmall}>Coming soon.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.lg },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.bg },
  descCard: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.lg, borderWidth: 1, borderColor: colors.border },
  description: { ...typography.body, lineHeight: 26, color: colors.textSecondary },
  placeholder: { height: 120, justifyContent: 'center', alignItems: 'center' },
});
