import { Pressable, useWindowDimensions, View } from 'react-native';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import { NOTE_COLOR_OPTIONS, noteBackgroundClass, type NoteColor } from '@/src/notes/noteColors';

const SWATCH_ROW_WIDTH = 512;

export function NoteColorPicker({
  color,
  onColorChange,
}: {
  color: NoteColor;
  onColorChange: (color: NoteColor) => void;
}) {
  const { width } = useWindowDimensions();
  const paletteWidth = Math.min(SWATCH_ROW_WIDTH, Math.max(220, width - 48));

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Color de la nota"
          className="h-11 w-11 items-center justify-center">
          <View
            testID="note-color-swatch"
            className={cn(
              'h-6 w-6 rounded-full border-2 border-foreground',
              noteBackgroundClass(color)
            )}
          />
        </Pressable>
      </PopoverTrigger>
      <PopoverContent side="top" align="start" className="w-auto p-3">
        <View
          accessibilityRole="radiogroup"
          className="flex-row flex-wrap gap-2"
          style={{ width: paletteWidth }}>
          {NOTE_COLOR_OPTIONS.map((option) => {
            const selected = option.id === color;
            return (
              <Pressable
                key={option.id}
                accessibilityRole="radio"
                accessibilityLabel={option.label}
                accessibilityState={{ selected }}
                onPress={() => onColorChange(option.id)}
                className="h-11 w-11 items-center justify-center">
                <View
                  className={cn(
                    'h-7 w-7 items-center justify-center rounded-full border border-border',
                    noteBackgroundClass(option.id)
                  )}>
                  {selected ? (
                    <Text
                      accessible={false}
                      importantForAccessibility="no-hide-descendants"
                      className="text-sm font-semibold text-foreground">
                      ✓
                    </Text>
                  ) : null}
                </View>
              </Pressable>
            );
          })}
        </View>
      </PopoverContent>
    </Popover>
  );
}
