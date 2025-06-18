// src/components/common/SearchInput.tsx
"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchCommand } from "./SearchCommand";
import { cn } from "@/lib/utils";

interface SearchInputProps {
  className?: string;
  mobile?: boolean;
}

export function SearchInput({ className, mobile = false }: SearchInputProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Global keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (mobile) {
    return (
      <>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(true)}
          className={cn("h-9 w-9 p-0", className)}
        >
          <Search className="h-4 w-4" />
          <span className="sr-only">Tìm kiếm</span>
        </Button>
        
        <SearchCommand 
          isOpen={isOpen} 
          onClose={() => setIsOpen(false)} 
        />
      </>
    );
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "flex h-9 w-full max-w-sm items-center gap-3 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          className
        )}
      >
        <Search className="h-4 w-4 text-muted-foreground" />
        <span className="flex-1 text-left text-muted-foreground">
          Tìm kiếm truyện tranh...
        </span>
      </button>
      
      <SearchCommand 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
      />
    </>
  );
}