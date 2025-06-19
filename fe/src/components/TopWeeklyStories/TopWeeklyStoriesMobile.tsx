// fe/src/components/TopWeeklyStories/TopWeeklyStoriesMobile.tsx
"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import Image from "next/image";
import Link from "next/link";
import { useCallback } from "react";
import { StoryObject } from "@/lib/api/comic/types";

const TopWeeklyStoriesMobile: React.FC = () => {
  const { topWeeklyStories = [], loading, error } = useSelector(
    (state: RootState) => state.category
  );

  const formatNumber = useCallback((num: number) => {
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  }, []);

  const getRankEmoji = useCallback((index: number) => {
    return ["🥇", "🥈", "🥉"][index] || "🏆";
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center space-y-4">
          <div className="animate-bounce text-4xl">📚</div>
          <div className="text-lg text-gray-600">Đang tải...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center bg-white rounded-2xl p-8 shadow-lg">
          <div className="text-4xl mb-4">😔</div>
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-700 via-indigo-400 to-black">
      <header className="sticky top-0 z-50 bg-black/0 backdrop-blur-md px-4 py-4">
        <h1 className="text-2xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Top 10 truyện hot hôm nay
        </h1>
      </header>

      <main className="p-4 space-y-4">
        {topWeeklyStories.slice(0, 10).map((story: StoryObject, index: number) => (
          <Link
            key={story._id || story.slug || index}
            href={`/comic/${story.slug}`}
            passHref
          >
            <div className="rounded-2xl shadow-lg overflow-hidden transform transition-all duration-500 mb-2 translate-y-0 opacity-100">
              <div className="flex gap-4 p-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                  {index + 1}
                </div>
                <div className="flex-shrink-0 w-20 h-28 rounded-xl overflow-hidden shadow-md">
                  <Image
                    src={story.thumb_url || "/placeholder-image.jpg"}
                    alt={story.name}
                    width={80}
                    height={112}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-lg line-clamp-2 text-white">{story.name}</h3>
                    <span className="text-2xl ml-2 flex-shrink-0">{getRankEmoji(index)}</span>
                  </div>
                  <div className="flex gap-4 mb-3 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <span className="text-blue-500">👁</span>
                      <span>{formatNumber(story.weeklyViewCount || 0)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-red-500">❤️</span>
                      <span>{formatNumber(story.like_count || 0)}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                      {story.chapters_count || 0} chương
                    </span>
                    {story.status && (
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          story.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
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
        ))}
      </main>
    </div>
  );
};

export default TopWeeklyStoriesMobile;