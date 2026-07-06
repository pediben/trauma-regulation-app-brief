export const colors = {
  bg: '#0F1A2E',
  surface: '#1A2742',
  surfaceHigh: '#243352',
  teal: '#4ECDC4',
  tealDim: '#2A8A85',
  purple: '#7B68EE',
  purpleDim: '#4A3FA0',
  textPrimary: '#F0F4FF',
  textSecondary: '#8FA3BF',
  textMuted: '#506080',
  activated: '#E8A058',
  activatedBg: '#2E1F0A',
  calm: '#4ECDC4',
  calmBg: '#0A2422',
  shutDown: '#8FA3BF',
  shutDownBg: '#141F30',
  crisis: '#E87070',
  crisisBg: '#2E0F0F',
  border: '#243352',
  tabBar: '#111D34',
};

export const typography = {
  heading1: { fontSize: 28, fontWeight: '700' as const, color: colors.textPrimary, letterSpacing: -0.5 },
  heading2: { fontSize: 22, fontWeight: '600' as const, color: colors.textPrimary },
  heading3: { fontSize: 17, fontWeight: '600' as const, color: colors.textPrimary },
  body: { fontSize: 16, fontWeight: '400' as const, color: colors.textPrimary, lineHeight: 24 },
  bodySmall: { fontSize: 14, fontWeight: '400' as const, color: colors.textSecondary, lineHeight: 20 },
  label: { fontSize: 12, fontWeight: '500' as const, color: colors.textMuted, letterSpacing: 0.8, textTransform: 'uppercase' as const },
};

export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 };
export const radius = { sm: 8, md: 12, lg: 16, xl: 24, full: 9999 };
