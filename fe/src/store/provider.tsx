// src/store/provider.tsx
'use client';
import { useRef } from 'react';
import { Provider } from 'react-redux';
import { getStore, AppStore } from './store';

export function ReduxProvider({ children, preloadedState }: { children: React.ReactNode, preloadedState?: any }) {
   const storeRef = useRef<AppStore | null>(null);
  
  if (!storeRef.current) {
    // Tạo store instance và preload state nếu có
    storeRef.current = getStore();
    
    if (preloadedState) {
      // Dispatch action để hydrate state từ server
      storeRef.current.dispatch({
        type: 'HYDRATE',
        payload: preloadedState
      });
    }
  }
  return <Provider store={storeRef.current}>{children}</Provider>;
}