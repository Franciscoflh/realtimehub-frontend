import { useEffect, type RefObject } from 'react';

export function useAutoScroll<T extends HTMLElement>(ref: RefObject<T>, dependency: unknown) {
  useEffect(() => {
    const node = ref.current;
    if (!node) {
      return;
    }

    node.scrollTop = node.scrollHeight;
  }, [dependency, ref]);
}
