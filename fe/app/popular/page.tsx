//fe\app\popular\page.tsx
"use client"

import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { fetchStoriesByCategory, resetCategoryState, setCurrentCategory } from "@/store/slices/categorySlice"
import { CategoryHeader } from "@/components/category/CategoryHeader"
import CategoryFilters from "@/components/category/CategoryFilters"
import { CategoryStoryList } from "@/components/category/CategoryStoryList"
import { Flame } from "lucide-react"

export default function PopularPage() {
  const dispatch = useAppDispatch()
  const { stories, loading, error, pagination, filters } = useAppSelector((state) => state.category)
  const [categoryInfo] = useState({
    title: "Truyện nổi bật",
    description: "Khám phá những bộ truyện được yêu thích nhất với lượt xem cao và đánh giá tốt từ cộng đồng độc giả.",
  })

  useEffect(() => {
    dispatch(resetCategoryState())
    dispatch(setCurrentCategory("popular"))
    dispatch(fetchStoriesByCategory({ slug: "all" }))

    return () => {
      dispatch(resetCategoryState())
    }
  }, [dispatch])

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent/10">
      <CategoryHeader
        title={categoryInfo.title}
        description={categoryInfo.description}
        totalStories={pagination.totalStories}
        slug="popular"
        icon={<Flame className="h-8 w-8 text-red-500" />}
        gradient="bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500"
      />
      <CategoryFilters
        filters={filters}
        onFiltersChange={(newFilters) => dispatch(fetchStoriesByCategory({ slug: "all", filters: newFilters }))}
        totalStories={pagination.totalStories}
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
      />
      <CategoryStoryList
        stories={stories}
        loading={loading}
        pagination={pagination}
        categorySlug="popular"
        filters={filters}
      />
    </div>
  )
}
