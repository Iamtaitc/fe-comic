// components/home/hero/CategoryTags.tsx
"use client";

import { memo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

interface CategoryTagsProps {
  categories: Array<{ _id: string; name: string; slug: string }>;
  maxVisible?: number;
  className?: string;
}

// 🎨 Animation variants for tags
const tagAnimations = {
  hidden: { opacity: 0, scale: 0.8, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.3,
      ease: [0.25, 0.1, 0.25, 1],
    },
  }),
  hover: {
    scale: 1.05,
    transition: { duration: 0.2 },
  },
  tap: {
    scale: 0.95,
    transition: { duration: 0.1 },
  },
};

export const CategoryTags = memo(function CategoryTags({
  categories,
  maxVisible = 3,
  className = "",
}: CategoryTagsProps) {
  if (!categories?.length) {
    return null;
  }

  const visibleCategories = categories.slice(0, maxVisible);
  const remainingCount = categories.length - maxVisible;

  return (
    <div
      className={`flex flex-wrap gap-2 justify-center lg:justify-start ${className}`}
    >
      {/* Visible Category Tags */}
      {visibleCategories.map((category, index) => (
        <motion.div
          key={category._id}
          custom={index}
          variants={tagAnimations}
          initial="hidden"
          animate="visible"
          whileHover="hover"
          whileTap="tap"
        >
          <Link
            href={`/category/${category.slug}`}
            className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium 
                       bg-primary/90 text-primary-foreground hover:bg-primary 
                       transition-colors duration-200 backdrop-blur-sm
                       focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2"
            aria-label={`Xem thể loại ${category.name}`}
          >
            {category.name}
          </Link>
        </motion.div>
      ))}

      {/* Remaining Count Indicator */}
      {remainingCount > 0 && (
        <motion.div
          custom={visibleCategories.length}
          variants={tagAnimations}
          initial="hidden"
          animate="visible"
          className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium 
                     bg-white/10 text-white backdrop-blur-sm cursor-default"
          title={`Còn ${remainingCount} thể loại khác: ${categories
            .slice(maxVisible)
            .map((c) => c.name)
            .join(", ")}`}
        >
          +{remainingCount}
        </motion.div>
      )}
    </div>
  );
});

CategoryTags.displayName = "CategoryTags";

export default CategoryTags;
