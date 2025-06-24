// src/components/home/PaginationControls.tsx
"use client";

import { Button } from "@/components/ui/button";
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight,
  MoreHorizontal 
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
  showInfo?: boolean;
}

export function PaginationControls({
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
  loading = false,
  showInfo = true,
}: PaginationControlsProps) {
  // Tính toán các trang hiển thị
  const getVisiblePages = () => {
    const delta = 2; // Số trang hiển thị trước và sau trang hiện tại
    const pages: (number | string)[] = [];
    
    // Luôn hiển thị trang đầu
    if (totalPages <= 7) {
      // Nếu ít hơn 7 trang, hiển thị tất cả
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Logic phức tạp hơn cho nhiều trang
      pages.push(1);
      
      if (currentPage <= delta + 2) {
        // Gần trang đầu
        for (let i = 2; i <= Math.min(delta + 3, totalPages - 1); i++) {
          pages.push(i);
        }
        if (totalPages > delta + 3) {
          pages.push("...");
        }
      } else if (currentPage >= totalPages - delta - 1) {
        // Gần trang cuối
        if (totalPages > delta + 3) {
          pages.push("...");
        }
        for (let i = Math.max(totalPages - delta - 2, 2); i < totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Ở giữa
        pages.push("...");
        for (let i = currentPage - delta; i <= currentPage + delta; i++) {
          pages.push(i);
        }
        pages.push("...");
      }
      
      // Luôn hiển thị trang cuối (nếu không phải trang 1)
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const visiblePages = getVisiblePages();
  
  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Pagination Info */}
      {showInfo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-muted-foreground text-center"
        >
          Trang {currentPage} / {totalPages} • Tổng {totalItems.toLocaleString()} kết quả
        </motion.div>
      )}

      {/* Pagination Controls */}
      <motion.div
        className="flex items-center gap-1"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: { 
            opacity: 1,
            transition: { staggerChildren: 0.05 }
          }
        }}
      >
        {/* First Page */}
        <motion.div variants={itemVariants}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1 || loading}
            className="hidden sm:flex"
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
        </motion.div>

        {/* Previous Page */}
        <motion.div variants={itemVariants}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1 || loading}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden sm:inline ml-1">Trước</span>
          </Button>
        </motion.div>

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {visiblePages.map((page, index) => (
            <motion.div key={`${page}-${index}`} variants={itemVariants}>
              {page === "..." ? (
                <div className="flex items-center justify-center w-10 h-10">
                  <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                </div>
              ) : (
                <motion.div
                  whileHover="hover"
                  whileTap="tap"
                  variants={itemVariants}
                >
                  <Button
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => onPageChange(page as number)}
                    disabled={loading}
                    className={cn(
                      "w-10 h-10 p-0 transition-all duration-200",
                      currentPage === page && "shadow-md"
                    )}
                  >
                    {page}
                  </Button>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Next Page */}
        <motion.div variants={itemVariants}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages || loading}
          >
            <span className="hidden sm:inline mr-1">Sau</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </motion.div>

        {/* Last Page */}
        <motion.div variants={itemVariants}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages || loading}
            className="hidden sm:flex"
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </motion.div>
      </motion.div>

      {/* Mobile compact info */}
      <div className="sm:hidden text-xs text-muted-foreground">
        {currentPage} / {totalPages}
      </div>
    </div>
  );
}