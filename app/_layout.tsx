import '@/global.css';

import { PortalHost } from '@rn-primitives/portal';
import { Stack } from 'expo-router';
import { ThemeProvider } from 'expo-router/react-navigation';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import { Appearance } from 'react-native';

import { NAV_THEME } from '@/lib/theme';

export { ErrorBoundary } from 'expo-router';

function toColorScheme(scheme: string | null | undefined): 'light' | 'dark' {
  return scheme === 'dark' ? 'dark' : 'light';
}

export default function RootLayout() {
  const { colorScheme, setColorScheme } = useColorScheme();

  React.useEffect(() => {
    const apply = (scheme: string | null | undefined) => {
      setColorScheme(toColorScheme(scheme));
    };

    apply(Appearance.getColorScheme());
    const subscription = Appearance.addChangeListener(({ colorScheme: next }) => {
      apply(next);
    });

    return () => subscription.remove();
    // The setter from this render keeps working, and including it would resubscribe every update.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ThemeProvider value={NAV_THEME[colorScheme ?? 'light']}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false }} />
      <PortalHost />
    </ThemeProvider>
  );
}
