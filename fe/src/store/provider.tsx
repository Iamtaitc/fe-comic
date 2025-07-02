// src/store/provider.tsx
'use client';

import { useRef } from 'react';
import { Provider } from 'react-redux';
import { makeStore, AppStore } from './store';

export function ReduxProvider({
  children,
  preloadedState,
}: {
  children: React.ReactNode;
  preloadedState?: unknown;
}) {
  const storeRef = useRef<AppStore | undefined>(undefined);

  if (!storeRef.current) {
    storeRef.current = makeStore();

    if (preloadedState) {
      console.log("ReduxProvider: Preloading state:", preloadedState);
      storeRef.current.dispatch({
        type: 'HYDRATE',
        payload: preloadedState,
      });
    }
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}
