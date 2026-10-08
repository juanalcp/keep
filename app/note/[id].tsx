import { router, Stack, useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { NoteColorPicker } from '@/components/note-color-picker';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { commitEditedNote } from '@/src/notes/editNote';
import { noteBackgroundClass, type NoteColor } from '@/src/notes/noteColors';
import type { DraftCommitState } from '@/src/notes/newNote';
import { listNotes } from '@/src/storage/notesRepository';
import type { Note } from '@/src/types/Note';

const fieldClassName = 'border-0 bg-transparent px-0 shadow-none dark:bg-transparent';

function MissingNote() {
  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      <View className="flex-1 gap-4 px-4 pt-4">
        <Text className="text-base text-foreground">This note does not exist.</Text>
        <Button accessibilityLabel="Close" onPress={() => router.back()}>
          <Text>Close</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}

function NoteEditor({ note }: { note: Note }) {
  const navigation = useNavigation();
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [color, setColor] = useState<NoteColor>(note.color);
  const titleRef = useRef(note.title);
  const contentRef = useRef(note.content);
  const colorRef = useRef(note.color);
  const originalRef = useRef(note);
  const session = useRef<DraftCommitState>({ committed: false, pending: false });
  const allowRemove = useRef(false);

  useEffect(() => {
    return navigation.addListener('beforeRemove', (event) => {
      if (allowRemove.current) {
        return;
      }

      const result = commitEditedNote(
        originalRef.current,
        {
          title: titleRef.current,
          content: contentRef.current,
          color: colorRef.current,
        },
        session.current
      );
      if (result === 'failed') {
        event.preventDefault();
        return;
      }
      if (result === 'pending') {
        return;
      }

      allowRemove.current = true;
    });
  }, [navigation]);

  function close() {
    if (allowRemove.current) {
      return;
    }
    router.back();
  }

  return (
    <SafeAreaView
      testID="note-editor"
      className={cn(
        'w-full flex-1',
        Platform.OS === 'web' && 'h-dvh max-h-dvh',
        noteBackgroundClass(color)
      )}
      edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="min-h-0 w-full flex-1"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 12 : 0}>
        <View className="shrink-0 flex-row items-center px-2 pt-1">
          <Button accessibilityLabel="Close" variant="ghost" onPress={close}>
            <Text>Close</Text>
          </Button>
        </View>
        <View className="min-h-0 flex-1 gap-2 px-4">
          <Input
            accessibilityLabel="Title"
            placeholder="Title"
            value={title}
            onChangeText={(value) => {
              titleRef.current = value;
              setTitle(value);
            }}
            className={cn('shrink-0', fieldClassName)}
          />
          <Textarea
            accessibilityLabel="Content"
            className={cn('min-h-0 flex-1', fieldClassName)}
            scrollEnabled
            value={content}
            onChangeText={(value) => {
              contentRef.current = value;
              setContent(value);
            }}
          />
        </View>
        <View className="shrink-0 border-t border-border px-2 py-1">
          <NoteColorPicker
            color={color}
            onColorChange={(next) => {
              colorRef.current = next;
              setColor(next);
            }}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default function NoteScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const noteId = Array.isArray(params.id) ? params.id[0] : params.id;
  const [note] = useState(() => listNotes().find((item) => item.id === noteId) ?? null);

  return (
    <>
      <Stack.Screen
        options={{
          presentation: 'modal',
          headerShown: false,
          contentStyle: { backgroundColor: 'transparent' },
        }}
      />
      {note == null ? <MissingNote /> : <NoteEditor note={note} />}
    </>
  );
}
