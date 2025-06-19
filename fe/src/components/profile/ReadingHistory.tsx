// src/components/profile/ReadingHistory.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { format, formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Clock, LayoutGrid, List, Trash2 } from "lucide-react";
import { StoryObject } from "@/lib/api/comic/types";
import { toast } from "sonner";

interface ReadingHistoryItem {
  id: string;
  story: StoryObject;
  chapterNumber: number;
  chapterTitle?: string;
  progress: number; // 0-100
  lastReadAt: string;
}

interface ReadingHistoryProps {
  historyItems: ReadingHistoryItem[];
}

export function ReadingHistory({ historyItems: initialItems }: ReadingHistoryProps) {
  const [historyItems, setHistoryItems] = useState(initialItems);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortOrder, setSortOrder] = useState<"recent" | "oldest" | "name">("recent");
  
  const handleClearHistory = () => {
    if (confirm("Bạn có chắc chắn muốn xóa tất cả lịch sử đọc truyện?")) {
      setHistoryItems([]);
      toast.success("Đã xóa lịch sử đọc truyện!");
    }
  };
  
  const handleRemoveItem = (id: string) => {
    setHistoryItems(historyItems.filter(item => item.id !== id));
    toast.success("Đã xóa khỏi lịch sử đọc!");
  };
  
  const sortedItems = [...historyItems].sort((a, b) => {
    if (sortOrder === "recent") {
      return new Date(b.lastReadAt).getTime() - new Date(a.lastReadAt).getTime();
    } else if (sortOrder === "oldest") {
      return new Date(a.lastReadAt).getTime() - new Date(b.lastReadAt).getTime();
    } else {
      return a.story.name.localeCompare(b.story.name);
    }
  });
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    
    // Nếu là ngày hôm nay, hiển thị "Hôm nay, [giờ]"
    if (date.toDateString() === now.toDateString()) {
      return `Hôm nay, ${format(date, "HH:mm")}`;
    }
    
    // Nếu là trong vòng 7 ngày, hiển thị "[số] ngày trước"
    if (now.getTime() - date.getTime() < 7 * 24 * 60 * 60 * 1000) {
      return formatDistanceToNow(date, { addSuffix: true, locale: vi });
    }
    
    // Còn lại hiển thị ngày tháng đầy đủ
    return format(date, "dd/MM/yyyy, HH:mm", { locale: vi });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Clock className="h-5 w-5 text-manga-orange" />
          Lịch sử đọc truyện
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
          
          <Button
            variant="outline"
            size="icon"
            onClick={handleClearHistory}
            className="h-9 w-9"
            disabled={historyItems.length === 0}
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Xóa lịch sử</span>
          </Button>
        </div>
      </div>
      
      {historyItems.length === 0 ? (
        <div className="text-center py-12 border rounded-lg">
          <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">Chưa có lịch sử đọc truyện</h3>
          <p className="text-muted-foreground mt-2">
            Các truyện bạn đọc sẽ xuất hiện ở đây
          </p>
          <Button variant="manga" className="mt-4">
            <Link href="/">Khám phá truyện</Link>
          </Button>
        </div>
      ) : (
        <>
          {viewMode === "grid" ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {sortedItems.map((item) => (
                <div key={item.id} className="manga-card group relative">
                  <Link href={`/read/${item.story.slug}/${item.chapterNumber}`} className="block">
                    <div className="manga-cover">
                      <Image
                        src={item.story.thumb_url}
                        alt={item.story.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                        <div className="w-full bg-white/30 rounded-full h-1">
                          <div
                            className="bg-manga-orange h-1 rounded-full"
                            style={{ width: `${item.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    <div className="p-3">
                      <h3 className="manga-title group-hover:text-manga-orange">{item.story.name}</h3>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Chapter {item.chapterNumber}
                        {item.chapterTitle && ` - ${item.chapterTitle}`}
                      </p>
                      <p className="mt-2 text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDate(item.lastReadAt)}
                      </p>
                    </div>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-7 w-7 bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {sortedItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-3 rounded-lg border hover:bg-accent/50 transition-colors group relative"
                >
                  <div className="relative h-16 w-12 flex-shrink-0 overflow-hidden rounded">
                    <Image
                      src={item.story.thumb_url}
                      alt={item.story.name}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">
                      <Link href={`/story/${item.story.slug}`} className="hover:text-manga-orange">
                        {item.story.name}
                      </Link>
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      <Link href={`/read/${item.story.slug}/${item.chapterNumber}`} className="hover:underline">
                        Chapter {item.chapterNumber}
                        {item.chapterTitle && ` - ${item.chapterTitle}`}
                      </Link>
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <div className="w-24 bg-muted rounded-full h-1">
                        <div
                          className="bg-manga-orange h-1 rounded-full"
                          style={{ width: `${item.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {item.progress}%
                      </span>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatDate(item.lastReadAt)}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 flex-shrink-0"
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}