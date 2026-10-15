import { Link, Stack } from 'expo-router';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Text } from '@/components/ui/text';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <SafeAreaView className="flex-1 bg-background">
        <View className="px-6 py-4">
          <Text className="text-base leading-6 text-foreground">This screen does not exist.</Text>
          <Link href="/">
            <Text className="mt-4 min-h-11 py-3 text-base font-medium leading-6 text-foreground">
              Go to home screen!
            </Text>
          </Link>
        </View>
      </SafeAreaView>
    </>
  );
}
