import { ScrollView, View } from 'react-native';

import { Text } from '@/components/ui/text';
import { notesNewestFirst } from '@/src/notes/notesNewestFirst';
import type { Note } from '@/src/types/Note';

export function NotesList({ notes }: { notes: Note[] }) {
  const ordered = notesNewestFirst(notes);
  if (ordered.length === 0) {
    return <View className="flex-1" />;
  }

  return (
    <ScrollView className="flex-1" contentContainerClassName="gap-3 px-6 py-4">
      {ordered.map((note) => (
        <View key={note.id} className="rounded-lg border border-border bg-card px-4 py-3">
          <Text testID="note-title" className="text-base font-semibold text-foreground">
            {note.title}
          </Text>
          <Text testID="note-content" className="mt-1 text-sm text-foreground">
            {note.content}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}
