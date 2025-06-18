// components/ErrorState.tsx
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, Home } from "lucide-react";
import Link from "next/link";

interface ErrorStateProps {
  error: string;
  slug: string;
}

const ErrorState = ({ error, slug }: ErrorStateProps) => (
  <div className="min-h-screen flex items-center justify-center bg-black">
    <div className="container max-w-md mx-auto px-4">
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Lỗi tải chapter</AlertTitle>
        <AlertDescription>
          {error}. Vui lòng thử lại sau hoặc quay về trang truyện.
        </AlertDescription>
      </Alert>
      <div className="mt-4 flex gap-2">
        <Button asChild variant="outline">
          <Link href={`/comic/${slug}`}>
            <Home className="w-4 h-4 mr-2" />
            Về trang truyện
          </Link>
        </Button>
        <Button onClick={() => window.location.reload()}>
          Thử lại
        </Button>
      </div>
    </div>
  </div>
);

export default ErrorState;