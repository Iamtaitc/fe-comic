// app/category/[slug]/page.tsx
"use client";

import { use, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { 
  fetchStoriesByCategory, 
  resetCategoryState, 
  setCurrentCategory 
} from "@/store/slices/categorySlice";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, BookOpen, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

// Mapping cho các category đặc biệt
const categoryDisplayNames: Record<string, string> = {
  "xuyen-khong": "Xuyên Không",
  "chuyen-sinh": "Chuyển Sinh", 
  "manga": "Manga",
  "16": "16+"
};

const categoryDescriptions: Record<string, string> = {
  "xuyen-khong": "Những câu chuyện về du hành qua không gian và thời gian, khám phá các thế giới khác nhau với những cuộc phiêu lưu đầy kịch tính.",
  "chuyen-sinh": "Hành trình tái sinh trong thế giới mới với sức mạnh và kiến thức từ kiếp trước, chinh phục thử thách và tìm kiếm ý nghĩa cuộc sống.",
  "manga": "Bộ sưu tập truyện tranh Nhật Bản đa dạng với nhiều thể loại từ hành động, lãng mạn đến kinh dị và siêu nhiên.",
  "16": "Nội dung dành cho độc giả trưởng thành với những câu chuyện sâu sắc và phức tạp về tình yêu, cuộc sống."
};

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const dispatch = useAppDispatch();
  
  const { 
    stories, 
    loading, 
    error, 
    pagination
  } = useAppSelector((state) => state.category);

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

  if (loading && stories.length === 0) {
    return <CategoryPageSkeleton />;
  }

  if (error) {
    return <CategoryPageError error={error} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent/10">
      <div className="container py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Thể Loại Truyện</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Khám phá đa dạng thể loại truyện từ hành động, lãng mạn đến fantasy và nhiều thể loại khác
          </p>
          <div className="flex items-center justify-center gap-2 mt-4 text-sm text-muted-foreground">
            <TrendingUp className="h-4 w-4" />
            <span>Sắp xếp theo số lượng truyện từ cao đến thấp</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(categoryMetadata).map(([slug, metadata], index) => (
            <motion.div
              key={slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Link 
                href={`/category/${slug}`}
                className="block p-6 rounded-lg bg-card hover:bg-accent/50 transition-colors border relative group"
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{metadata.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="text-xl font-semibold">{metadata.displayName}</h2>
                      <div className="flex items-center gap-1 text-sm font-medium text-primary">
                        <BookOpen className="h-4 w-4" />
                        <span>{pagination?.totalStories || 0}</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{metadata.description}</p>
                  </div>
                </div>
                <div className="absolute top-0 right-0 w-12 h-12 bg-primary/10 rounded-bl-lg flex items-center justify-center text-primary font-bold">
                  #{index + 1}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CategoryPageSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent/10">
      <div className="container py-12">
        <div className="text-center mb-12">
          <Skeleton className="h-10 w-64 mx-auto mb-4" />
          <Skeleton className="h-6 w-96 mx-auto" />
          <Skeleton className="h-4 w-48 mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(9).fill(0).map((_, i) => (
            <div key={i} className="p-6 rounded-lg bg-card border relative">
              <div className="flex items-start gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
              <Skeleton className="absolute top-0 right-0 w-12 h-12 rounded-bl-lg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CategoryPageError({ error }: { error: string }) {
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