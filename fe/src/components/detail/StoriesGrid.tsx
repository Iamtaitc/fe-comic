"use client";

import { motion } from "framer-motion";
import { StoryCard } from "@/components/home/StoryCard";
import { StoryObject } from "@/lib/api/comic/types";

interface StoriesGridProps {
  stories: StoryObject[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4
    }
  }
};

export function StoriesGrid({ stories }: StoriesGridProps) {
  return (
    <div className="container py-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
      >
        {stories.map((story, index) => (
          <motion.div
            key={story._id}
            variants={itemVariants}
            layout
          >
            <StoryCard 
              story={story} 
              priority={index < 12}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
