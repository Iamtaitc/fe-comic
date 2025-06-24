//fe\src\components\home\StoriesSection.tsx
"use client";

import { useState, useEffect, memo } from "react";
import { StoryObject } from "@/lib/api/comic/types";
import { StoryCard } from "./StoryCard";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { gsap } from "gsap";

const MemoizedStoryCard = memo(StoryCard);

interface StoriesSectionProps {
  fetchStories: (params?: { page?: number; limit?: number }) => Promise<{
    success: boolean;
    data?: {
      data?: {
        stories: StoryObject[];
      };
    };
  }>;
  title: string;
  icon: React.ReactNode;
  iconClass: string;
  link: string;
  titleGradient: string;
  iconMotion: string;
}

export function StoriesSection({
  fetchStories,
  title,
  icon,
  iconClass,
  link,
  titleGradient,
  iconMotion,
}: StoriesSectionProps) {
  const [stories, setStories] = useState<StoryObject[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchStories({ page: 1, limit: 10 });
      console.log(`API Response for ${title}:`, JSON.stringify(res, null, 2)); // Log chi tiết
      console.log(`Stories Data for ${title}:`, res.data?.data?.stories); // Log mảng stories
      setStories(
        res.success && res.data?.data?.stories ? res.data.data.stories : []
      );
      console.log(`Updated Stories State for ${title}:`, res.success && res.data?.data?.stories ? res.data.data.stories : []);
    } catch (err) {
      console.error(`Failed to fetch ${title.toLowerCase()}:`, err);
      setError(`Không thể tải ${title.toLowerCase()}. Vui lòng thử lại sau.`);
    } finally {
      setLoading(false);
    }
  };

  fetchData();

    // GSAP animations
    gsap.fromTo(
      ".section-title",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
    );
    gsap.fromTo(
      ".story-card",
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out",
        delay: 0.5,
      }
    );
    gsap.fromTo(
      ".view-all-button",
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 0.8, ease: "bounce.out", delay: 0.7 }
    );
  }, [fetchStories, title]);

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.3 } },
  };

  const item = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.2 } },
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="manga-card">
                <div className="manga-cover">
                  <Skeleton className="absolute inset-0" />
                </div>
                <div className="p-3">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="mt-2 h-4 w-20" />
                  <div className="mt-2 flex gap-1">
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                </div>
              </div>
            ))}
        </div>
      );
    }

    if (error) {
      return (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      );
    }

    if (stories.length === 0) {
      return (
        <Alert>
          <AlertDescription>
            Không có {title.toLowerCase()} nào hiện tại.
          </AlertDescription>
        </Alert>
      );
    }

    return (
      <motion.div
        className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {stories.slice(0, 10).map((story, index) => (
          <motion.div key={story._id} variants={item} className="story-card">
            <MemoizedStoryCard story={story} priority={index < 5} />
          </motion.div>
        ))}
      </motion.div>
    );
  };

  return (
    <section className="py-12">
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <h2
            className={`text-xl md:text-2xl font-bold flex items-center gap-2 section-title ${titleGradient} bg-clip-text text-transparent`}>
            <span className={iconClass}>{icon}</span>
            {title}
          </h2>
          <div className="mt-4 md:mt-0 view-all-button">
            <Button
              asChild
              variant="outline"
              className="px-6 py-2 border-none hover:text-red-200">
              <Link href={link}>
                Xem tất cả
                <motion.div
                  className={`inline-block ${iconMotion}`}
                  animate={{ x: [0, 4, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}>
                  →
                </motion.div>
              </Link>
            </Button>
          </div>
        </div>
        {renderContent()}
      </div>
    </section>
  );
}