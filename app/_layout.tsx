import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { colors } from '../constants/theme';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="exercise/[id]"
          options={{
            presentation: 'modal',
            animation: 'slide_from_bottom',
            headerShown: true,
            headerStyle: { backgroundColor: colors.surface },
            headerTintColor: colors.textPrimary,
            headerShadowVisible: false,
          }}
        />
      </Stack>
    </>
  );
}
