// src/components/latest/FilterBar.tsx - Enhanced filter bar
"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { FilterOptions } from "./LatestStoriesContainer";

interface FilterBarProps {
  filters: FilterOptions;
  onFilterChange: (filters: Partial<FilterOptions>) => void;
}

const categories = [
  { value: "all", label: "Tất cả thể loại" },
  { value: "action", label: "Hành động" },
  { value: "romance", label: "Lãng mạn" },
  { value: "comedy", label: "Hài hước" },
  { value: "drama", label: "Chính kịch" },
  { value: "fantasy", label: "Huyền huyễn" },
  { value: "adventure", label: "Phiêu lưu" },
  { value: "mystery", label: "Bí ẩn" },
  { value: "horror", label: "Kinh dị" },
  { value: "slice-of-life", label: "Đời thường" }
];

const statusOptions = [
  { value: "all", label: "Tất cả trạng thái" },
  { value: "ongoing", label: "Đang tiến hành" },
  { value: "completed", label: "Hoàn thành" },
  { value: "hiatus", label: "Tạm dừng" },
  { value: "dropped", label: "Đã bỏ" }
];

export function FilterBar({ filters, onFilterChange }: FilterBarProps) {
  const activeFiltersCount = Object.values(filters).filter(value => value !== "all").length;

  const clearAllFilters = () => {
    onFilterChange({
      category: "all",
      status: "all"
    });
  };

  return (
    <div className="flex-1 space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm font-medium text-muted-foreground">Bộ lọc:</span>
        
        {/* Category Filter */}
        <Select
          value={filters.category}
          onValueChange={(value) => onFilterChange({ category: value })}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Chọn thể loại" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Status Filter */}
        <Select
          value={filters.status}
          onValueChange={(value) => onFilterChange({ status: value })}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Chọn trạng thái" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Clear Filters Button */}
        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
            Xóa bộ lọc ({activeFiltersCount})
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.category !== "all" && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {categories.find(c => c.value === filters.category)?.label}
              <button
                onClick={() => onFilterChange({ category: "all" })}
                className="ml-1 hover:bg-muted rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          
          {filters.status !== "all" && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {statusOptions.find(s => s.value === filters.status)?.label}
              <button
                onClick={() => onFilterChange({ status: "all" })}
                className="ml-1 hover:bg-muted rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
