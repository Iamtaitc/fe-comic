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
  storyDetail: {
    story: {
      name: string;
      origin_name: string[];
      content: string;
      status: string;
      thumb_url: string;
      category: { _id: string; name: string; slug: string }[];
      views: number;
      likeCount: number;
      ratingValue: number;
      ratingCount: number;
      chapters?: number | string;
    };
    chapters: number | string;
  };
}

interface StoryInfo {
  label: string;
  value: string;
  icon: React.ReactNode;
}

export default function StoryDetailView({
  slug,
  storyDetail,
}: StoryDetailViewProps) {
  const { story, chapters } = storyDetail;

  const storyInfo: StoryInfo[] = useMemo(
    () => [
      {
        label: "Lượt xem",
        value: story.views?.toLocaleString() || "0",
        icon: <Eye className="w-4 h-4" />,
      },
      {
        label: "Lượt thích",
        value: story.likeCount?.toLocaleString() || "0",
        icon: <Heart className="w-4 h-4" />,
      },
      {
        label: "Đánh giá",
        value:
          story.ratingValue > 0
            ? `${story.ratingValue}/5 (${story.ratingCount})`
            : "Chưa có",
        icon: <Star className="w-4 h-4" />,
      },
      {
        label: "Chương",
        value: Array.isArray(chapters) ? chapters.length.toString() : "0",
        icon: <BookOpen className="w-4 h-4" />,
      },
    ],
    [story, chapters]
  );

  const statusText = useMemo(() => {
    switch (story.status) {
      case "ongoing":
        return "Đang cập nhật";
      case "completed":
        return "Hoàn thành";
      case "paused":
        return "Tạm dừng";
      default:
        return story.status || "Không xác định";
    }
  }, [story.status]);

  const statusVariant = useMemo(() => {
    switch (story.status) {
      case "ongoing":
        return "default";
      case "completed":
        return "secondary";
      case "paused":
        return "destructive";
      default:
        return "outline";
    }
  }, [story.status]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent/10">
      <div className="container py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            {story.name}
          </h1>
          {story.origin_name?.length > 0 && (
            <p className="text-lg text-muted-foreground">
              {story.origin_name.join(", ")}
            </p>
          )}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Image */}
          <div className="lg:col-span-1">
            <Card className="overflow-hidden">
              <LazyImage
                src={story.thumb_url}
                alt={story.name}
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
              <Badge variant={statusVariant}>{statusText}</Badge>
              {story.category?.map((cat) => (
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
                    <div className="font-semibold">{info.value}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Description */}
            {story.content && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    Mô tả
                  </h3>
                  <div
                    className="text-muted-foreground leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: story.content }}
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
                disabled={!Array.isArray(chapters) || !chapters.length}
              >
                <Link
                  href={`/comic/${slug}/chapter/${
                    Array.isArray(chapters) ? chapters[0]?.chapter_name : ""
                  }`}
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Đọc từ đầu
                </Link>
              </Button>

              {Array.isArray(chapters) && chapters.length > 1 && (
                <Button asChild variant="outline" size="lg" className="flex-1">
                  <Link
                    href={`/comic/${slug}/chapter/${
                      Array.isArray(chapters)
                        ? chapters[chapters.length - 1]?.chapter_name
                        : ""
                    }`}
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
        {Array.isArray(chapters) && (
          <ChapterList slug={slug} chapters={chapters} />
        )}
      </div>
    </div>
  );
}
