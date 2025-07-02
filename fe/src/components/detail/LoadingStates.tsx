// src/components/detail/LoadingStates.tsx
"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, RefreshCw } from "lucide-react";

export function StoriesGridSkeleton({ count = 18 }: { count?: number }) {
  return (
    <div className="container py-8">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {Array(count).fill(0).map((_, i) => (
          <div key={i} className="manga-card">
            <div className="manga-cover relative aspect-[2/3]">
              <Skeleton className="absolute inset-0" />
            </div>
            <div className="p-3">
              <Skeleton className="h-5 w-full mb-2" />
              <Skeleton className="h-4 w-20 mb-2" />
              <div className="flex gap-1">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-12" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ErrorState({ 
  error, 
  onRetry 
}: { 
  error: string; 
  onRetry?: () => void; 
}) {
  return (
    <div className="container py-16">
      <div className="max-w-md mx-auto text-center">
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-left">
            <strong>Lỗi tải dữ liệu:</strong>
            <br />
            {error}
          </AlertDescription>
        </Alert>
        
        {onRetry && (
          <Button onClick={onRetry} variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Thử lại
          </Button>
        )}
      </div>
    </div>
  );
}

export function EmptyState({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="container py-16">
      <div className="text-center">
        <div className="w-24 h-24 mx-auto mb-6 opacity-50">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
          </svg>
        </div>
        <h3 className="text-xl font-semibold mb-2">Không tìm thấy truyện</h3>
        <p className="text-muted-foreground mb-6">
          Hiện tại chưa có truyện nào trong danh mục này hoặc không khớp với bộ lọc của bạn.
        </p>
        {onRetry && (
          <Button variant="outline" onClick={onRetry} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Tải lại
          </Button>
        )}
      </div>
    </div>
  );
}