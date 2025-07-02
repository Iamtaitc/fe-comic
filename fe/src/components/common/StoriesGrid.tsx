// components/common/StoriesGrid.tsx - Updated to use existing StoryCard
"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { StoryObject } from "@/lib/api/comic/types";
import { StoryCard } from "../home/StoryCard";

interface StoriesGridProps {
  stories: StoryObject[];
  columns?: {
    mobile: number;
    tablet: number;
    desktop: number;
    large: number;
  };
  animate?: boolean;
  className?: string;
  showPriority?: boolean;
}

const defaultColumns = {
  mobile: 2,
  tablet: 3, 
  desktop: 4,
  large: 5
};

const animations = {
  container: {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { 
        duration: 0.2, 
        staggerChildren: 0.05, 
        delayChildren: 0.1 
      },
    },
  },
  card: {
    hidden: { opacity: 0, y: 12 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.25, ease: [0.25, 0.1, 0.25, 1] },
    },
  },
};

export const StoriesGrid = memo(function StoriesGrid({
  stories,
  columns = defaultColumns,
  animate = true,
  className = "",
  showPriority = true
}: StoriesGridProps) {
  // 🔑 Dynamic grid classes based on columns
  const gridClasses = [
    "grid gap-3 sm:gap-4",
    `grid-cols-${columns.mobile}`,
    `sm:grid-cols-${columns.tablet}`,
    `md:grid-cols-${columns.desktop}`,
    `lg:grid-cols-${columns.large}`,
    className
  ].join(" ");

  // 🔑 Conditional wrappers based on animation preference
  const GridWrapper = animate ? motion.div : "div";
  const CardWrapper = animate ? motion.div : "div";

  const gridProps = animate ? {
    className: gridClasses,
    variants: animations.container,
    initial: "hidden",
    animate: "show"
  } : {
    className: gridClasses
  };

  if (!stories?.length) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Không có truyện nào được tìm thấy.</p>
      </div>
    );
  }

  return (
    <GridWrapper {...gridProps}>
      {stories.map((story, index) => {
        const cardProps = animate ? {
          key: story._id,
          variants: animations.card,
          className: "story-card-wrapper"
        } : {
          key: story._id,
          className: "story-card-wrapper"
        };

        return (
          <CardWrapper {...cardProps}>
            <StoryCard 
              story={story} 
              priority={showPriority && index < 4} // First 4 items get priority loading
              className="h-full" // Ensure consistent card heights
            />
          </CardWrapper>
        );
      })}
    </GridWrapper>
  );
});

StoriesGrid.displayName = "StoriesGrid";