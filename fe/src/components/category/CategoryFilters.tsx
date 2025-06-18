"use client";

import { memo, useCallback, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Filter, SortAsc, SortDesc, Grid, List, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";

// Định nghĩa các type cụ thể
type Status = "all" | "ongoing" | "completed" | "paused";
type SortBy = "latest" | "popular" | "rating" | "views" | "name";
type SortOrder = "asc" | "desc";

interface CategoryFiltersProps {
  filters: {
    status: Status;
    sortBy: SortBy;
    sortOrder: SortOrder;
    searchQuery?: string; // Thêm searchQuery vào filters
  };
  onFiltersChange: (filters: CategoryFiltersProps["filters"]) => void;
  totalStories: number;
  currentPage: number;
  totalPages: number;
}

// Ánh xạ tên hiển thị
const STATUS_LABELS: Record<Status, string> = {
  all: "Tất cả",
  ongoing: "Đang phát hành",
  completed: "Hoàn thành",
  paused: "Tạm dừng",
};

const SORT_BY_LABELS: Record<SortBy, string> = {
  latest: "Mới nhất",
  popular: "Phổ biến",
  rating: "Đánh giá",
  views: "Lượt xem",
  name: "Tên A-Z",
};

// Giá trị mặc định
const DEFAULT_FILTERS: CategoryFiltersProps["filters"] = {
  status: "all",
  sortBy: "latest",
  sortOrder: "desc",
  searchQuery: "",
};

const CategoryFilters = memo(
  ({ filters, onFiltersChange, totalStories, currentPage, totalPages }: CategoryFiltersProps) => {
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

    // Kiểm tra bộ lọc có active hay không
    const hasActiveFilters = useMemo(() => {
      return (
        filters.status !== DEFAULT_FILTERS.status ||
        filters.sortBy !== DEFAULT_FILTERS.sortBy ||
        (filters.searchQuery && filters.searchQuery.length > 0)
      );
    }, [filters]);

    // Xử lý thay đổi bộ lọc
    const handleFilterChange = useCallback(
      (key: keyof CategoryFiltersProps["filters"], value: string) => {
        onFiltersChange({ ...filters, [key]: value });
      },
      [filters, onFiltersChange]
    );

    // Xử lý tìm kiếm
    const handleSearchSubmit = useCallback(
      (e: React.FormEvent) => {
        e.preventDefault();
        handleFilterChange("searchQuery", filters.searchQuery || "");
      },
      [filters.searchQuery, handleFilterChange]
    );

    // Xóa tất cả bộ lọc
    const clearAllFilters = useCallback(() => {
      onFiltersChange(DEFAULT_FILTERS);
    }, [onFiltersChange]);

    // Animation tối ưu
    const animationProps = {
      initial: { opacity: 0, height: 0 },
      animate: { opacity: 1, height: "auto", transition: { duration: 0.2, ease: "easeOut" } },
      exit: { opacity: 0, height: 0, transition: { duration: 0.2, ease: "easeIn" } },
    };

    return (
      <div className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-40 shadow-sm">
        <div className="container py-4">
          {/* Main Filter Bar */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            {/* Left Side - Results Info */}
            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{totalStories}</span> Truyện
                {totalPages > 1 && (
                  <span className="ml-2">
                    (Trang {currentPage}/{totalPages})
                  </span>
                )}
              </div>
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4 mr-1" />
                  Xóa bộ lọc
                </Button>
              )}
            </div>

            {/* Right Side - Controls */}
            <div className="flex items-center gap-3 w-full lg:w-auto">
              {/* Search */}
              <form onSubmit={handleSearchSubmit} className="relative flex-1 lg:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm truyện..."
                  value={filters.searchQuery || ""}
                  onChange={(e) => handleFilterChange("searchQuery", e.target.value)}
                  className="pl-10 h-9"
                />
              </form>

              {/* Status Filter */}
              <Select
                value={filters.status}
                onValueChange={(value) => handleFilterChange("status", value)}
              >
                <SelectTrigger className="w-36 h-9">
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(STATUS_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Sort Filter */}
              <Select
                value={filters.sortBy}
                onValueChange={(value) => handleFilterChange("sortBy", value)}
              >
                <SelectTrigger className="w-32 h-9">
                  <SelectValue placeholder="Sắp xếp" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(SORT_BY_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Sort Order */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleFilterChange("sortOrder", filters.sortOrder === "asc" ? "desc" : "asc")}
                className="w-9 h-9 p-0"
              >
                {filters.sortOrder === "asc" ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
              </Button>

              {/* View Mode Toggle */}
              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="w-9 h-9 p-0 rounded-r-none"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="w-9 h-9 p-0 rounded-l-none"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>

              {/* Advanced Filters Toggle */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="gap-2"
              >
                <Filter className="w-4 h-4" />
                Lọc nâng cao
              </Button>
            </div>
          </div>

          {/* Active Filters Display */}
          <AnimatePresence>
            {hasActiveFilters && (
              <motion.div {...animationProps} className="flex items-center gap-2 mt-3 pt-3 border-t">
                <span className="text-sm text-muted-foreground mr-2">Bộ lọc:</span>
                {filters.status !== "all" && (
                  <Badge variant="secondary" className="gap-1">
                    Trạng thái: {STATUS_LABELS[filters.status]}
                    <X
                      className="w-3 h-3 cursor-pointer hover:text-destructive"
                      onClick={() => handleFilterChange("status", "all")}
                    />
                  </Badge>
                )}
                {filters.sortBy !== "latest" && (
                  <Badge variant="secondary" className="gap-1">
                    Sắp xếp: {SORT_BY_LABELS[filters.sortBy]}
                    <X
                      className="w-3 h-3 cursor-pointer hover:text-destructive"
                      onClick={() => handleFilterChange("sortBy", "latest")}
                    />
                  </Badge>
                )}
                {filters.searchQuery && (
                  <Badge variant="secondary" className="gap-1">
                    Tìm: &quot;{filters.searchQuery}&quot;
                    <X
                      className="w-3 h-3 cursor-pointer hover:text-destructive"
                      onClick={() => handleFilterChange("searchQuery", "")}
                    />
                  </Badge>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Advanced Filters Panel */}
          <AnimatePresence>
            {showAdvancedFilters && (
              <motion.div {...animationProps} className="mt-4 p-4 border rounded-lg bg-accent/10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Số chapter</label>
                    <Select onValueChange={(value) => handleFilterChange("chapterCount", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả</SelectItem>
                        <SelectItem value="1-10">1-10 chapter</SelectItem>
                        <SelectItem value="11-50">11-50 chapter</SelectItem>
                        <SelectItem value="51-100">51-100 chapter</SelectItem>
                        <SelectItem value="100+">100+ chapter</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Đánh giá</label>
                    <Select onValueChange={(value) => handleFilterChange("rating", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả</SelectItem>
                        <SelectItem value="5">5 sao</SelectItem>
                        <SelectItem value="4+">4 sao trở lên</SelectItem>
                        <SelectItem value="3+">3 sao trở lên</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Thời gian cập nhật</label>
                    <Select onValueChange={(value) => handleFilterChange("updatedAt", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả</SelectItem>
                        <SelectItem value="today">Hôm nay</SelectItem>
                        <SelectItem value="week">Tuần này</SelectItem>
                        <SelectItem value="month">Tháng này</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Lượt xem</label>
                    <Select onValueChange={(value) => handleFilterChange("views", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả</SelectItem>
                        <SelectItem value="1000+">1K+ lượt xem</SelectItem>
                        <SelectItem value="10000+">10K+ lượt xem</SelectItem>
                        <SelectItem value="100000+">100K+ lượt xem</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }
);

// Đặt displayName để dễ debug
CategoryFilters.displayName = "CategoryFilters";

export default CategoryFilters;