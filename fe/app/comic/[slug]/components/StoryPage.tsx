// app\comic\[slug]\components\StoryPage.tsx
"use client";

import { useEffect, use } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchStoryDetail, resetStoryState } from "@/store/slices/storySlice";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import StoryDetailView from "./StoryDetailView";

interface StoryPageProps {
  params: Promise<{ slug: string }>;
}

export default function StoryPage({ params }: StoryPageProps) {
  const { slug } = use(params);
  const dispatch = useAppDispatch();
  const { storyDetail, loading, error } = useAppSelector((state) => state.story);

  useEffect(() => {
    if (slug) {
      dispatch(resetStoryState());
      dispatch(fetchStoryDetail(slug));
    }
    
    return () => {
      dispatch(resetStoryState());
    };
  }, [slug, dispatch]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-accent/10">
        <div className="container py-8">
          <Skeleton className="h-10 w-64 mb-4" />
          <Skeleton className="h-96 w-full mb-4" />
          <Skeleton className="h-6 w-full max-w-2xl mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="container max-w-md">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Lỗi tải dữ liệu</AlertTitle>
            <AlertDescription>
              {error}. Vui lòng thử lại sau hoặc quay về trang chủ.
            </AlertDescription>
          </Alert>
          <div className="mt-4 flex gap-2 justify-center">
            <Button 
              variant="outline" 
              onClick={() => {
                dispatch(resetStoryState());
                dispatch(fetchStoryDetail(slug));
              }}
            >
              Thử lại
            </Button>
            <Button asChild>
              <Link href="/">Quay về trang chủ</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // No data state
  if (!storyDetail) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="container max-w-md">
          <Alert>
            <AlertCircle className="h-4 h-4" />
            <AlertTitle>Không tìm thấy truyện</AlertTitle>
            <AlertDescription>
              Truyện bạn đang tìm không tồn tại hoặc đã bị xóa.
            </AlertDescription>
          </Alert>
          <div className="mt-4 text-center">
            <Button asChild>
              <Link href="/">Quay về trang chủ</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Render main content
  return <StoryDetailView slug={slug} storyDetail={storyDetail} />;
}