// app/comic/[slug]/chapter/[chapterName]/page.tsx - Compact version
import { notFound } from 'next/navigation';
import ChapterPageClient from './ChapterReaderClient';

interface ChapterPageProps {
  params: {
    slug: string;
    chapterName: string;
  };
}

// 🔧 Fetch chapter data and images
async function fetchChapterData(slug: string, chapterName: string) {
  // Step 1: Get chapter info
  const chapterResponse = await fetch(`http://localhost:3000/api/v1/comics/${slug}/chapter/${chapterName}`, {
    headers: { 'Accept': 'application/json' },
  });

  if (!chapterResponse.ok) {
    throw new Error(`Chapter API error: ${chapterResponse.status}`);
  }

  const chapterData = await chapterResponse.json();
  
  if (!chapterData.success) {
    throw new Error('Chapter not found');
  }

  const { story, chapter, navigation } = chapterData.data;

  // Step 2: Get images if API URL exists
  let images: string[] = [];
  
  if (chapter.chapter_api_data) {
    try {
      const imagesResponse = await fetch(chapter.chapter_api_data, {
        headers: { 'Accept': 'application/json' },
      });

      if (imagesResponse.ok) {
        const imagesData = await imagesResponse.json();
        
        if (imagesData.status === 'success' && imagesData.data?.item?.chapter_image) {
          const { domain_cdn, item } = imagesData.data;
          
          images = item.chapter_image
            .sort((a: any, b: any) => a.image_page - b.image_page)
            .map((img: any) => `${domain_cdn}/${item.chapter_path}/${img.image_file}`);
        }
      }
    } catch (error) {
      console.warn('Images fetch failed:', error);
    }
  }

  // Fallback to existing images
  if (images.length === 0 && chapter.chapter_image?.length > 0) {
    images = chapter.chapter_image;
  }

  return {
    success: true,
    data: {
      story,
      chapter: { ...chapter, content: images },
      navigation,
    },
  };
}

// 🚀 Main server component
export default async function ChapterPage({ params }: ChapterPageProps) {
  const { slug, chapterName } = params;

  try {
    const data = await fetchChapterData(slug, chapterName);
    
    return (
      <ChapterPageClient 
        initialData={data}
        slug={slug}
        chapterName={chapterName}
      />
    );
    
  } catch (error) {
    console.error('Page error:', error);
    
    if (error instanceof Error && error.message.includes('not found')) {
      notFound();
    }
    
    return (
      <ChapterPageClient 
        slug={slug}
        chapterName={chapterName}
        error={error instanceof Error ? error.message : 'Lỗi không xác định'}
      />
    );
  }
}