// src/components/common/SearchCommand.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, Clock, TrendingUp, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchResultItem } from "./search/SearchResultItem";
import { useSearch } from "@/hooks/use-search";

interface SearchCommandProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchCommand({ isOpen, onClose }: SearchCommandProps) {
  const { query, setQuery, results, loading, error } = useSearch();
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [trendingSearches] = useState([
    "One Piece", "Naruto", "Attack on Titan", "Dragon Ball", "Demon Slayer"
  ]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("recent-searches");
      if (saved) {
        try {
          setRecentSearches(JSON.parse(saved));
        } catch {
          setRecentSearches([]);
        }
      }
    }
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) {
          onClose();
        }
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, onClose]);

  const addToRecentSearches = (searchTerm: string) => {
    if (!searchTerm.trim()) return;
    
    const newRecent = [searchTerm, ...recentSearches.filter(s => s !== searchTerm)].slice(0, 5);
    setRecentSearches(newRecent);
    
    if (typeof window !== "undefined") {
      localStorage.setItem("recent-searches", JSON.stringify(newRecent));
    }
  };

  const handleSearch = (searchTerm: string) => {
    setQuery(searchTerm);
    addToRecentSearches(searchTerm);
  };

  const handleResultClick = () => {
    if (query.trim()) {
      addToRecentSearches(query);
    }
    onClose();
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    if (typeof window !== "undefined") {
      localStorage.removeItem("recent-searches");
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Command Panel */}
      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 transform">
        <div className="mx-4 overflow-hidden rounded-xl border bg-popover shadow-2xl">
          {/* Search Input */}
          <div className="flex items-center border-b px-4 py-3">
            <Search className="mr-3 h-5 w-5 text-muted-foreground" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Tìm kiếm truyện tranh..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
            />
            {loading && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin text-muted-foreground" />
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Results Content */}
          <div className="max-h-96 overflow-y-auto">
            {query.trim() && results.length > 0 && (
              <div className="p-2">
                <div className="mb-2 px-2 text-xs font-medium text-muted-foreground">
                  Kết quả tìm kiếm
                </div>
                {results.map((story, index) => (
                  <SearchResultItem
                    key={story._id || story.slug || index}
                    story={story}
                    onClick={handleResultClick}
                  />
                ))}
              </div>
            )}

            {query.trim() && error && (
              <div className="p-4 text-center">
                <p className="text-sm text-muted-foreground">{error}</p>
              </div>
            )}

            {!query.trim() && (
              <div className="p-2">
                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between px-2 pb-2">
                      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        Tìm kiếm gần đây
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearRecentSearches}
                        className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
                      >
                        Xóa tất cả
                      </Button>
                    </div>
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => handleSearch(search)}
                        className="w-full rounded-lg p-2 text-left text-sm transition-colors hover:bg-accent"
                      >
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          {search}
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Trending Searches */}
                <div>
                  <div className="flex items-center gap-2 px-2 pb-2 text-xs font-medium text-muted-foreground">
                    <TrendingUp className="h-3 w-3" />
                    Xu hướng tìm kiếm
                  </div>
                  {trendingSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleSearch(search)}
                      className="w-full rounded-lg p-2 text-left text-sm transition-colors hover:bg-accent"
                    >
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        {search}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {query.trim() && !loading && results.length === 0 && !error && (
              <div className="p-4 text-center">
                <p className="text-sm text-muted-foreground">
                  Không tìm thấy kết quả cho &quot;{query}&quot;
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t bg-muted/30 px-4 py-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-4">
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                  <span className="text-xs">↵</span>
                  để chọn
                </kbd>
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                  <span className="text-xs">ESC</span>
                  để đóng
                </kbd>
              </div>
              <span>Nhấn Ctrl+K để mở</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}