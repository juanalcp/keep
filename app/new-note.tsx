import { router, useNavigation } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { Textarea } from '@/components/ui/textarea';
import { commitNewNote, type DraftCommitState } from '@/src/notes/newNote';

export default function NewNoteScreen() {
  const navigation = useNavigation();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const titleRef = useRef(title);
  const contentRef = useRef(content);
  const session = useRef<DraftCommitState>({ committed: false, pending: false });
  const allowRemove = useRef(false);

  useEffect(() => {
    return navigation.addListener('beforeRemove', (event) => {
      if (allowRemove.current) {
        return;
      }

      const result = commitNewNote(
        { title: titleRef.current, content: contentRef.current },
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

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 12 : 0}>
        <View className="flex-1 gap-3 px-4 pt-4">
          <Input
            autoFocus
            accessibilityLabel="Title"
            placeholder="Title"
            value={title}
            onChangeText={(value) => {
              titleRef.current = value;
              setTitle(value);
            }}
          />
          <Textarea
            accessibilityLabel="Content"
            className="min-h-40 flex-1"
            scrollEnabled
            value={content}
            onChangeText={(value) => {
              contentRef.current = value;
              setContent(value);
            }}
          />
        </View>
        <View className="px-4 pb-4 pt-3">
          <Button
            className="w-full"
            onPress={() => {
              if (allowRemove.current) {
                return;
              }
              router.back();
            }}>
            <Text>Close</Text>
          </Button>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
