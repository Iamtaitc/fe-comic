// components/ChapterInfo.tsx
import React, { memo } from "react";

interface ChapterInfoProps {
  comicName: string;
  chapterName: string;
  chapterTitle?: string;
  views: number;
  likeCount: number;
  createdAt: string;
}

const ChapterInfo = memo(({ 
  comicName, 
  chapterName, 
  chapterTitle, 
  views, 
  likeCount, 
  createdAt 
}: ChapterInfoProps) => (
  <div className="container mx-auto px-4 py-8 border-t border-gray-800">
    <div className="max-w-4xl mx-auto text-center">
      <h2 className="text-xl font-bold mb-2">
        {comicName} - Chương {chapterName}
      </h2>
      {chapterTitle && (
        <p className="text-gray-400 mb-4">{chapterTitle}</p>
      )}
      <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
        <span>👁 {views} lượt xem</span>
        <span>❤️ {likeCount} lượt thích</span>
        <span>📅 {new Date(createdAt).toLocaleDateString("vi-VN")}</span>
      </div>
    </div>
  </div>
));

ChapterInfo.displayName = "ChapterInfo";
export default ChapterInfo;