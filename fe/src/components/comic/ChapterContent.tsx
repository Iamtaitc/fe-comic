// components/ChapterContent.tsx
import React, { memo } from "react";
import LazyImage from "../LazyImage";

interface ChapterContentProps {
  content: string[];
}

const ChapterContent = memo(({ content }: ChapterContentProps) => (
  <div className="container mx-auto px-4 py-6">
    <div className="max-w-4xl mx-auto">
      {content.map((imageUrl: string, index: number) => (
        <LazyImage
          key={`${imageUrl}-${index}`}
          src={imageUrl}
          alt={`Trang ${index + 1}`}
          index={index}
          isEager={index < 2}
        />
      ))}
    </div>
  </div>
));

ChapterContent.displayName = "ChapterContent";
export default ChapterContent;
