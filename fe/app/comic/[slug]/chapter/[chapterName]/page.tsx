import { getChapterDetail } from "@/lib/api/comic/chapter";
import ChapterReaderClient from "./ChapterReaderClient";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{
    slug: string;
    chapterName: string;
  }>;
}

export default async function ChapterPage({ params }: PageProps) {
  const { slug, chapterName } = await params;

  const decodedSlug = decodeURIComponent(slug);
  const decodedChapterName = decodeURIComponent(chapterName);

  if (
    !decodedSlug ||
    !decodedChapterName ||
    decodedSlug === "undefined" ||
    decodedChapterName === "undefined"
  ) {
    notFound();
  }

  try {
    const response = await getChapterDetail(decodedSlug, decodedChapterName);

    if (!response.success || !response.data || !response.data.chapter) {
      console.warn(`Chapter not found: ${decodedSlug}/${decodedChapterName}`);
      notFound();
    }

    return (
      <ChapterReaderClient
        params={{ slug: decodedSlug, chapterName: decodedChapterName }}
        initialChapter={response.data}
      />
    );
  } catch (error: unknown) {
    if ((error as { status?: number }).status === 404 || (error as Error).message?.includes("404")) {
      notFound();
    }

    return (
      <ChapterReaderClient
        params={{ slug: decodedSlug, chapterName: decodedChapterName }}
        initialError={(error as Error).message || "Không thể tải chapter"}
      />
    );
  }
}