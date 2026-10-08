import * as React from 'react';
import { Platform, Pressable, View, type PressableProps, type ViewProps } from 'react-native';

type NativeOnlyAnimatedViewProps =
  ({ as?: 'View' } & ViewProps) | ({ as: 'Pressable' } & PressableProps);

function NativeOnlyAnimatedView({ as = 'View', ...props }: NativeOnlyAnimatedViewProps) {
  if (Platform.OS === 'web') {
    return <>{props.children as React.ReactNode}</>;
  }

  if (as === 'Pressable') {
    return <Pressable {...(props as PressableProps)} />;
  }

  return <View {...(props as ViewProps)} />;
}

export { NativeOnlyAnimatedView };
