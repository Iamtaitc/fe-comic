// fe/app/comic/[slug]/StoryDetailView.tsx
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import ChapterList from "./ChapterList";
import LazyImage from "@/components/LazyImage";
import { Eye, Heart, Star, BookOpen, Calendar } from "lucide-react";
import { useMemo } from "react";

interface StoryDetailViewProps {
  slug: string;
  storyDetail: any;
}

interface StoryInfo {
  label: string;
  value: string;
  icon: React.ReactNode;
}

export default function StoryDetailView({ slug, storyDetail }: StoryDetailViewProps) {
  const storyInfo: StoryInfo[] = useMemo(() => [
    {
      label: "Lượt xem",
      value: storyDetail.views?.toLocaleString() || "0",
      icon: <Eye className="w-4 h-4" />
    },
    {
      label: "Lượt thích", 
      value: storyDetail.likeCount?.toLocaleString() || "0",
      icon: <Heart className="w-4 h-4" />
    },
    {
      label: "Đánh giá",
      value: storyDetail.ratingValue > 0 
        ? `${storyDetail.ratingValue}/5 (${storyDetail.ratingCount})` 
        : "Chưa có",
      icon: <Star className="w-4 h-4" />
    },
    {
      label: "Chương",
      value: storyDetail.chapters?.length?.toString() || "0",
      icon: <BookOpen className="w-4 h-4" />
    }
  ], [storyDetail]);

  const statusText = useMemo(() => {
    switch (storyDetail.status) {
      case "ongoing": return "Đang cập nhật";
      case "completed": return "Hoàn thành";
      case "paused": return "Tạm dừng";
      default: return storyDetail.status || "Không xác định";
    }
  }, [storyDetail.status]);

  const statusVariant = useMemo(() => {
    switch (storyDetail.status) {
      case "ongoing": return "default";
      case "completed": return "secondary";
      case "paused": return "destructive";
      default: return "outline";
    }
  }, [storyDetail.status]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent/10">
      <div className="container py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            {storyDetail.name}
          </h1>
          {storyDetail.origin_name?.length > 0 && (
            <p className="text-lg text-muted-foreground">
              {storyDetail.origin_name.join(", ")}
            </p>
          )}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Image */}
          <div className="lg:col-span-1">
            <Card className="overflow-hidden">
              <LazyImage
                src={storyDetail.thumb_url}
                alt={storyDetail.name}
                className="w-full h-[400px] lg:h-[500px]"
                isEager={true}
                aspectRatio="3/4"
              />
            </Card>
          </div>

          {/* Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Categories & Status */}
            <div className="flex flex-wrap gap-2">
              <Badge variant={statusVariant}>
                {statusText}
              </Badge>
              {storyDetail.category?.map((cat: any) => (
                <Badge key={cat._id} variant="outline">
                  {cat.name}
                </Badge>
              ))}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {storyInfo.map((info, index) => (
                <Card key={index}>
                  <CardContent className="p-4 text-center space-y-2">
                    <div className="flex justify-center text-primary">
                      {info.icon}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {info.label}
                    </div>
                    <div className="font-semibold">
                      {info.value}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Description */}
            {storyDetail.content && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    Mô tả
                  </h3>
                  <div 
                    className="text-muted-foreground leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: storyDetail.content }}
                  />
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                asChild 
                size="lg" 
                className="flex-1"
                disabled={!storyDetail.chapters?.length}
              >
                <Link
                  href={`/comic/${slug}/chapter/${storyDetail.chapters?.[0]?.chapter_name}`}
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Đọc từ đầu
                </Link>
              </Button>
              
              {storyDetail.chapters?.length > 1 && (
                <Button 
                  asChild 
                  variant="outline" 
                  size="lg"
                  className="flex-1"
                >
                  <Link
                    href={`/comic/${slug}/chapter/${storyDetail.chapters[storyDetail.chapters.length - 1]?.chapter_name}`}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Đọc mới nhất
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Chapter List */}
        <ChapterList slug={slug} chapters={storyDetail.chapters} />
      </div>
    </div>
  );
}

