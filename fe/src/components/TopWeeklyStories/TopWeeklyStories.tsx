"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { StoryObject } from "@/lib/api/comic/types";
import Image from "next/image";
import Link from "next/link";

interface TopWeeklyStoriesProps {
  className?: string;
}

const TopWeeklyStories: React.FC<TopWeeklyStoriesProps> = ({
  className = "",
}) => {
  const {
    topWeeklyStories = [],
    loading,
    error,
  } = useSelector((state: RootState) => state.category);

  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [animatedCards, setAnimatedCards] = useState<Set<number>>(new Set());

  // 🔑 Intersection Observer để trigger animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Stagger animation cho các cards
          topWeeklyStories.forEach((_, index) => {
            setTimeout(() => {
              setAnimatedCards((prev) => new Set([...prev, index]));
            }, index * 100); // 100ms delay giữa mỗi card
          });
        }
      },
      { threshold: 0.1, rootMargin: "50px" }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [topWeeklyStories]);

  const getRankColor = useCallback((index: number) => {
    switch (index) {
      case 0:
        return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white";
      case 1:
        return "bg-gradient-to-r from-gray-300 to-gray-500 text-white";
      case 2:
        return "bg-gradient-to-r from-orange-400 to-orange-600 text-white";
      default:
        return "bg-gradient-to-r from-blue-500 to-purple-600 text-white";
    }
  }, []);

  const formatStats = useCallback((num: number) => {
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  }, []);

  if (loading) {
    return (
      <div className={`${className} py-12`}>
        <div className="container mx-auto px-4 flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${className} py-12`}>
        <div className="container mx-auto px-4 flex items-center justify-center min-h-[400px]">
          <p className="text-lg text-red-500">Không thể tải dữ liệu: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* 🎨 CSS Animations Styles */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInTitle {
          from {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes cardHover {
          from {
            transform: translateY(0) scale(1);
          }
          to {
            transform: translateY(-4px) scale(1.02);
          }
        }

        .title-animate {
          animation: fadeInTitle 0.8s ease-out forwards;
        }

        .card-animate {
          animation: fadeInUp 0.6s ease-out forwards;
        }

        .card-hover {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          will-change: transform, box-shadow;
        }

        .card-hover:hover {
          transform: translateY(-4px) scale(1.02);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }

        .image-hover {
          transition: transform 0.7s cubic-bezier(0.4, 0, 0.2, 1);
          will-change: transform;
        }

        .card-hover:hover .image-hover {
          transform: scale(1.1);
        }

        /* 🎯 Reduce motion for accessibility */
        @media (prefers-reduced-motion: reduce) {
          .title-animate,
          .card-animate,
          .card-hover,
          .image-hover {
            animation: none !important;
            transition: none !important;
            transform: none !important;
          }
        }

        /* 🚀 Performance optimizations */
        .card-container {
          transform: translateZ(0); /* Force GPU acceleration */
          backface-visibility: hidden; /* Prevent flickering */
        }
      `}</style>

      <div
        ref={containerRef}
        className={`${className} py-12 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen overflow-visible`}
      >
        <div className="container mx-auto px-4 max-w-7xl relative">
          {/* 📝 Animated title */}
          <h1
            className={`text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent min-h-[120px] leading-[1.3] ${
              isVisible ? "title-animate" : "opacity-0"
            }`}
          >
            Top 10 truyện hot hôm nay
          </h1>

          {/* 🎴 Cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 lg:gap-8 pb-8">
            {topWeeklyStories
              .slice(0, 10)
              .map((story: StoryObject, index: number) => (
                <div
                  key={story._id || story.slug || index}
                  className={`relative group cursor-pointer card-container ${
                    animatedCards.has(index) ? "card-animate" : "opacity-0"
                  }`}
                  style={{
                    animationDelay: `${index * 0.1}s`,
                  }}
                >
                  <Link href={`/comic/${story.slug}`} passHref>
                    <div className="relative overflow-hidden rounded-2xl shadow-lg bg-white card-hover">
                      {/* 🏆 Rank badge */}
                      <div
                        className={`absolute top-3 left-3 z-10 w-12 h-12 rounded-full ${getRankColor(
                          index
                        )} flex items-center justify-center font-bold text-lg shadow-lg`}
                      >
                        {index + 1}
                      </div>

                      {/* 🖼️ Image container */}
                      <div className="relative aspect-[3/4] overflow-hidden">
                        <Image
                          src={story.thumb_url || "/placeholder-image.jpg"}
                          alt={story.name}
                          fill
                          className="object-cover image-hover"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                          priority={index < 3} // Prioritize first 3 images
                        />

                        {/* 🌅 Gradient overlay */}
                        <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                        {/* 📊 Story info */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                          <h3 className="font-bold text-lg mb-2 line-clamp-2">
                            {story.name}
                          </h3>

                          {/* 📈 Stats */}
                          <div className="flex justify-between items-center text-sm opacity-90">
                            <span className="flex items-center gap-1">
                              👁 {formatStats(story.weeklyViewCount || 0)}
                            </span>
                            <span className="flex items-center gap-1">
                              ❤️ {formatStats(story.likes || 0)}
                            </span>
                          </div>

                          {/* 🏷️ Tags */}
                          <div className="mt-2 text-xs opacity-75 flex flex-wrap gap-2">
                            <span className="bg-blue-500/20 px-2 py-1 rounded-full">
                              {story.chapters_count || 0} chương
                            </span>
                            {story.status && (
                              <span
                                className={`px-2 py-1 rounded-full ${
                                  story.status === "completed"
                                    ? "bg-green-500/20"
                                    : "bg-yellow-500/20"
                                }`}
                              >
                                {story.status === "completed"
                                  ? "Hoàn thành"
                                  : "Đang cập nhật"}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
          </div>

          {/* 🎨 Background decorations */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
            <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-200/20 rounded-full blur-3xl"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TopWeeklyStories;
