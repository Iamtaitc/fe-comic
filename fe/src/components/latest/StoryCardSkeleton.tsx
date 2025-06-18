// src/components/latest/StoryCardSkeleton.tsx
"use client";

import { motion } from "framer-motion";

export function StoryCardSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="manga-card"
    >
      <div className="manga-cover relative bg-muted animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-t from-muted-foreground/20 to-transparent" />
      </div>
      <div className="p-3 space-y-3">
        <div className="h-4 bg-muted rounded animate-pulse" />
        <div className="h-3 bg-muted rounded w-3/4 animate-pulse" />
        <div className="flex gap-1">
          <div className="h-5 bg-muted rounded-full w-12 animate-pulse" />
          <div className="h-5 bg-muted rounded-full w-16 animate-pulse" />
        </div>
      </div>
    </motion.div>
  );
}