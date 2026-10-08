import { FlashList } from '@shopify/flash-list';

import type { Note } from '@/src/types/Note';

type FiberNode = {
  type?: unknown;
  memoizedProps?: {
    data?: Note[];
    masonry?: boolean;
    numColumns?: number;
    optimizeItemArrangement?: boolean;
  };
  child?: FiberNode | null;
  sibling?: FiberNode | null;
};

export function flashListProps(root: { unstable_fiber: unknown } | null) {
  let found: FiberNode['memoizedProps'] | undefined;

  function walk(node: FiberNode | null | undefined) {
    if (node == null || found) {
      return;
    }
    if (node.type === FlashList) {
      found = node.memoizedProps;
      return;
    }
    walk(node.child);
    walk(node.sibling);
  }

  walk(root?.unstable_fiber as FiberNode | null);
  if (found == null) {
    throw new Error('FlashList was not rendered');
  }
  return found;
}
