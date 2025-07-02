//fe\app\ongoing\page.tsx
"use client"

import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { fetchStoriesByCategory, resetCategoryState, setCurrentCategory } from "@/store/slices/categorySlice"
import { CategoryHeader } from "@/components/category/CategoryHeader"
import CategoryFilters from "@/components/category/CategoryFilters"
import { CategoryStoryList } from "@/components/category/CategoryStoryList"
import { Clock } from "lucide-react"

export default function OngoingPage() {
  const dispatch = useAppDispatch()
  const { stories, loading, error, pagination, filters } = useAppSelector((state) => state.category)
  const [categoryInfo] = useState({
    title: "Truyện đang phát hành",
    description: "Những bộ truyện đang được cập nhật thường xuyên với các chương mới liên tục được phát hành.",
  })

  useEffect(() => {
    dispatch(resetCategoryState())
    dispatch(setCurrentCategory("ongoing"))
    dispatch(fetchStoriesByCategory({ slug: "ongoing" }))

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
        slug="ongoing"
        icon={<Clock className="h-8 w-8 text-blue-500" />}
        gradient="bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500"
      />
      <CategoryFilters
        filters={filters}
        onFiltersChange={(newFilters) => dispatch(fetchStoriesByCategory({ slug: "ongoing", filters: newFilters }))}
        totalStories={pagination.totalStories}
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
      />
      <CategoryStoryList
        stories={stories}
        loading={loading}
        pagination={pagination}
        categorySlug="ongoing"
        filters={filters}
      />
    </div>
  )
}
