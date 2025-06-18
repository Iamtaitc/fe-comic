// components/ChapterHeader.tsx
import React, { memo } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

interface ChapterHeaderProps {
  slug: string;
  comicName: string;
  chapterName: string;
  chapterTitle?: string;
  currentImageIndex: number;
  totalImages: number;
}

const ChapterHeader = memo(({ 
  slug, 
  comicName, 
  chapterName, 
  chapterTitle, 
  currentImageIndex, 
  totalImages 
}: ChapterHeaderProps) => (
  <div className="sticky top-0 z-50 bg-black/90 backdrop-blur-sm border-b border-gray-800">
    <div className="container mx-auto px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button asChild variant="outline" size="sm">
            <Link href={`/comic/${slug}`}>
              <ChevronLeft className="w-4 h-4 mr-1" />
              Quay lại
            </Link>
          </Button>
          <div>
            <h1 className="font-bold text-lg">{comicName}</h1>
            <p className="text-sm text-gray-400">
              Chương {chapterName}
              {chapterTitle && ` - ${chapterTitle}`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">
            {currentImageIndex + 1}/{totalImages}
          </span>
        </div>
      </div>
    </div>
  </div>
));

ChapterHeader.displayName = "ChapterHeader";
export default ChapterHeader;