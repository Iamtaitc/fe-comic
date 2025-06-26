//fe\app\completed\page.tsx
"use client"

import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { fetchStoriesByCategory, resetCategoryState, setCurrentCategory } from "@/store/slices/categorySlice"
import { CategoryHeader } from "@/components/category/CategoryHeader"
import CategoryFilters from "@/components/category/CategoryFilters"
import { CategoryStoryList } from "@/components/category/CategoryStoryList"
import { CheckCircle } from "lucide-react"

export default function CompletedPage() {
  const dispatch = useAppDispatch()
  const { stories, loading, error, pagination, filters } = useAppSelector((state) => state.category)
  const [categoryInfo] = useState({
    title: "Truyện đã hoàn thành",
    description: "Những bộ truyện đã kết thúc hoàn chỉnh, sẵn sàng để bạn thưởng thức trọn vẹn từ đầu đến cuối.",
  })

  useEffect(() => {
    dispatch(resetCategoryState())
    dispatch(setCurrentCategory("completed"))
    dispatch(fetchStoriesByCategory({ slug: "completed" }))

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
        slug="completed"
        icon={<CheckCircle className="h-8 w-8 text-green-500" />}
        gradient="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500"
      />
      <CategoryFilters
        filters={filters}
        onFiltersChange={(newFilters) => dispatch(fetchStoriesByCategory({ slug: "completed", filters: newFilters }))}
        totalStories={pagination.totalStories}
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
      />
      <CategoryStoryList
        stories={stories}
        loading={loading}
        pagination={pagination}
        categorySlug="completed"
        filters={filters}
      />
    </div>
  )
}
