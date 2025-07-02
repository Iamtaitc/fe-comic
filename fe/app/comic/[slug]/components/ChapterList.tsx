// fe/app/comic/[slug]/ChapterList.tsx
"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Heart, Calendar, BookOpen } from "lucide-react";
import { useMemo } from "react";

interface ChapterListProps {
  slug: string;
  chapters: any[];
}

export default function ChapterList({ slug, chapters }: ChapterListProps) {
  const sortedChapters = useMemo(() => {
    if (!chapters?.length) return [];
    return [...chapters].sort((a, b) => 
      parseFloat(b.chapter_name) - parseFloat(a.chapter_name)
    );
  }, [chapters]);

  if (!chapters || chapters.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground text-lg">
            Chưa có chương nào được cập nhật.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <BookOpen className="w-6 h-6" />
          Danh sách chương
        </h2>
        <Badge variant="secondary">
          {chapters.length} chương
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedChapters.map((chapter, index) => (
          <Link
            key={chapter._id || index}
            href={`/comic/${slug}/chapter/${chapter.chapter_name}`}
            className="block group"
          >
            <Card className="h-full transition-all duration-200 hover:shadow-md hover:scale-[1.02] group-hover:border-primary/50">
              <CardContent className="p-4 space-y-3">
                <div className="space-y-1">
                  <h3 className="font-semibold group-hover:text-primary transition-colors">
                    Chương {chapter.chapter_name}
                  </h3>
                  {chapter.chapter_title && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {chapter.chapter_title}
                    </p>
                  )}
                </div>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(chapter.createdAt).toLocaleDateString("vi-VN")}
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {chapter.views?.toLocaleString() || 0}
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      {chapter.likeCount?.toLocaleString() || 0}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}