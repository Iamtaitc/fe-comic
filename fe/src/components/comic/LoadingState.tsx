// components/LoadingState.tsx
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const LoadingState = () => (
  <div className="min-h-screen bg-black">
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Skeleton className="h-8 w-64 mb-2 bg-gray-800" />
        <Skeleton className="h-6 w-48 bg-gray-800" />
      </div>
      <div className="space-y-4">
        {Array(3).fill(0).map((_, i) => (
          <Skeleton key={i} className="h-96 w-full bg-gray-800" />
        ))}
      </div>
    </div>
  </div>
);

export default LoadingState;