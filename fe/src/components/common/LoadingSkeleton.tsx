// components/common/LoadingSkeleton.tsx
"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

interface LoadingSkeletonProps {
  count?: number;
  columns?: {
    mobile: number;
    tablet: number;
    desktop: number;
    large: number;
  };
  animate?: boolean;
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
      transition: { duration: 0.2, staggerChildren: 0.05, delayChildren: 0.1 },
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

export const LoadingSkeleton = memo(function LoadingSkeleton({
  count = 6,
  columns = defaultColumns,
  animate = true
}: LoadingSkeletonProps) {
  const gridClasses = [
    "grid gap-3",
    `grid-cols-${columns.mobile}`,
    `sm:grid-cols-${columns.tablet}`,
    `md:grid-cols-${columns.desktop}`,
    `lg:grid-cols-${columns.large}`
  ].join(" ");

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

  return (
    <GridWrapper {...gridProps}>
      {Array.from({ length: count }, (_, i) => {
        const cardProps = animate ? {
          key: `skeleton-${i}`,
          variants: animations.card,
          className: "manga-card"
        } : {
          key: `skeleton-${i}`,
          className: "manga-card"
        };

        return (
          <CardWrapper {...cardProps}>
            <div className="overflow-hidden rounded-lg bg-white shadow-sm">
              <Skeleton className="aspect-[3/4] rounded-lg" />
              <div className="space-y-2 p-3">
                <Skeleton className="h-4 w-full rounded" />
                <Skeleton className="h-3 w-16 rounded" />
                <div className="flex gap-1">
                  <Skeleton className="h-3 w-10 rounded" />
                  <Skeleton className="h-3 w-10 rounded" />
                </div>
              </div>
            </div>
          </CardWrapper>
        );
      })}
    </GridWrapper>
  );
});

LoadingSkeleton.displayName = "LoadingSkeleton";