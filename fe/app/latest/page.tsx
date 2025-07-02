// src/app/latest/page.tsx
"use client";

import { Suspense } from "react";
import { LatestStoriesContainer } from "../../src/components/latest/LatestStoriesContainer";
import { LatestStoriesLoading } from "../../src/components/latest/LatestStoriesLoading";

export default function LatestPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Truyện Mới Cập Nhật
        </h1>
        <p className="text-muted-foreground">
          Khám phá những bộ truyện được cập nhật gần đây nhất
        </p>
      </div>

      {/* Main Content */}
      <Suspense fallback={<LatestStoriesLoading />}>
        <LatestStoriesContainer />
      </Suspense>
    </div>
  );
}

