import '@/global.css';

import { PortalHost } from '@rn-primitives/portal';
import { Stack } from 'expo-router';
import { ThemeProvider } from 'expo-router/react-navigation';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import { Appearance, Platform } from 'react-native';

import { NAV_THEME, THEME } from '@/lib/theme';

export { ErrorBoundary } from 'expo-router';

export default function RootLayout() {
  const { colorScheme, setColorScheme } = useColorScheme();

  React.useEffect(() => {
    // NativeWind treats an explicit light/dark scheme as an Appearance override, so later
    // system changes never reach the app. "system" stays in follow-system mode.
    // Web class dark mode drops the dark class for "system", and that platform does not
    // override Appearance, so sync only a real light/dark reading there.
    if (Platform.OS === 'web') {
      const apply = (scheme: string | null | undefined) => {
        if (scheme === 'light' || scheme === 'dark') {
          setColorScheme(scheme);
        }
      };

      apply(Appearance.getColorScheme());
      const subscription = Appearance.addChangeListener(({ colorScheme: next }) => {
        apply(next);
      });

      return () => subscription.remove();
    }

    setColorScheme('system');
    // The setter from this render keeps working, and including it would resubscribe every update.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scheme = colorScheme === 'dark' ? 'dark' : 'light';

  return (
    <ThemeProvider value={NAV_THEME[scheme]}>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen
          name="new-note"
          options={{
            presentation: 'formSheet',
            headerShown: false,
            sheetGrabberVisible: true,
            sheetAllowedDetents: [0.85, 1],
            sheetInitialDetentIndex: 0,
            sheetCornerRadius: 20,
            contentStyle: { backgroundColor: THEME[scheme].background },
          }}
        />
      </Stack>
      <PortalHost />
    </ThemeProvider>
  );
}
