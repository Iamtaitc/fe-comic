// src/components/latest/SortOptions.tsx
"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { FilterOptions } from "./LatestStoriesContainer";

interface SortOptionsProps {
  sortBy: FilterOptions["sortBy"];
  sortOrder: FilterOptions["sortOrder"];
  onSortChange: (sort: Partial<FilterOptions>) => void;
}

const sortOptions = [
  { value: "updated", label: "Cập nhật mới nhất" },
  { value: "views", label: "Lượt xem" },
  { value: "rating", label: "Đánh giá" },
];

export function SortOptions({ sortBy, sortOrder, onSortChange }: SortOptionsProps) {
  const toggleSortOrder = () => {
    onSortChange({ sortOrder: sortOrder === "desc" ? "asc" : "desc" });
  };

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-muted-foreground">Sắp xếp:</span>
      
      <Select
        value={sortBy}
        onValueChange={(value: FilterOptions["sortBy"]) => onSortChange({ sortBy: value })}
      >
        <SelectTrigger className="w-[160px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        variant="outline"
        size="sm"
        onClick={toggleSortOrder}
        className="flex items-center gap-1"
      >
        {sortOrder === "desc" ? (
          <ArrowDown className="h-4 w-4" />
        ) : (
          <ArrowUp className="h-4 w-4" />
        )}
        {sortOrder === "desc" ? "Giảm dần" : "Tăng dần"}
      </Button>
    </div>
  );
}