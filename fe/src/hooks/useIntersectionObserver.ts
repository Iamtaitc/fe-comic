// hooks/useIntersectionObserver.ts - 🔑 Intersection Observer Hook
import { useEffect, useState, RefObject } from 'react';

interface UseIntersectionObserverOptions {
  threshold?: number | number[];
  root?: Element | null;
  rootMargin?: string;
  freezeOnceVisible?: boolean;
}

export function useIntersectionObserver(
  elementRef: RefObject<Element>,
  options: UseIntersectionObserverOptions = {}
): {
  isIntersecting: boolean;
  entry: IntersectionObserverEntry | undefined;
} {
  const {
    threshold = 0,
    root = null,
    rootMargin = '0%',
    freezeOnceVisible = false,
  } = options;

  const [entry, setEntry] = useState<IntersectionObserverEntry>();
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    const frozen = freezeOnceVisible && isIntersecting;

    if (!element || frozen) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isElementIntersecting = entry.isIntersecting;
        setEntry(entry);
        setIsIntersecting(isElementIntersecting);

        if (freezeOnceVisible && isElementIntersecting) {
          observer.unobserve(element);
        }
      },
      {
        threshold,
        root,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [elementRef, threshold, root, rootMargin, freezeOnceVisible, isIntersecting]);

  return { isIntersecting, entry };
}