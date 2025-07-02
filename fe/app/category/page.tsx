"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import { getCategory } from "@/lib/api/comic/category"; 
import { CategoryObject } from "@/lib/api/comic/types";
import { getGradientBySlug } from "@/components/detail/GradientUtils";

export default function CategoryPage() {
  const [categories, setCategories] = useState<CategoryObject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await getCategory();
        console.log("Raw API Response:", response);

        let data: CategoryObject[] = [];
        if (Array.isArray(response)) {
          console.log("API Response is Array:", response);
          data = response;
        } else if (response && response.data && Array.isArray(response.data)) {
          console.log("API Data:", response.data);
          data = response.data;
        } else {
          throw new Error("Dữ liệu API không đúng định dạng: không phải mảng hoặc response.data không phải mảng");
        }

        setCategories(data);
        setLoading(false);
      } catch (err: any) {
        let errorMessage = "Không thể tải danh sách thể loại. Vui lòng thử lại sau.";
        if (err.response) {
          errorMessage = `Lỗi server: ${err.response.status} - ${err.response.data?.message || "Không rõ"}`;
        } else if (err.request) {
          errorMessage = "Không nhận được phản hồi từ server. Kiểm tra kết nối mạng hoặc CORS.";
        } else {
          errorMessage = `Lỗi: ${err.message}`;
        }
        console.error("Fetch Categories Error:", err);
        setError(errorMessage);
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  if (loading) {
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Link
                href={`/category/${category.slug}`}
                className="block p-6 rounded-lg bg-card hover:bg-accent/50 transition-colors border relative group"
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${getGradientBySlug(category.slug)} opacity-80 rounded-lg z-0 transition-opacity group-hover:opacity-100`}></div>
                <div className="flex items-start gap-4 relative z-10">
                  <div className="text-4xl">📖</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="text-xl font-semibold text-white">{category.name}</h2>
                      <div className="flex items-center gap-1 text-sm font-medium text-white">
                        <BookOpen className="h-4 w-4" />
                        <span className="mr-8">{category.storyCount || 0}</span>
                      </div>
                    </div>
                    <p className="text-sm text-white/80">
                      Khám phá các câu chuyện thuộc thể loại {category.name.toLowerCase()}.
                    </p>
                  </div>
                </div>
                <div className="absolute top-0 right-0 w-12 h-12 bg-white/10 rounded-bl-lg flex items-center justify-center text-white font-bold">
                  #{index + 1}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
        {categories.length === 0 && (
          <p className="text-center text-muted-foreground mt-8">
            Không có thể loại nào để hiển thị.
          </p>
        )}
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
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    </div>
  );
}