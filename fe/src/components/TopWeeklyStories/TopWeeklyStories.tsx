// fe/src/components/TopWeeklyStories/TopWeeklyStories.tsx
"use client";

import { useEffect, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { RootState } from "@/store/store";
import { StoryObject } from "@/lib/api/comic";
import Image from "next/image";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

interface TopWeeklyStoriesProps {
  className?: string;
}

const TopWeeklyStories: React.FC<TopWeeklyStoriesProps> = ({ className = "" }) => {
  const { topWeeklyStories = [], loading, error } = useSelector(
    (state: RootState) => state.category
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (topWeeklyStories.length === 0 || loading || !containerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: -50, scale: 0.8 },
        { opacity: 1, y: 0, scale: 1, duration: 1, ease: "power3.out" }
      );

      gsap.fromTo(
        cardsRef.current.filter(Boolean),
        { opacity: 0, y: 100, scale: 0.8, rotateY: 15 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotateY: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          delay: 0.3,
        }
      );

      cardsRef.current.forEach((card) => {
        if (card) {
          const onEnter = () =>
            gsap.to(card, {
              scale: 1.02, // Giảm từ 1.05 xuống 1.02
              y: -2, // Giảm từ -10 xuống -2
              boxShadow: "0 15px 30px rgba(0,0,0,0.2)", // Giảm shadow
              duration: 0.3,
              ease: "power2.out",
            });
          const onLeave = () =>
            gsap.to(card, {
              scale: 1,
              y: 0,
              boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
              duration: 0.3,
              ease: "power2.out",
            });
          card.addEventListener("mouseenter", onEnter);
          card.addEventListener("mouseleave", onLeave);

          return () => {
            card.removeEventListener("mouseenter", onEnter);
            card.removeEventListener("mouseleave", onLeave);
          };
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, [topWeeklyStories, loading]);

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
    <div
      ref={containerRef}
      className={`${className} py-12 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen overflow-visible`}
    >
      <div className="container mx-auto px-4 max-w-7xl relative">
        <h1
          ref={titleRef}
          className="text-4xl md:text-5xl font-bold text-center mb-12 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
        >
          Top 10 truyện hot hôm nay
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 lg:gap-8 pb-8">
          {topWeeklyStories.slice(0, 10).map((story: StoryObject, index: number) => (
            <div
              key={story._id || story.slug || index}
              ref={(el) => (cardsRef.current[index] = el)}
              className="relative group cursor-pointer transform-gpu"
            >
              <Link href={`/comic/${story.slug}`} passHref>
                <div className="relative overflow-hidden rounded-2xl shadow-lg bg-white">
                  <div
                    className={`absolute top-3 left-3 z-10 w-12 h-12 rounded-full ${getRankColor(
                      index
                    )} flex items-center justify-center font-bold text-lg shadow-lg`}
                  >
                    {index + 1}
                  </div>

                  <div className="relative aspect-[3/4] overflow-hidden">
                    <Image
                      src={story.thumb_url || "/placeholder-image.jpg"}
                      alt={story.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                    />
                    <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <h3 className="font-bold text-lg mb-2 line-clamp-2">{story.name}</h3>
                      <div className="flex justify-between items-center text-sm opacity-90">
                        <span className="flex items-center gap-1">
                          👁 {formatStats(story.weeklyViewCount || 0)}
                        </span>
                        <span className="flex items-center gap-1">
                          ❤️ {formatStats(story.like_count || 0)}
                        </span>
                      </div>
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
                            {story.status === "completed" ? "Hoàn thành" : "Đang cập nhật"}
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

        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
          <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-200/20 rounded-full blur-3xl"></div>
        </div>
      </div>
    </div>
  );
};

export default TopWeeklyStories;