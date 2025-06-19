// fe/src/components/TopWeeklyStoriesResponsive.tsx
import { GetServerSideProps } from "next";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { setTopWeeklyStories } from "@/store/slices/categorySlice";
import { StoryObject } from "@/lib/api/comic/types";
import { getTopWeeklyStories } from "@/lib/api/comic/top-weekly";
import TopWeeklyStories from "./TopWeeklyStories";
import TopWeeklyStoriesEnhanced from "./TopWeeklyStoriesEnhanced";
import TopWeeklyStoriesMobile from "./TopWeeklyStoriesMobile";

interface TopWeeklyStoriesResponsiveProps {
  stories: StoryObject[];
  deviceType: "mobile" | "tablet" | "desktop";
  error?: string;
}

const TopWeeklyStoriesResponsive: React.FC<TopWeeklyStoriesResponsiveProps> = ({
  stories,
  deviceType,
  error,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isMobile, setIsMobile] = useState(deviceType === "mobile");
  const [isTablet, setIsTablet] = useState(deviceType === "tablet");
  const [mounted, setMounted] = useState(false);

  // Sync server-fetched data with Redux and handle client-side device detection
  useEffect(() => {
    dispatch(setTopWeeklyStories(stories));
    setMounted(true);

    const checkDevice = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);

    return () => window.removeEventListener("resize", checkDevice);
  }, [dispatch, stories]);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <p className="text-xl text-red-500 mb-4">Oops! Có lỗi xảy ra</p>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (isMobile) {
    return <TopWeeklyStoriesMobile />;
  }
  if (isTablet) {
    return <TopWeeklyStories />;
  }
  return <TopWeeklyStoriesEnhanced />;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    // Fetch top weekly stories using the provided API
    const response = await getTopWeeklyStories();

    if (!response.success || !Array.isArray(response.data.stories)) {
      return {
        props: {
          stories: [],
          deviceType: parseUserAgent(context.req.headers["user-agent"] || ""),
          error: "Dữ liệu top truyện tuần không hợp lệ",
        },
      };
    }

    const stories = response.data.stories;
    const deviceType = parseUserAgent(context.req.headers["user-agent"] || "");

    return {
      props: {
        stories,
        deviceType,
      },
    };
  } catch (error) {
    console.error("Error fetching top weekly stories:", error);
    return {
      props: {
        stories: [],
        deviceType: parseUserAgent(context.req.headers["user-agent"] || ""),
        error: error instanceof Error ? error.message : "Không thể tải top truyện tuần",
      },
    };
  }
};

// Utility to parse user-agent for device detection
const parseUserAgent = (userAgent: string): "mobile" | "tablet" | "desktop" => {
  const isMobile = /Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  const isTablet = /Tablet|iPad|PlayBook|Silk|Kindle|Nexus 7|Nexus 10/i.test(userAgent);

  if (isTablet) return "tablet";
  if (isMobile) return "mobile";
  return "desktop";
};

export default TopWeeklyStoriesResponsive;