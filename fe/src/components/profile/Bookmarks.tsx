// src/components/profile/Bookmarks.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Bookmark, Heart, LayoutGrid, List, Trash2 } from "lucide-react";
import { StoryObject } from "@/lib/api/comic";
import { toast } from "sonner";

interface BookmarkItem {
  id: string;
  story: StoryObject;
  addedAt: string;
  lastUpdatedAt: string;
  notes?: string;
  reading: 'reading' | 'plan_to_read' | 'completed' | 'dropped';
}

interface BookmarksProps {
  bookmarks: BookmarkItem[];
}

export function Bookmarks({ bookmarks: initialBookmarks }: BookmarksProps) {
  const [bookmarks, setBookmarks] = useState(initialBookmarks);
  const [activeTab, setActiveTab] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortOrder, setSortOrder] = useState<"recent" | "oldest" | "name">("recent");
  
  const handleRemoveBookmark = (id: string) => {
    setBookmarks(bookmarks.filter(item => item.id !== id));
    toast.success("Đã xóa khỏi danh sách đánh dấu!");
  };
  
  const filteredBookmarks = bookmarks.filter(bookmark => {
    if (activeTab === "all") return true;
    return bookmark.reading === activeTab;
  });
  
  const sortedBookmarks = [...filteredBookmarks].sort((a, b) => {
    if (sortOrder === "recent") {
      return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
    } else if (sortOrder === "oldest") {
      return new Date(a.addedAt).getTime() - new Date(b.addedAt).getTime();
    } else {
      return a.story.name.localeCompare(b.story.name);
    }
  });
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  
  const getStatusLabel = (status: string) => {
    switch (status) {
      case "reading":
        return "Đang đọc";
      case "plan_to_read":
        return "Dự định đọc";
      case "completed":
        return "Đã hoàn thành";
      case "dropped":
        return "Đã bỏ";
      default:
        return status;
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "reading":
        return "bg-blue-500";
      case "plan_to_read":
        return "bg-purple-500";
      case "completed":
        return "bg-green-500";
      case "dropped":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Bookmark className="h-5 w-5 text-manga-orange" />
          Danh sách truyện đánh dấu
        </h2>
        
        <div className="flex items-center gap-2">
          <Select
            value={sortOrder}
            onValueChange={(value: "recent" | "oldest" | "name") => setSortOrder(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sắp xếp theo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Mới nhất</SelectItem>
              <SelectItem value="oldest">Cũ nhất</SelectItem>
              <SelectItem value="name">Tên truyện</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="border rounded-md p-1 flex">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="icon"
              onClick={() => setViewMode("grid")}
              className="h-8 w-8"
            >
              <LayoutGrid className="h-4 w-4" />
              <span className="sr-only">Grid view</span>
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="icon"
              onClick={() => setViewMode("list")}
              className="h-8 w-8"
            >
              <List className="h-4 w-4" />
              <span className="sr-only">List view</span>
            </Button>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full grid grid-cols-5">
          <TabsTrigger value="all">Tất cả</TabsTrigger>
          <TabsTrigger value="reading">Đang đọc</TabsTrigger>
          <TabsTrigger value="plan_to_read">Dự định đọc</TabsTrigger>
          <TabsTrigger value="completed">Đã hoàn thành</TabsTrigger>
          <TabsTrigger value="dropped">Đã bỏ</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-6">
          {sortedBookmarks.length === 0 ? (
            <div className="text-center py-12 border rounded-lg">
              <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">Chưa có truyện nào trong danh sách này</h3>
              <p className="text-muted-foreground mt-2">
                Hãy lưu truyện yêu thích của bạn để đọc sau
              </p>
              <Button variant="manga" className="mt-4">
                <Link href="/">Khám phá truyện</Link>
              </Button>
            </div>
          ) : (
            <>
              {viewMode === "grid" ? (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  {sortedBookmarks.map((bookmark) => (
                    <div key={bookmark.id} className="manga-card group relative">
                      <Link href={`/story/${bookmark.story.slug}`} className="block">
                        <div className="manga-cover">
                          <Image
                            src={bookmark.story.thumb_url}
                            alt={bookmark.story.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                          />
                          <div className={`absolute top-2 left-2 rounded-full px-2 py-1 text-[10px] text-white ${getStatusColor(bookmark.reading)}`}>
                            {getStatusLabel(bookmark.reading)}
                          </div>
                        </div>
                        <div className="p-3">
                          <h3 className="manga-title group-hover:text-manga-orange">{bookmark.story.name}</h3>
                          <p className="mt-1 text-xs text-muted-foreground">
                            Cập nhật: {formatDate(bookmark.lastUpdatedAt)}
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground flex items-center gap-1">
                            <Bookmark className="h-3 w-3" />
                            Đã lưu: {formatDate(bookmark.addedAt)}
                          </p>
                        </div>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 h-7 w-7 bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleRemoveBookmark(bookmark.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {sortedBookmarks.map((bookmark) => (
                    <div
                      key={bookmark.id}
                      className="flex items-center gap-4 p-3 rounded-lg border hover:bg-accent/50 transition-colors group relative"
                    >
                      <div className="relative h-16 w-12 flex-shrink-0 overflow-hidden rounded">
                        <Image
                          src={bookmark.story.thumb_url}
                          alt={bookmark.story.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium truncate">
                            <Link href={`/story/${bookmark.story.slug}`} className="hover:text-manga-orange">
                              {bookmark.story.name}
                            </Link>
                          </h3>
                          <span className={`rounded-full px-2 py-0.5 text-[10px] text-white ${getStatusColor(bookmark.reading)}`}>
                            {getStatusLabel(bookmark.reading)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {bookmark.story.category.slice(0, 3).map((cat, i) => (
                            <span key={cat._id}>
                              {i > 0 && ", "}
                              {cat.name}
                            </span>
                          ))}
                          {bookmark.story.category.length > 3 && ", ..."}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Đã lưu: {formatDate(bookmark.addedAt)}
                        </p>
                      </div>
                      <div className="text-xs text-muted-foreground whitespace-nowrap">
                        Cập nhật: {formatDate(bookmark.lastUpdatedAt)}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 flex-shrink-0"
                        onClick={() => handleRemoveBookmark(bookmark.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}