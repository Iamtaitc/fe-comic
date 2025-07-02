// src/components/detail/DetailFilters.tsx - Simple Version
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Grid, List, SortAsc, SortDesc } from "lucide-react";

interface DetailFiltersProps {
  filters: {
    status: string;
    sortBy: string;
    sortOrder: "asc" | "desc";
  };
  onFiltersChange: (filters: any) => void;
  totalStories: number;
  currentPage: number;
  totalPages: number;
}

export default function DetailFilters({
  filters,
  onFiltersChange,
  totalStories,
  currentPage,
  totalPages
}: DetailFiltersProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // 🔧 Handle filter changes
  const handleStatusChange = (status: string) => {
    onFiltersChange({ ...filters, status });
  };

  const handleSortChange = (sortBy: string) => {
    onFiltersChange({ ...filters, sortBy });
  };

  const handleSortOrderToggle = () => {
    const newOrder = filters.sortOrder === "asc" ? "desc" : "asc";
    onFiltersChange({ ...filters, sortOrder: newOrder });
  };

  // 🎯 Filter options
  const statusOptions = [
    { value: "all", label: "Tất cả" },
    { value: "ongoing", label: "Đang phát hành" },
    { value: "completed", label: "Hoàn thành" },
    { value: "paused", label: "Tạm dừng" },
  ];

  const sortOptions = [
    { value: "latest", label: "Mới nhất" },
    { value: "popular", label: "Phổ biến" },
    { value: "name", label: "Tên A-Z" },
    { value: "rating", label: "Đánh giá" },
    { value: "views", label: "Lượt xem" },
  ];

  return (
    <div className="sticky top-16 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container px-4 py-4">
        {/* Main Filters Row */}
        <div className="flex flex-wrap items-center gap-3 mb-3">
          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">Trạng thái:</span>
            <Select value={filters.status} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sort Filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">Sắp xếp:</span>
            <Select value={filters.sortBy} onValueChange={handleSortChange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sort Order Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleSortOrderToggle}
            className="px-3"
          >
            {filters.sortOrder === "asc" ? 
              <SortAsc className="h-4 w-4" /> : 
              <SortDesc className="h-4 w-4" />
            }
          </Button>

          {/* Spacer */}
          <div className="flex-1" />

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="px-2 h-8"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="px-2 h-8"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <span>
              <strong className="text-foreground">{totalStories.toLocaleString()}</strong> truyện
            </span>
            
            {/* Active Filters */}
            <div className="flex items-center gap-2">
              {filters.status !== "all" && (
                <Badge variant="secondary" className="text-xs">
                  {statusOptions.find(s => s.value === filters.status)?.label}
                </Badge>
              )}
              {filters.sortBy !== "latest" && (
                <Badge variant="secondary" className="text-xs">
                  {sortOptions.find(s => s.value === filters.sortBy)?.label}
                </Badge>
              )}
            </div>
          </div>

          {/* Pagination Info */}
          {totalPages > 1 && (
            <span>
              Trang <strong>{currentPage}</strong> / <strong>{totalPages}</strong>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}