"use client";

import { useEffect } from "react";
import { useChapterReader } from "@/hooks/useChapterReader";
import { useImageObserver } from "@/hooks/useImageObserver";
import ChapterHeader from "@/components/comic/ChapterHeader";
import ChapterContent from "@/components/comic/ChapterContent";
import ChapterNavigation from "@/components/comic/ChapterNavigation";
import ChapterInfo from "@/components/comic/ChapterInfo";
import ErrorState from "@/components/comic/ErrorState";
import LoadingState from "@/components/comic/LoadingState";

interface ChapterReaderClientProps {
  params: { 
    slug: string; 
    chapterName: string; 
  };
  initialChapter?: any;
  initialError?: string;
}

export default function ChapterReaderClient({ 
  params, 
  initialChapter, 
  initialError 
}: ChapterReaderClientProps) {
  const { slug, chapterName } = params;
  
  const {
    chapter,
    loading,
    error,
    goToNextChapter,
    goToPrevChapter
  } = useChapterReader({ slug, chapterName, initialChapter, initialError });

  const { currentImageIndex, setCurrentImageIndex } = useImageObserver(
    chapter?.chapter?.content?.length || 0
  );

  useEffect(() => {
    window.scrollTo(0, 0);
    setCurrentImageIndex(0);
  }, [slug, chapterName, setCurrentImageIndex]);

  if ((loading && !chapter) || (!initialChapter && !error && !initialError)) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} slug={slug} />;
  }

  if (!chapter?.chapter) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-white text-center">
          <p>Không tìm thấy chapter</p>
        </div>
      </div>
    );
  }

  const { chapter: chapterData, navigation } = chapter;

  return (
    <div className="min-h-screen bg-black text-white">
      <ChapterHeader
        slug={slug}
        comicName={chapterData.comic_name}
        chapterName={chapterData.chapter_name}
        chapterTitle={chapterData.chapter_title}
        currentImageIndex={currentImageIndex}
        totalImages={chapterData.content?.length || 0}
      />

      <ChapterContent content={chapterData.content || []} />

      <ChapterNavigation
        slug={slug}
        navigation={navigation}
        onPrevChapter={goToPrevChapter}
        onNextChapter={goToNextChapter}
      />

      <ChapterInfo
        comicName={chapterData.comic_name}
        chapterName={chapterData.chapter_name}
        chapterTitle={chapterData.chapter_title}
        views={chapterData.views}
        likeCount={chapterData.likeCount}
        createdAt={chapterData.createdAt}
      />
    </div>
  );
}