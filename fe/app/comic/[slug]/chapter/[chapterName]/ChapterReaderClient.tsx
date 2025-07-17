// app/comic/[slug]/chapter/[chapterName]/ChapterPageClient.tsx - Clean version
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Components
import ChapterHeader from '@/components/comic/ChapterHeader';
import ChapterContent from '@/components/comic/ChapterContent';
import ChapterInfo from '@/components/comic/ChapterInfo';
import ChapterNavigation from '@/components/comic/ChapterNavigation';
import ErrorState from '@/components/comic/ErrorState';

interface ChapterData {
  success: boolean;
  data: {
    story: {
      name: string;
      slug: string;
      thumb_url: string;
    };
    chapter: {
      chapter_name: string;
      chapter_title: string;
      content: string[];
      views: number;
      likeCount: number;
      createdAt: string;
    };
    navigation: {
      prev?: { chapter_name: string };
      next?: { chapter_name: string };
    };
  };
}

interface Props {
  initialData?: ChapterData;
  slug: string;
  chapterName: string;
  error?: string;
}

export default function ChapterPageClient({ initialData, slug, chapterName, error }: Props) {
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // 🚨 Error handling
  if (error || !initialData?.success) {
    return <ErrorState error={error || "Không có dữ liệu"} slug={slug} />;
  }

  const { story, chapter, navigation } = initialData.data;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <ChapterHeader
        slug={slug}
        comicName={story.name}
        chapterName={chapter.chapter_name}
        chapterTitle={chapter.chapter_title}
        currentImageIndex={currentImageIndex}
        totalImages={chapter.content.length}
      />

      {/* Main content */}
      <main>
        <ChapterContent 
          content={chapter.content}
          onImageInView={setCurrentImageIndex}
        />
      </main>

      {/* Chapter info */}
      <ChapterInfo
        comicName={story.name}
        chapterName={chapter.chapter_name}
        chapterTitle={chapter.chapter_title}
        views={chapter.views}
        likeCount={chapter.likeCount}
        createdAt={chapter.createdAt}
      />

      {/* Navigation */}
      <ChapterNavigation
        slug={slug}
        navigation={navigation}
        onPrevChapter={() => {
          if (navigation.prev) {
            router.push(`/comic/${slug}/chapter/${navigation.prev.chapter_name}`);
          }
        }}
        onNextChapter={() => {
          if (navigation.next) {
            router.push(`/comic/${slug}/chapter/${navigation.next.chapter_name}`);
          }
        }}
      />
    </div>
  );
}