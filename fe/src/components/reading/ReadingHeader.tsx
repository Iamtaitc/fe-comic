// src/components/reading/ReadingHeader.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Home,
  List,
  Settings,
  X,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";

interface ReadingHeaderProps {
  storyName: string;
  storySlug: string;
  chapterNumber: number;
  totalChapters: number;
  onOpenSettings: () => void;
}

export function ReadingHeader({
  storyName,
  storySlug,
  chapterNumber,
  totalChapters,
  onOpenSettings,
}: ReadingHeaderProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY + 20) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY - 20) {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.header
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          exit={{ y: -100 }}
          transition={{ duration: 0.3 }}
          className="fixed top-0 left-0 right-0 z-50 bg-background/80 shadow-sm backdrop-blur-md"
        >
          <div className="container flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <Button asChild variant="ghost" size="icon" className="md:hidden">
                <Link href={`/story/${storySlug}`}>
                  <X className="h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="ghost" size="icon" className="hidden md:flex">
                <Link href="/">
                  <Home className="h-5 w-5" />
                </Link>
              </Button>
              <div className="flex flex-col md:flex-row md:items-center md:gap-2">
                <Link
                  href={`/story/${storySlug}`}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground md:text-base"
                >
                  {storyName}
                </Link>
                <span className="hidden text-muted-foreground md:inline">•</span>
                <span className="text-sm font-medium md:text-base">
                  Chapter {chapterNumber}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <List className="h-5 w-5" />
                    <span className="sr-only">Danh sách chương</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 max-h-96 overflow-y-auto">
                  {Array.from({ length: totalChapters }, (_, i) => (
                    <DropdownMenuItem key={i} asChild className={chapterNumber === i + 1 ? "bg-accent" : ""}>
                      <Link href={`/read/${storySlug}/${i + 1}`}>
                        Chapter {i + 1}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="ghost" size="icon" onClick={onOpenSettings}>
                <Settings className="h-5 w-5" />
                <span className="sr-only">Cài đặt</span>
              </Button>
              <div className="flex">
                <Button
                  asChild
                  variant="ghost"
                  size="icon"
                  disabled={chapterNumber <= 1}
                >
                  <Link href={`/read/${storySlug}/${chapterNumber - 1}`}>
                    <ChevronLeft className="h-5 w-5" />
                    <span className="sr-only">Chương trước</span>
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="ghost"
                  size="icon"
                  disabled={chapterNumber >= totalChapters}
                >
                  <Link href={`/read/${storySlug}/${chapterNumber + 1}`}>
                    <ChevronRight className="h-5 w-5" />
                    <span className="sr-only">Chương sau</span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </motion.header>
      )}
    </AnimatePresence>
  );
}