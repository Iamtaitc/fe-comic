"use client";

import { useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import Image from "next/image";
import Link from "next/link";

const TopWeeklyStoriesStacked: React.FC = () => {
  const {
    topWeeklyStories = [],
    loading,
    error,
  } = useSelector((state: RootState) => state.category);

  const containerRef = useRef<HTMLDivElement>(null);

  const getRankStyle = (index: number) => {
    const base =
      "absolute top-3 left-3 z-20 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-lg";
    const colors = [
      "bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600",
      "bg-gradient-to-r from-gray-300 via-gray-400 to-gray-500",
      "bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600",
      "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500",
    ];
    return `${base} ${colors[index] || colors[3]} text-white`;
  };

  const formatNumber = (num: number) =>
    num >= 1_000_000
      ? `${(num / 1_000_000).toFixed(1)}M`
      : num >= 1000
      ? `${(num / 1000).toFixed(1)}K`
      : num;

  if (loading) {
    return (
      <div className="py-20 min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-20 min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <p className="text-xl text-red-500 mb-4">Oops! Có lỗi xảy ra</p>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="min-h-screen py-20"
    >
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-7xl font-black mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent min-h-[120px] leading-[1.3]">
            Top 10 truyện hot hôm nay
          </h1>
          <div className="w-32 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8 max-w-6xl mx-auto">
          {topWeeklyStories.slice(0, 10).map((story, index) => (
            <div
              key={story._id || story.slug || index}
              className="group relative w-full max-w-sm mx-auto"
            >
              {/* Stack of cards behind */}
              <div className="absolute inset-0">
                {/* Card 3 (bottom) */}
                <div 
                  className="absolute inset-0 bg-white rounded-2xl shadow-lg transform rotate-3 translate-x-2 translate-y-2 group-hover:rotate-6 group-hover:translate-x-4 group-hover:translate-y-4 transition-all duration-300 opacity-40"
                  style={{ zIndex: 1 }}
                />
                {/* Card 2 (middle) */}
                <div 
                  className="absolute inset-0 bg-white rounded-2xl shadow-lg transform -rotate-2 translate-x-1 translate-y-1 group-hover:-rotate-4 group-hover:translate-x-2 group-hover:translate-y-2 transition-all duration-300 opacity-60"
                  style={{ zIndex: 2 }}
                />
              </div>

              {/* Main card (front) */}
              <Link
                href={`/comic/${story.slug}`}
                className="relative block overflow-hidden rounded-2xl shadow-xl bg-white border border-white/20 transform transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl group-hover:-translate-y-2"
                style={{ zIndex: 10 }}
              >
                <div className={getRankStyle(index)}>
                  <span>{index + 1}</span>
                </div>
                
                <div className="relative aspect-[3/4] overflow-hidden">
                  <Image
                    src={story.thumb_url || "/placeholder-image.jpg"}
                    alt={story.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-yellow-300 transition-colors duration-300">
                    {story.name}
                  </h3>
                  <div className="flex justify-between text-sm opacity-90">
                    <span className="bg-black/20 px-2 py-1 rounded-full backdrop-blur-sm">
                      👁️ {formatNumber(story.weeklyViewCount || 0)}
                    </span>
                    <span className="bg-black/20 px-2 py-1 rounded-full backdrop-blur-sm">
                      {story.status === "completed" ? "✅ Hoàn thành" : "🔄 Đang cập nhật"}
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopWeeklyStoriesStacked;