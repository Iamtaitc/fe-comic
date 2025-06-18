// components/ChapterNavigation.tsx
import React, { memo } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, List } from "lucide-react";
import Link from "next/link";

interface NavigationData {
  prev?: { chapter_name: string };
  next?: { chapter_name: string };
}

interface ChapterNavigationProps {
  slug: string;
  navigation?: NavigationData;
  onPrevChapter: () => void;
  onNextChapter: () => void;
}

const ChapterNavigation = memo(({ 
  slug, 
  navigation, 
  onPrevChapter, 
  onNextChapter 
}: ChapterNavigationProps) => (
  <div className="sticky bottom-0 z-50 bg-black/90 backdrop-blur-sm border-t border-gray-800">
    <div className="container mx-auto px-4 py-4">
      <div className="flex items-center justify-between">
        <Button
          onClick={onPrevChapter}
          disabled={!navigation?.prev}
          variant="outline"
          className="flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          {navigation?.prev ? `Chương ${navigation.prev.chapter_name}` : "Chương trước"}
        </Button>

        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href={`/comic/${slug}`}>
              <List className="w-4 h-4 mr-1" />
              Danh sách
            </Link>
          </Button>
        </div>

        <Button
          onClick={onNextChapter}
          disabled={!navigation?.next}
          variant="outline"
          className="flex items-center gap-2"
        >
          {navigation?.next ? `Chương ${navigation.next.chapter_name}` : "Chương sau"}
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  </div>
));

ChapterNavigation.displayName = "ChapterNavigation";
export default ChapterNavigation;