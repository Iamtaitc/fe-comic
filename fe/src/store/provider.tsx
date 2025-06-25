// src/store/provider.tsx
'use client';
import { useRef } from 'react';
import { Provider } from 'react-redux';
import { makeStore, AppStore } from './store';

export function ReduxProvider({ 
  children, 
  preloadedState 
}: { 
  children: React.ReactNode;
  preloadedState?: unknown;
}) {
  const storeRef = useRef<AppStore | undefined>(undefined);
  
  // 🔑 Chỉ tạo store một lần duy nhất
  if (!storeRef.current) {
    storeRef.current = makeStore();
    
    // 🔑 Preload state ngay khi tạo store
    if (preloadedState) {
      storeRef.current.dispatch({
        type: 'HYDRATE',
        payload: preloadedState
      });
    }
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}