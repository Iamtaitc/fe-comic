// src/components/story/ChaptersList.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, List, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Chapter {
  _id: string;
  number: number;
  title: string;
  createdAt: string;
  views: number;
}

interface ChaptersListProps {
  storySlug: string;
  chapters: Chapter[];
}

export function ChaptersList({ storySlug, chapters }: ChaptersListProps) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("desc");

  // Lọc chapters theo search
  const filteredChapters = chapters.filter((chapter) =>
    chapter.title.toLowerCase().includes(search.toLowerCase()) ||
    `Chapter ${chapter.number}`.toLowerCase().includes(search.toLowerCase())
  );

  // Sắp xếp chapters
  const sortedChapters = [...filteredChapters].sort((a, b) => {
    if (sort === "asc") {
      return a.number - b.number;
    } else {
      return b.number - a.number;
    }
  });

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="py-8">
      <div className="container">
        <h2 className="manga-section-title">
          <List className="h-6 w-6 text-manga-orange" />
          Danh sách chương
        </h2>

        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Tìm chương..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Sắp xếp:</span>
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Chọn thứ tự" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">Mới nhất</SelectItem>
                <SelectItem value="asc">Cũ nhất</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {sortedChapters.length > 0 ? (
          <motion.div
            className="grid gap-2 md:grid-cols-2 lg:grid-cols-3"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {sortedChapters.map((chapter) => (
              <motion.div key={chapter._id} variants={item}>
                <Link
                  href={`/read/${storySlug}/${chapter.number}`}
                  className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-accent"
                >
                  <div className="flex-1">
                    <h3 className="font-medium">
                      Chapter {chapter.number}{" "}
                      {chapter.title && <span>- {chapter.title}</span>}
                    </h3>
                    <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDate(chapter.createdAt)}
                      </span>
                      <span>{chapter.views.toLocaleString()} lượt đọc</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="rounded-lg border border-dashed p-8 text-center">
            <p className="text-muted-foreground">
              {search ? "Không tìm thấy chương phù hợp" : "Chưa có chương nào"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}