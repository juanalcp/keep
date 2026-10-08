import { Link, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Text } from '@/components/ui/text';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <SafeAreaView className="flex-1 bg-background">
        <Text>This screen does not exist.</Text>

        <Link href="/">
          <Text>Go to home screen!</Text>
        </Link>
      </SafeAreaView>
    </>
  );
}
