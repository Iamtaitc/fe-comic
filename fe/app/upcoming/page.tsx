//fe\app\upcoming\page.tsx
"use client"

import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { fetchStoriesByCategory, resetCategoryState, setCurrentCategory } from "@/store/slices/categorySlice"
import { CategoryHeader } from "@/components/detail/DetailHeader"
import CategoryFilters from "@/components/detail/DetailFilters"
import { CategoryStoryList } from "@/components/detail/DetailStoryList"
import { Calendar } from "lucide-react"

export default function UpcomingPage() {
  const dispatch = useAppDispatch()
  const { stories, loading, error, pagination, filters } = useAppSelector((state) => state.category)
  const [categoryInfo] = useState({
    title: "Truyện sắp ra mắt",
    description: "Những bộ truyện mới sắp được phát hành, hãy theo dõi để không bỏ lỡ những tác phẩm hấp dẫn sắp tới.",
  })

  useEffect(() => {
    dispatch(resetCategoryState())
    dispatch(setCurrentCategory("upcoming"))
    dispatch(fetchStoriesByCategory({ slug: "upcoming" }))

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
        slug="upcoming"
        icon={<Calendar className="h-8 w-8 text-purple-500" />}
        gradient="bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500"
      />
      <CategoryFilters
        filters={filters}
        onFiltersChange={(newFilters) => dispatch(fetchStoriesByCategory({ slug: "upcoming", filters: newFilters }))}
        totalStories={pagination.totalStories}
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
      />
      <CategoryStoryList
        stories={stories}
        loading={loading}
        pagination={pagination}
        categorySlug="upcoming"
        filters={filters}
      />
    </div>
  )
}
