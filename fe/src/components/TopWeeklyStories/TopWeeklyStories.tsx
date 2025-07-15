import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { StoryObject } from "@/lib/api/comic/types";

// 🎯 Props interface
interface TopWeeklyStoriesProps {
  initialStories?: StoryObject[];
  className?: string;
}

// 🔑 Single responsive component
const TopWeeklyStories: React.FC<TopWeeklyStoriesProps> = ({
  initialStories = [],
  className = "",
}) => {
  const [stories, setStories] = useState<StoryObject[]>(initialStories);
  const [loading, setLoading] = useState(!initialStories.length);
  const [error, setError] = useState<string | null>(null);

  // 🚀 Client-side data fetching if no initial data
  useEffect(() => {
    if (!initialStories.length) {
      fetchStories();
    }
  }, [initialStories.length]);

  const fetchStories = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("🔄 Fetching top weekly stories...");

      // Dynamic import to avoid bundle size
      const { getTopWeeklyStories } = await import(
        "@/lib/api/comic/top-weekly"
      );
      const response = await getTopWeeklyStories();

      console.log(
        "✅ Successfully fetched",
        response.data.stories.length,
        "stories"
      );
      setStories(response.data.stories.slice(0, 10));
    } catch (err) {
      console.error("❌ Fetch error:", err);
      setError(err instanceof Error ? err.message : "Không thể tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  // 🎨 Helper functions
  const formatViews = (views: number): string => {
    if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M`;
    if (views >= 1_000) return `${(views / 1_000).toFixed(1)}K`;
    return views.toString();
  };

  const getRankColor = (index: number): string => {
    const colors = [
      "bg-gradient-to-r from-yellow-400 to-yellow-600", // Gold
      "bg-gradient-to-r from-gray-300 to-gray-500", // Silver
      "bg-gradient-to-r from-orange-400 to-orange-600", // Bronze
      "bg-gradient-to-r from-blue-500 to-purple-600", // Default
    ];
    return colors[index] || colors[3];
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "completed":
        return { text: "Hoàn thành", class: "bg-green-100 text-green-700" };
      case "ongoing":
        return { text: "Đang cập nhật", class: "bg-blue-100 text-blue-700" };
      default:
        return { text: "Sắp ra mắt", class: "bg-yellow-100 text-yellow-700" };
    }
  };

  // 🔄 Loading state
  if (loading) {
    return (
      <div className={`py-12 ${className}`}>
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-12">
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {Array.from({ length: 10 }, (_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-gray-200 rounded-2xl mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ❌ Error state
  if (error) {
    return (
      <div className={`py-12 ${className}`}>
        <div className="container mx-auto px-4 text-center">
          <div className="text-6xl mb-4">😔</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Không thể tải dữ liệu
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchStories}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  // 📱 Main render - Fully responsive
  return (
    <div className={`py-12  ${className}`}>
      <div className="container mx-auto px-4 max-w-7xl">
        {/* 📝 Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Top 10 truyện hot tuần này
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
        </div>

        {/* 🎴 Stories Grid - Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-6">
          {stories.map((story, index) => {
            const statusInfo = getStatusInfo(story.status);

            return (
              <Link
                key={story._id}
                href={`/comic/${story.slug}`}
                className="group block"
              >
                <div className="relative overflow-hidden rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  {/* 🏆 Rank Badge */}
                  <div
                    className={`absolute top-3 left-3 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full ${getRankColor(
                      index
                    )} flex items-center justify-center font-bold text-white shadow-lg text-sm md:text-lg`}
                  >
                    {index + 1}
                  </div>

                  {/* 🖼️ Story Image */}
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <Image
                      src={story.thumb_url}
                      alt={story.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                      priority={index < 3}
                    />

                    {/* 🌅 Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                    {/* 📊 Story Info */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 text-white">
                      <h3 className="font-bold text-sm md:text-lg mb-2 line-clamp-2 group-hover:text-yellow-300 transition-colors">
                        {story.name}
                      </h3>

                      {/* 📈 Stats */}
                      <div className="flex justify-between items-center text-xs md:text-sm mb-2">
                        <span className="flex items-center gap-1 bg-black/30 px-2 py-1 rounded-full backdrop-blur-sm">
                          👁️ {formatViews(story.weeklyViewCount ?? 0)}
                        </span>
                        {story.author?.[0] && (
                          <span className="bg-black/30 px-2 py-1 rounded-full backdrop-blur-sm truncate max-w-[100px]">
                            {story.author[0]}
                          </span>
                        )}
                      </div>

                      {/* 🏷️ Status */}
                      <div className="flex gap-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${statusInfo.class} bg-opacity-90`}
                        >
                          {statusInfo.text}
                        </span>
                        {story.category?.[0] && (
                          <span className="px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-700 bg-opacity-90 truncate max-w-[80px]">
                            {story.category[0].name}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* 📱 Mobile-optimized list view for very small screens */}
        <div className="block sm:hidden mt-8">
          <h2 className="text-xl font-bold mb-4 text-gray-800">
            Danh sách chi tiết
          </h2>
          <div className="space-y-3">
            {stories.map((story, index) => (
              <Link
                key={`mobile-${story._id}`}
                href={`/comic/${story.slug}`}
                className="flex gap-3 p-3 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  {index + 1}
                </div>
                <div className="flex-shrink-0 w-16 h-20 rounded-lg overflow-hidden">
                  <Image
                    src={story.thumb_url}
                    alt={story.name}
                    width={64}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm line-clamp-2 mb-1">
                    {story.name}
                  </h3>
                  <div className="flex gap-3 text-xs text-gray-600 mb-1">
                    <span>👁️ {formatViews(story.weeklyViewCount ?? 0)}</span>
                    <span
                      className={`px-1 rounded ${
                        getStatusInfo(story.status).class
                      }`}
                    >
                      {getStatusInfo(story.status).text}
                    </span>
                  </div>
                  {story.category?.[0] && (
                    <span className="text-xs text-purple-600">
                      {story.category[0].name}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopWeeklyStories;
