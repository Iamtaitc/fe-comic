// src/components/latest/LoadMoreButton.tsx - Optional manual load more button
"use client";

import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";
import { motion } from "framer-motion";

interface LoadMoreButtonProps {
  loading: boolean;
  onClick: () => void;
}

export function LoadMoreButton({ loading, onClick }: LoadMoreButtonProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-center"
    >
      <Button
        onClick={onClick}
        disabled={loading}
        variant="outline"
        size="lg"
        className="flex items-center gap-2 px-8 py-3"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Đang tải...
          </>
        ) : (
          <>
            <Plus className="w-5 h-5" />
            Tải thêm truyện
          </>
        )}
      </Button>
    </motion.div>
  );
}