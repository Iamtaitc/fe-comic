// src/components/latest/LatestStoriesContainer.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FilterBar } from "./FilterBar";
import { SortOptions } from "./SortOptions";
import { LatestStoriesGrid } from "./LatestStoriesGrid";
import { useLatestStories } from "@/hooks/useLatestStories";

export interface FilterOptions {
  category: string;
  status: string;
  sortBy: "updated" | "views" | "rating";
  sortOrder: "desc" | "asc";
}

export function LatestStoriesContainer() {
  const [filters, setFilters] = useState<FilterOptions>({
    category: "all",
    status: "all",
    sortBy: "updated",
    sortOrder: "desc",
  });

  const {
    stories,
    loading,
    error,
    pagination,
    loadMore,
  } = useLatestStories(filters);

  const handleFilterChange = (newFilters: Partial<FilterOptions>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  if (error) {
    return (
      <div className="container py-16">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 opacity-50">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">Có lỗi xảy ra</h3>
          <p className="text-muted-foreground mb-6">
            Không thể tải dữ liệu. Vui lòng thử lại sau.
          </p>
          <button 
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            onClick={() => window.location.reload()}
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters & Sort */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container"
      >
        <div className="flex flex-col lg:flex-row gap-4 p-4 bg-card rounded-lg border shadow-sm">
          <FilterBar
            filters={filters}
            onFilterChange={handleFilterChange}
          />
          <SortOptions
            sortBy={filters.sortBy}
            sortOrder={filters.sortOrder}
            onSortChange={handleFilterChange}
          />
        </div>
      </motion.div>

      {/* Stories Grid */}
      <LatestStoriesGrid
        stories={stories}
        loading={loading}
        pagination={pagination}
        filters={filters}
        onLoadMore={loadMore}
      />
    </div>
  );
}