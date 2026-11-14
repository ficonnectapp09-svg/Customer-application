import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeColors {
  primary: string;
  secondaryGold: string;
  softGold: string;
  goldBorder: string;
  primaryText: string;
  background: string;
  secondary: string;
  secondaryBg: string;
  grayDark: string;
  grayLight: string;
  cardBg: string;
  cardBgSecondary: string;
  cardBorder: string;
  cardBorderHighlight: string;
  cardBackground: string;
  elevatedCard: string;
  text: string;
  subtext: string;
  muted: string;
  textSecondary: string;
  inputBg: string;
  inputBorder: string;
  headerBg: string;
  headerBackground: string;
  headerText: string;
  tabBarBg: string;
  tabBarBorder: string;
  drawerBg: string;
  modalBg: string;
  statusBarStyle: 'light-content' | 'dark-content';
  icon: string;
  divider: string;
  border: string;
  standardBorder: string;
  subtleDivider: string;
  cardTitle: string;
  cardSubtext: string;
  placeholderText: string;
  disabledText: string;
  errorText: string;
  successText: string;
  warningText: string;
  infoText: string;
  promoBg: string;
  promoBorder: string;
  promoTitle: string;
  promoSub: string;
  badgeBg: string;
  badgeText: string;
}

const darkColors: ThemeColors = {
  primary: '#F5B51B',
  secondaryGold: '#FFC94A',
  softGold: '#D99B20',
  goldBorder: '#8B681F',
  primaryText: '#020B1A',
  background: '#020B1A',
  secondary: '#071326',
  secondaryBg: '#071326',
  grayDark: '#0C1930',
  grayLight: '#C7D0DF',
  cardBg: '#0C1930',
  cardBgSecondary: '#101F38',
  cardBorder: '#26364D',
  cardBorderHighlight: '#8B681F',
  cardBackground: '#0C1930',
  elevatedCard: '#101F38',
  text: '#FFFFFF',
  subtext: '#C7D0DF',
  muted: '#8E9BB0',
  textSecondary: '#C7D0DF',
  inputBg: '#111D32',
  inputBorder: '#8B681F',
  headerBg: '#020B1A',
  headerBackground: '#020B1A',
  headerText: '#FFFFFF',
  tabBarBg: '#020B1A',
  tabBarBorder: '#1C2A40',
  drawerBg: '#020B1A',
  modalBg: '#0C1930',
  statusBarStyle: 'light-content',
  icon: '#FFFFFF',
  divider: '#1C2A40',
  border: '#26364D',
  standardBorder: '#26364D',
  subtleDivider: '#1C2A40',
  cardTitle: '#FFFFFF',
  cardSubtext: '#8E9BB0',
  placeholderText: '#8E9BB0',
  disabledText: '#66748A',
  errorText: '#EF4444',
  successText: '#22C55E',
  warningText: '#F59E0B',
  infoText: '#38BDF8',
  promoBg: '#0C1930',
  promoBorder: '#8B681F',
  promoTitle: '#FFFFFF',
  promoSub: '#C7D0DF',
  badgeBg: 'rgba(245, 181, 27, 0.16)',
  badgeText: '#F5B51B',
};

const lightColors: ThemeColors = {
  primary: '#FF6A00',
  secondaryGold: '#FFC94A',
  softGold: '#D99B20',
  goldBorder: '#8B681F',
  primaryText: '#FFFFFF',
  background: '#FFF8E8',
  secondary: '#0F172A',
  secondaryBg: '#F8FAFC',
  grayDark: '#FFF1C7',
  grayLight: '#64748B',
  cardBg: '#FFFFFF',
  cardBgSecondary: '#F8FAFC',
  cardBorder: '#F1EAD8',
  cardBorderHighlight: '#FF6A00',
  cardBackground: '#FFFFFF',
  elevatedCard: '#FFFFFF',
  text: '#0F172A',
  subtext: '#64748B',
  muted: '#94A3B8',
  textSecondary: '#64748B',
  inputBg: '#FFFFFF',
  inputBorder: '#E2E8F0',
  headerBg: '#FFF8E8',
  headerBackground: '#FFF8E8',
  headerText: '#0F172A',
  tabBarBg: '#FFFFFF',
  tabBarBorder: '#F1EAD8',
  drawerBg: '#FFF8E8',
  modalBg: '#FFFFFF',
  statusBarStyle: 'dark-content',
  icon: '#0F172A',
  divider: '#F1EAD8',
  border: '#F1EAD8',
  standardBorder: '#E2E8F0',
  subtleDivider: '#F1EAD8',
  cardTitle: '#0F172A',
  cardSubtext: '#64748B',
  placeholderText: '#94A3B8',
  disabledText: '#94A3B8',
  errorText: '#EF4444',
  successText: '#10B981',
  warningText: '#F59E0B',
  infoText: '#0284C7',
  promoBg: '#FFF1C7',
  promoBorder: '#FDE68A',
  promoTitle: '#0F172A',
  promoSub: '#64748B',
  badgeBg: '#FFF1E8',
  badgeText: '#FF6A00',
};

const getIsDark = (mode: ThemeMode): boolean => {
  if (mode === 'system') {
    return Appearance.getColorScheme() === 'dark';
  }
  return mode === 'dark';
};

const getThemeColors = (mode: ThemeMode): ThemeColors => {
  return getIsDark(mode) ? darkColors : lightColors;
};

interface ThemeState {
  themeMode: ThemeMode;
  colors: ThemeColors;
  isDark: boolean;
  setThemeMode: (mode: ThemeMode) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      themeMode: 'dark', // Default to Premium Navy & Gold Luxury Dark Mode
      colors: darkColors,
      isDark: true,
      setThemeMode: (mode: ThemeMode) => {
        const isDark = getIsDark(mode);
        set({
          themeMode: mode,
          isDark: isDark,
          colors: getThemeColors(mode),
        });
      },
    }),
    {
      name: 'connect_app_theme_preference',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          const mode = state.themeMode || 'dark';
          const isDark = getIsDark(mode);
          state.isDark = isDark;
          state.colors = getThemeColors(mode);
        }
      },
    }
  )
);

// Set up appearance listener for system theme changes
Appearance.addChangeListener(() => {
  const currentMode = useThemeStore.getState().themeMode;
  if (currentMode === 'system') {
    const isDark = Appearance.getColorScheme() === 'dark';
    useThemeStore.setState({
      isDark,
      colors: getThemeColors('system'),
    });
  }
});
