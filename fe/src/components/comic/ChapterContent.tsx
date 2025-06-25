// components/ChapterContent.tsx
"use client";

import React, { memo } from "react";
import LazyImage from "../LazyImage";

interface ChapterContentProps {
  content: string[];
}

const ChapterContent = memo<ChapterContentProps>(({ content }) => (
  <div className="container mx-auto px-4 py-6">
    <div className="mx-auto max-w-4xl space-y-4">
      {content.map((imageUrl, index) => (
        <LazyImage
          key={`${imageUrl}-${index}`}
          src={imageUrl}
          alt={`Trang ${index + 1}`}
          isEager={index < 2}
        />
      ))}
    </div>
  </div>
));

ChapterContent.displayName = "ChapterContent";
export default ChapterContent;
