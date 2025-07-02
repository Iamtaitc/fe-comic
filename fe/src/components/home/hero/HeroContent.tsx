// components/home/hero/HeroContent.tsx
"use client";

import { memo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { BookOpen, ChevronRight } from "lucide-react";
import { StoryObject } from "@/lib/api/comic/types";
import { CategoryTags } from "./CategoryTags";
import { StoryStats } from "./StoryStats";

interface HeroContentProps {
  story: StoryObject;
  className?: string;
}

// 🎨 Animation variants
const contentAnimations = {
  container: {
    hidden: { opacity: 0, x: 30, y: 20 },
    visible: { 
      opacity: 1, 
      x: 0, 
      y: 0,
      transition: { 
        duration: 0.6, 
        ease: [0.25, 0.1, 0.25, 1],
        staggerChildren: 0.1
      }
    },
    exit: { 
      opacity: 0, 
      x: -30,
      transition: { duration: 0.4 }
    }
  },
  item: {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 }
    }
  },
  title: {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }
    }
  },
  buttons: {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, delay: 0.3 }
    }
  }
};

export const HeroContent = memo(function HeroContent({ 
  story, 
  className = "" 
}: HeroContentProps) {
  return (
    <motion.div
      className={`flex flex-col justify-center text-center lg:text-left space-y-6 ${className}`}
      variants={contentAnimations.container}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {/* Categories */}
      <motion.div variants={contentAnimations.item}>
        <CategoryTags categories={story.category} />
      </motion.div>

      {/* Title */}
      <motion.h1 
        className="text-3xl font-bold text-white md:text-4xl lg:text-5xl xl:text-6xl leading-tight"
        variants={contentAnimations.title}
      >
        <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
          {story.name}
        </span>
      </motion.h1>

      {/* Description */}
      {story.description && (
        <motion.p 
          className="text-gray-300 text-lg lg:text-xl leading-relaxed line-clamp-3"
          variants={contentAnimations.item}
        >
          {story.description}
        </motion.p>
      )}

      {/* Stats */}
      <motion.div variants={contentAnimations.item}>
        <StoryStats story={story} />
      </motion.div>

      {/* Action Buttons */}
      <motion.div 
        className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4"
        variants={contentAnimations.buttons}
      >
        <Button
          asChild
          size="lg"
          className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all group"
        >
          <Link href={`/comic/${story.slug}`} className="gap-2">
            Xem chi tiết
            <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
        
        <Button
          asChild
          variant="outline"
          size="lg"
          className="gap-2 bg-transparent text-white border-white/30 hover:bg-white/10 hover:border-white/50 transition-all"
        >
          <Link href={`/read/${story.slug}/1`}>
            <BookOpen className="h-5 w-5" />
            Đọc ngay
          </Link>
        </Button>
      </motion.div>

      {/* Additional Info (if needed) */}
      {story.updatedAt && (
        <motion.div 
          className="text-sm text-gray-400 text-center lg:text-left"
          variants={contentAnimations.item}
        >
          Cập nhật: {new Date(story.updatedAt).toLocaleDateString('vi-VN')}
        </motion.div>
      )}
    </motion.div>
  );
});

HeroContent.displayName = "HeroContent";

export default HeroContent;