import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { NotesList } from '@/components/notes-list';
import { Text } from '@/components/ui/text';
import { listNotes } from '@/src/storage/notesRepository';
import type { Note } from '@/src/types/Note';

export default function HomeScreen() {
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>(() => listNotes());

  useFocusEffect(
    useCallback(() => {
      setNotes(listNotes());
    }, [])
  );

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="border-b border-border px-6 py-4">
        <Text className="text-left text-3xl font-bold tracking-tight text-foreground">Keep</Text>
      </View>
      <Pressable
        accessibilityRole="button"
        className="mx-6 mt-4 rounded-lg border border-input bg-card px-4 py-3"
        onPress={() => router.push('/new-note')}>
        <Text className="text-base text-muted-foreground">Crear una nota...</Text>
      </Pressable>
      <NotesList notes={notes} />
    </SafeAreaView>
  );
}
