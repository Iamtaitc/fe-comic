"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { CategoryObject } from "@/lib/api/comic/types";
import { BookOpen } from "lucide-react";

interface CategoryListProps {
  categories: CategoryObject[];
}

export function CategoryList({ categories }: CategoryListProps) {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
      },
    },
  };

  // Gradient mapping for categories
  const getGradientByIndex = (index: number) => {
    const gradients = [
      "from-purple-600 via-pink-600 to-blue-600",
      "from-blue-600 via-cyan-600 to-teal-600",
      "from-orange-600 via-red-600 to-pink-600",
      "from-rose-600 via-pink-600 to-purple-600",
      "from-green-600 via-teal-600 to-blue-600",
    ];
    return gradients[index % gradients.length];
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
    >
      {categories.map((category, index) => (
        <motion.div
          key={category._id}
          variants={itemVariants}
          className="category-card"
        >
          <Link href={`/category/${category.slug}`} className="block">
            <div className={`relative aspect-[4/3] rounded-lg overflow-hidden bg-gradient-to-r ${getGradientByIndex(index)}`}>
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center transition-all hover:bg-black/20">
                <h3 className="text-white text-lg font-semibold text-center px-4">
                  {category.name}
                </h3>
              </div>
            </div>
            <div className="p-3">
              <h4 className="font-medium truncate">{category.name}</h4>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                <BookOpen className="w-4 h-4" />
                <span>{category.storyCount} truyện</span>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
}