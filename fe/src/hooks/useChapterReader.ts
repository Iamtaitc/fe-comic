import { useEffect, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchChapterDetail, setChapterDetail, resetStoryState } from "@/store/slices/storySlice";

interface UseChapterReaderProps {
  slug: string;
  chapterName: string;
  initialChapter?: any;
  initialError?: string;
}

export function useChapterReader({
  slug,
  chapterName,
  initialChapter,
  initialError,
}: UseChapterReaderProps) {
  const dispatch = useAppDispatch();
  const { chapterDetail, loading, error } = useAppSelector((state) => state.story);

  const goToNextChapter = useCallback(() => {
    if (chapterDetail?.navigation?.next?.chapter_name) {
      dispatch(fetchChapterDetail({ slug, chapterName: chapterDetail.navigation.next.chapter_name }));
    }
  }, [dispatch, slug, chapterDetail?.navigation]);

  const goToPrevChapter = useCallback(() => {
    if (chapterDetail?.navigation?.prev?.chapter_name) {
      dispatch(fetchChapterDetail({ slug, chapterName: chapterDetail.navigation.prev.chapter_name }));
    }
  }, [dispatch, slug, chapterDetail?.navigation]);

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
  }, [dispatch, slug, chapterName, initialChapter, initialError]);

  return {
    chapter: chapterDetail,
    loading,
    error,
    goToNextChapter,
    goToPrevChapter,
  };
}