// hooks/useChapterReader.ts
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchChapterDetail, resetStoryState, setChapterDetail } from "@/store/slices/storySlice";

interface UseChapterReaderProps {
  slug: string;
  chapterName: string;
  initialChapter?: any;
  initialError?: string;
}

export const useChapterReader = ({ 
  slug, 
  chapterName, 
  initialChapter, 
  initialError 
}: UseChapterReaderProps) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { chapterDetail, loading, error } = useAppSelector((state) => state.story);

  // Initialize data
  useEffect(() => {
    if (initialChapter) {
      dispatch(setChapterDetail(initialChapter));
    } else if (initialError) {
      dispatch({ type: 'story/setError', payload: initialError });
    } else if (slug && chapterName) {
      dispatch(fetchChapterDetail({ slug, chapterName }));
    }

    return () => {
      dispatch(resetStoryState());
    };
  }, [slug, chapterName, dispatch, initialChapter, initialError]);

  const chapter = chapterDetail || initialChapter;

  // Navigation handlers
  const goToNextChapter = useCallback(() => {
    if (!slug || !chapter?.navigation?.next) return;
    router.push(`/comic/${slug}/chapter/${chapter.navigation.next.chapter_name}`);
  }, [slug, chapter?.navigation?.next, router]);

  const goToPrevChapter = useCallback(() => {
    if (!slug || !chapter?.navigation?.prev) return;
    router.push(`/comic/${slug}/chapter/${chapter.navigation.prev.chapter_name}`);
  }, [slug, chapter?.navigation?.prev, router]);

  return {
    chapter,
    loading,
    error: error || initialError,
    goToNextChapter,
    goToPrevChapter
  };
};