import { FlashList, type ListRenderItem } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import { useCallback, useMemo } from 'react';
import { Pressable, View } from 'react-native';

import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import { noteBackgroundClass } from '@/src/notes/noteColors';
import { notesNewestFirst } from '@/src/notes/notesNewestFirst';
import type { Note } from '@/src/types/Note';

const EMPTY_NOTES_COPY = 'Las notas que añadas aparecerán aquí';

function visibleText(value: string): string | null {
  return value.trim() === '' ? null : value;
}

function NoteCard({ note }: { note: Note }) {
  const router = useRouter();
  const title = visibleText(note.title);
  const content = visibleText(note.content);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title != null ? `Open note, ${title}` : 'Open note'}
      className="px-1 pb-2"
      onPress={() => router.push({ pathname: '/note/[id]', params: { id: note.id } })}>
      <Card
        testID="note-card"
        className={cn('w-full gap-1.5 px-3 py-3', noteBackgroundClass(note.color))}>
        {title != null ? (
          <Text
            testID="note-title"
            numberOfLines={2}
            className="text-base font-semibold leading-5 text-card-foreground">
            {title}
          </Text>
        ) : null}
        {content != null ? (
          <Text
            testID="note-content"
            numberOfLines={8}
            className="text-sm leading-5 text-card-foreground">
            {content}
          </Text>
        ) : null}
      </Card>
    </Pressable>
  );
}

function EmptyNotes() {
  return <Text className="px-1 py-1 text-base text-muted-foreground">{EMPTY_NOTES_COPY}</Text>;
}

export function NotesList({ notes }: { notes: Note[] }) {
  const ordered = useMemo(
    () =>
      notesNewestFirst(notes).filter(
        (note) => visibleText(note.title) != null || visibleText(note.content) != null
      ),
    [notes]
  );

  const renderNote = useCallback<ListRenderItem<Note>>(({ item }) => {
    return <NoteCard note={item} />;
  }, []);

  return (
    <View className="mx-5 min-h-0 flex-1 pt-4">
      <FlashList
        data={ordered}
        masonry
        optimizeItemArrangement
        numColumns={2}
        keyExtractor={(note) => note.id}
        renderItem={renderNote}
        ListEmptyComponent={EmptyNotes}
        style={{ flex: 1 }}
      />
    </View>
  );
}
