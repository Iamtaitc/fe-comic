// app/category/[slug]/error.tsx
"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, RefreshCw, Home } from "lucide-react";

export default function CategoryError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Category page error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="container max-w-md">
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Có lỗi xảy ra</AlertTitle>
          <AlertDescription>
            Không thể tải trang thể loại. Vui lòng thử lại sau ít phút.
            {error.digest && (
              <div className="mt-2 text-xs text-muted-foreground">
                Mã lỗi: {error.digest}
              </div>
            )}
          </AlertDescription>
        </Alert>
        
        <div className="flex gap-3 justify-center">
          <Button onClick={reset} variant="outline" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Thử lại
          </Button>
          <Button onClick={() => window.location.href = "/"} className="gap-2">
            <Home className="w-4 h-4" />
            Về trang chủ
          </Button>
        </div>
      </div>
    </div>
  );
}