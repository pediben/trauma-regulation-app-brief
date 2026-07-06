export type NervousSystemState = 'activated' | 'calm' | 'shutdown';

export interface Exercise {
  id: string;
  title: string;
  subtitle: string;
  durationMin: number;
  icon: string;
  description: string;
  forStates: NervousSystemState[];
  featured?: boolean;
}

export const exercises: Exercise[] = [
  {
    id: 'long-exhale',
    title: 'Long Exhale Breathing',
    subtitle: 'Slow the nervous system',
    durationMin: 3,
    icon: 'air',
    description: 'A long exhale directly activates your parasympathetic brake — the system that slows heart rate and lowers alertness. Inhale for 4 counts, hold for 2, exhale for 6–8.',
    forStates: ['activated', 'calm'],
    featured: true,
  },
  {
    id: 'box-breathing',
    title: 'Box Breathing',
    subtitle: 'Balance your breath',
    durationMin: 4,
    icon: 'crop-square',
    description: 'Used by first responders and athletes to settle an activated system. Inhale 4, hold 4, exhale 4, hold 4. The square pattern creates a steady rhythm.',
    forStates: ['activated'],
  },
  {
    id: 'grounding-54321',
    title: '5-4-3-2-1 Grounding',
    subtitle: 'Return to the present moment',
    durationMin: 3,
    icon: 'touch-app',
    description: 'Brings attention into your senses and out of threat-mode thinking. Notice 5 things you can see, 4 you can hear, 3 you can feel, 2 you can smell, 1 you can taste.',
    forStates: ['activated', 'shutdown'],
  },
  {
    id: 'orienting',
    title: 'Orienting',
    subtitle: "Tell your body it's safe here",
    durationMin: 2,
    icon: 'panorama',
    description: "Slowly scan the room — the way a curious animal checks its surroundings. Let your eyes linger on things that feel neutral or pleasant. This signals 'no threat here' to the brainstem.",
    forStates: ['activated', 'shutdown', 'calm'],
  },
  {
    id: 'body-scan',
    title: 'Body Scan',
    subtitle: 'Notice without judgment',
    durationMin: 5,
    icon: 'accessibility',
    description: "Move attention slowly through the body — feet, legs, belly, chest, shoulders, face. No need to change anything. Just notice what's there. Helps reconnect when feeling numb or disconnected.",
    forStates: ['shutdown', 'calm'],
    featured: true,
  },
  {
    id: 'bilateral-tapping',
    title: 'Bilateral Tapping',
    subtitle: 'A calming left-right rhythm',
    durationMin: 3,
    icon: 'radio-button-checked',
    description: "A gentle left-right rhythm that soothes the nervous system. Follow the dot or alternate tapping your knees. This is a calming aid — not EMDR therapy. Follow your therapist's guidance if you're in EMDR treatment.",
    forStates: ['activated', 'shutdown'],
  },
  {
    id: 'activate-breath',
    title: 'Activating Breath',
    subtitle: 'Gently wake up a shut-down system',
    durationMin: 3,
    icon: 'wb-sunny',
    description: "When the system shuts down, a slightly energizing breath can help. Inhale fully and quickly, exhale fully and slowly. Focus on filling the chest. Go gently — there's no rush.",
    forStates: ['shutdown'],
  },
  {
    id: 'worry-analysis',
    title: 'Worry Analysis',
    subtitle: 'Write it down, face the worst',
    durationMin: 5,
    icon: 'edit-note',
    description: "Carnegie's magic formula: get your worry onto paper, face the worst that could happen, accept it mentally, then focus on what you can actually do.",
    forStates: ['activated'],
    featured: true,
  },
  {
    id: 'perspective-check',
    title: 'Perspective Check',
    subtitle: 'Will this matter in 5 years?',
    durationMin: 2,
    icon: 'access-time',
    description: "Walk your worry through time frames. Carnegie found that most of what we worry about never happens — and what does rarely matters as long as we fear it will.",
    forStates: ['activated', 'calm'],
  },
  {
    id: 'law-of-averages',
    title: 'Law of Averages',
    subtitle: 'What are the actual odds?',
    durationMin: 3,
    icon: 'percent',
    description: 'Estimate the real probability your worry comes true. Carnegie discovered most worriers dramatically overestimate the likelihood of bad outcomes.',
    forStates: ['activated'],
  },
  {
    id: 'gratitude',
    title: 'Count Your Blessings',
    subtitle: "Shift attention to what's working",
    durationMin: 3,
    icon: 'favorite',
    description: 'Carnegie: "Two people looked through prison bars. One saw mud, the other saw stars." Gratitude shifts attention from threat to what\'s already there.',
    forStates: ['activated', 'shutdown', 'calm'],
  },
];

export function exercisesForState(state: NervousSystemState): Exercise[] {
  return exercises
    .filter((e) => e.forStates.includes(state))
    .sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
}

export function exerciseById(id: string): Exercise | undefined {
  return exercises.find((e) => e.id === id);
}
