// components/AppWrapper.tsx
"use client";

import { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlobalLoadingPage } from "./common/GlobalLoadingPage";
import { useHomeData } from "@/hooks/useHomeData";

interface AppWrapperProps {
  children: React.ReactNode;
}

export function AppWrapper({ children }: AppWrapperProps) {
  const [showGlobalLoading, setShowGlobalLoading] = useState(true);
  const [appReady, setAppReady] = useState(false);

  const { isInitializing, hasAnyData, debugInfo } = useHomeData({
    enableAutoRefresh: true,
    debugMode: process.env.NODE_ENV === 'development'
  });

  const handleLoadingComplete = () => {
    setShowGlobalLoading(false);
    
    setTimeout(() => {
      setAppReady(true);
    }, 100);
  };

  useEffect(() => {
    if (!isInitializing && (hasAnyData || !showGlobalLoading)) {
      const timer = setTimeout(handleLoadingComplete, 300);
      return () => clearTimeout(timer);
    }
  }, [isInitializing, hasAnyData, showGlobalLoading]);

  useEffect(() => {
    const fallbackTimer = setTimeout(() => {
      if (showGlobalLoading) {
        console.log('⏰ [AppWrapper] Fallback timeout - showing app');
        handleLoadingComplete();
      }
    }, 5000);

    return () => clearTimeout(fallbackTimer);
  }, [showGlobalLoading]);

  useEffect(() => {
    if (debugInfo && process.env.NODE_ENV === 'development') {
      console.log('🔍 [AppWrapper] Debug Info:', debugInfo);
    }
  }, [debugInfo]);

  return (
    <>
      <AnimatePresence mode="wait">
        {/* 🔄 Global Loading Screen */}
        {showGlobalLoading && (
          <GlobalLoadingPage
            key="global-loading"
            onLoadingComplete={handleLoadingComplete}
          />
        )}

        {/* ✅ App Content - Your existing layout structure */}
        {appReady && (
          <motion.div
            key="app-content"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              duration: 0.6, 
              ease: [0.25, 0.1, 0.25, 1] 
            }}
            className="min-h-screen"
          >
            <Suspense 
              fallback={
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-sm text-gray-600">Đang tải...</p>
                  </div>
                </div>
              }
            >
              {children}
            </Suspense>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🔧 Development Debug Panel */}
      {process.env.NODE_ENV === 'development' && debugInfo && (
        <div className="fixed bottom-4 left-4 max-w-xs rounded-lg bg-black/90 p-3 text-xs text-white z-50">
          <h4 className="font-bold text-yellow-400 mb-2">🔍 Debug Info</h4>
          <div className="space-y-1">
            <div>Cache: {debugInfo.cacheStatus.totalEntries} entries</div>
            <div>Initializing: {isInitializing.toString()}</div>
            <div>Has Data: {hasAnyData.toString()}</div>
            <div>Show Loading: {showGlobalLoading.toString()}</div>
            <div>App Ready: {appReady.toString()}</div>
          </div>
          <div className="mt-2 pt-2 border-t border-gray-600">
            <div className="text-gray-300">Sections:</div>
            {Object.entries(debugInfo.sectionsState).map(([key, state]: [string, any]) => (
              <div key={key} className="ml-2">
                {key}: {state.storiesCount} stories
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default AppWrapper;