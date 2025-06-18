// src/components/reading/MangaReader.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useInView } from "framer-motion";
import { useLocalStorage } from "@/lib/hooks/useLocalStorage";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

interface MangaPage {
  id: string;
  url: string;
  pageNumber: number;
}

interface MangaReaderProps {
  pages: MangaPage[];
  storySlug: string;
  chapterNumber: number;
  totalChapters: number;
}

export function MangaReader({
  pages,
  storySlug,
  chapterNumber,
  totalChapters,
}: MangaReaderProps) {
  const [loadingBehavior] = useLocalStorage("manga-loading-behavior", "auto");
  const [readingDirection] = useLocalStorage("manga-reading-direction", "vertical");
  const [loadedPages, setLoadedPages] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(0);
  const [showNavigation, setShowNavigation] = useState(false);
  
  const readerRef = useRef<HTMLDivElement>(null);
  
  // Theo dõi scroll để cập nhật trang hiện tại trong chế độ đọc dọc
  useEffect(() => {
    if (readingDirection !== "vertical") return;
    
    const handleScroll = () => {
      if (!readerRef.current) return;
      
      const readerRect = readerRef.current.getBoundingClientRect();
      const visiblePages = Array.from(readerRef.current.children)
        .filter((child) => {
          const rect = child.getBoundingClientRect();
          return (
            rect.top < window.innerHeight / 2 &&
            rect.bottom > window.innerHeight / 2
          );
        });
      
      if (visiblePages.length > 0) {
        const pageIndex = Array.from(readerRef.current.children).indexOf(visiblePages[0]);
        setCurrentPage(pageIndex);
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [readingDirection, pages.length]);
  
  // Xử lý phím mũi tên để điều hướng trong chế độ đọc ngang
  useEffect(() => {
    if (readingDirection === "vertical") return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        readingDirection === "rtl" ? nextPage() : prevPage();
      } else if (e.key === "ArrowRight") {
        readingDirection === "rtl" ? prevPage() : nextPage();
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [readingDirection, currentPage]);
  
  // Hiển thị thanh điều hướng khi di chuột qua trong chế độ đọc ngang
  useEffect(() => {
    if (readingDirection === "vertical") return;
    
    const handleMouseMove = () => {
      setShowNavigation(true);
      resetNavigationTimer();
    };
    
    let navigationTimer: NodeJS.Timeout;
    
    const resetNavigationTimer = () => {
      clearTimeout(navigationTimer);
      navigationTimer = setTimeout(() => {
        setShowNavigation(false);
      }, 3000);
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearTimeout(navigationTimer);
    };
  }, [readingDirection]);
  
  // Lưu tiến độ đọc
  useEffect(() => {
    const savedProgress = {
      storySlug,
      chapterNumber,
      currentPage,
      timestamp: new Date().toISOString(),
    };
    
    localStorage.setItem("manga-reading-progress", JSON.stringify(savedProgress));
  }, [storySlug, chapterNumber, currentPage]);
  
  const handleImageLoad = (pageId: string) => {
    setLoadedPages((prev) => new Set(prev).add(pageId));
  };
  
  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
      
      if (readingDirection !== "vertical" && readerRef.current) {
        const pageElement = readerRef.current.children[currentPage - 1] as HTMLElement;
        if (pageElement) {
          pageElement.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
  };
  
  const nextPage = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
      
      if (readingDirection !== "vertical" && readerRef.current) {
        const pageElement = readerRef.current.children[currentPage + 1] as HTMLElement;
        if (pageElement) {
          pageElement.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
  };
  
  return (
    <div className="relative">
      {/* Thanh điều hướng cho chế độ đọc ngang */}
      {readingDirection !== "vertical" && (
        <div
          className={`fixed inset-0 z-10 pointer-events-none flex items-center justify-between p-4 transition-opacity duration-300 ${
            showNavigation ? "opacity-100" : "opacity-0"
          }`}
        >
          <Button
            variant="secondary"
            size="lg"
            className="rounded-full bg-background/80 backdrop-blur-sm pointer-events-auto"
            onClick={readingDirection === "rtl" ? nextPage : prevPage}
            disabled={readingDirection === "rtl" ? currentPage >= pages.length - 1 : currentPage <= 0}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="secondary"
            size="lg"
            className="rounded-full bg-background/80 backdrop-blur-sm pointer-events-auto"
            onClick={readingDirection === "rtl" ? prevPage : nextPage}
            disabled={readingDirection === "rtl" ? currentPage <= 0 : currentPage >= pages.length - 1}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
      )}
      
      <div
        ref={readerRef}
        className={`mx-auto flex ${
          readingDirection === "vertical"
            ? "flex-col gap-[var(--manga-page-gap)] max-w-[var(--manga-page-width)]"
            : readingDirection === "rtl"
            ? "flex-row-reverse overflow-x-auto snap-x"
            : "flex-row overflow-x-auto snap-x"
        }`}
      >
        {pages.map((page, index) => {
          const shouldLoad =
            loadingBehavior === "all" ||
            (loadingBehavior === "auto" &&
              index <= currentPage + 3 &&
              index >= currentPage - 1) ||
            index === currentPage;
          
          return (
            <div
              key={page.id}
              className={`relative w-full ${
                readingDirection !== "vertical"
                  ? "flex-shrink-0 snap-center h-screen flex items-center justify-center"
                  : ""
              }`}
            >
              {shouldLoad ? (
                <div className="relative w-full aspect-[2/3] bg-accent/50 rounded-md overflow-hidden">
                  {!loadedPages.has(page.id) && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-manga-orange" />
                    </div>
                  )}
                  <Image
                    src={page.url}
                    alt={`Trang ${page.pageNumber}`}
                    fill
                    className={`object-contain transition-opacity duration-500 ${
                      loadedPages.has(page.id) ? "opacity-100" : "opacity-0"
                    }`}
                    onLoad={() => handleImageLoad(page.id)}
                    sizes="(max-width: 768px) 100vw, var(--manga-page-width)"
                    priority={index === currentPage}
                  />
                </div>
              ) : (
                <div className="w-full aspect-[2/3] bg-accent/30 rounded-md flex items-center justify-center">
                  <Button
                    variant="outline"
                    onClick={() => handleImageLoad(page.id)}
                  >
                    Tải trang
                  </Button>
                </div>
              )}
              <div className="mt-2 text-center text-sm text-muted-foreground">
                Trang {page.pageNumber} / {pages.length}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}