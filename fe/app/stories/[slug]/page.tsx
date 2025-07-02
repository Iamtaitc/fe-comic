"use client";

import { use, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchStoriesByCategory, resetCategoryState, setCurrentCategory } from "@/store/slices/categorySlice";
import { CategoryHeader } from "@/components/detail/DetailHeader";
import { CategoryStoryList } from "@/components/detail/DetailStoryList";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

// Mapping cho các category của PopularStories
const categoryDisplayNames: Record<string, string> = {
  all: "Truyện nổi bật",
  ongoing: "Truyện đang phát hành",
  completed: "Truyện đã hoàn thành",
  upcoming: "Truyện sắp ra mắt",
};

const categoryDescriptions: Record<string, string> = {
  all: "Khám phá những bộ truyện nổi bật nhất, được yêu thích bởi hàng triệu độc giả.",
  ongoing: "Theo dõi các bộ truyện đang phát hành với những chương mới nhất được cập nhật liên tục.",
  completed: "Thưởng thức những bộ truyện đã hoàn thành với cốt truyện trọn vẹn và hấp dẫn.",
  upcoming: "Đón chờ những bộ truyện sắp ra mắt với những câu chuyện đầy hứa hẹn.",
};

interface StoriesPageProps {
  params: Promise<{ slug: string }>;
}

export default function StoriesPage({ params }: StoriesPageProps) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const dispatch = useAppDispatch();
  const { stories, loading, error, pagination } = useAppSelector((state) => state.category);

  // Reset state khi slug thay đổi
  useEffect(() => {
    if (slug) {
      dispatch(resetCategoryState());
      dispatch(setCurrentCategory(slug));
      dispatch(fetchStoriesByCategory({ slug }));
    }

    return () => {
      dispatch(resetCategoryState());
    };
  }, [slug, dispatch]);

  // Get display name và description
  const displayName = categoryDisplayNames[slug] || "Truyện";
  const description = categoryDescriptions[slug] || `Khám phá các truyện thuộc danh mục ${displayName}`;

  if (loading && stories.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-accent/10">
        {/* Header Skeleton */}
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 py-16">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center">
              <Skeleton className="h-10 w-64 mx-auto mb-4" />
              <Skeleton className="h-6 w-96 mx-auto mb-8" />
            </div>
          </div>
        </div>

        {/* Stories Grid Skeleton */}
        <div className="container py-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {Array(18).fill(0).map((_, i) => (
              <div key={i} className="manga-card">
                <div className="manga-cover relative aspect-[2/3]">
                  <Skeleton className="absolute inset-0" />
                </div>
                <div className="p-3">
                  <Skeleton className="h-5 w-full mb-2" />
                  <Skeleton className="h-4 w-20 mb-2" />
                  <div className="flex gap-1">
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

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
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent/10">
      {/* Category Header */}
      <CategoryHeader
        title={displayName}
        description={description}
        totalStories={pagination.totalStories}
        slug={slug}
      />

      {/* Stories List */}
      <CategoryStoryList
        stories={stories}
        loading={loading}
        pagination={pagination}
        categorySlug={slug}
        filters={{
          status: slug === "all" ? "" : slug,
          sortBy: "popularity",
          sortOrder: "desc",
        }}
      />
    </div>
  );
}