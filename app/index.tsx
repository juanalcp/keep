import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Text } from '@/components/ui/text';

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="border-b border-border px-6 py-4">
        <Text className="text-left text-3xl font-bold tracking-tight text-foreground">Keep</Text>
      </View>
      <View className="flex-1" />
    </SafeAreaView>
  );
}
