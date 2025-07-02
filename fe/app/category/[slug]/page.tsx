//fe\app\category\[slug]\page.tsx
"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchStoriesByCategory,
  resetCategoryState,
  setCurrentCategory,
} from "@/store/slices/categorySlice";
import { CategoryHeader } from "@/components/detail/DetailHeader";
import CategoryFilters from "@/components/detail/DetailFilters";
import { CategoryStoryList } from "@/components/detail/DetailStoryList";
import { getCategory } from "@/lib/api/comic/category";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const dispatch = useAppDispatch();
  const { stories, loading, error, pagination, filters } = useAppSelector(
    (state) => state.category
  );
  const [slug, setSlug] = useState<string | null>(null);
  const [categoryInfo, setCategoryInfo] = useState<{
    title: string;
    description: string;
  }>({
    title: "",
    description: "",
  });

  // Xử lý params Promise
  useEffect(() => {
    async function resolveParams() {
      const resolvedParams = await params;
      setSlug(resolvedParams.slug);
    }
    resolveParams();
  }, [params]);

  // Fetch category info và stories khi slug thay đổi
  useEffect(() => {
    if (!slug) return;

    async function fetchCategoryInfo() {
      try {
        const categories = await getCategory();
        console.log("Categories from getCategory:", categories); // Debug log
        const category = categories.find((cat) => cat.slug === slug);
        if (category) {
          setCategoryInfo({
            title: category.name,
            description: `Khám phá các truyện thuộc thể loại ${category.name.toLowerCase()} với những câu chuyện hấp dẫn và đa dạng.`,
          });
        } else {
          setCategoryInfo({
            title: slug ? slug.charAt(0).toUpperCase() + slug.slice(1) : "Thể loại không xác định",
            description: slug
              ? `Khám phá các truyện thuộc thể loại ${slug.toLowerCase()}.`
              : "Không tìm thấy thông tin thể loại.",
          });
        }
      } catch (err) {
        console.error("Error fetching category info:", err);
        setCategoryInfo({
          title: slug ? slug.charAt(0).toUpperCase() + slug.slice(1) : "Thể loại không xác định",
          description: slug
            ? `Khám phá các truyện thuộc thể loại ${slug.toLowerCase()}.`
            : "Không tìm thấy thông tin thể loại.",
        });
      }
    }

    fetchCategoryInfo();
    dispatch(resetCategoryState());
    dispatch(setCurrentCategory(slug));
    dispatch(fetchStoriesByCategory({ slug }));

    return () => {
      dispatch(resetCategoryState());
    };
  }, [slug, dispatch]);

  if (!slug) {
    return null; // Hoặc hiển thị loading skeleton
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent/10">
      <CategoryHeader
        title={categoryInfo.title}
        description={categoryInfo.description}
        totalStories={pagination.totalStories}
        slug={slug}
      />
      <CategoryFilters
        filters={filters}
        onFiltersChange={(newFilters) =>
          dispatch(fetchStoriesByCategory({ slug, filters: newFilters }))
        }
        totalStories={pagination.totalStories}
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
      />
      <CategoryStoryList
        stories={stories}
        loading={loading}
        pagination={pagination}
        categorySlug={slug}
        filters={filters}
      />
    </div>
  );
}