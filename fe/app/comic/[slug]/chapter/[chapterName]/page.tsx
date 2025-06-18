// app/comic/[slug]/chapter/[chapterName]/page.tsx
import { getChapterDetail } from "@/lib/api/comic";
import ChapterReaderClient from "./ChapterReaderClient";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{
    slug: string;
    chapterName: string;
  }>;
}

export default async function ChapterPage({ params }: PageProps) {
  // Await params để lấy slug và chapterName
  const { slug, chapterName } = await params;

  // Decode URL params để tránh lỗi encoding
  const decodedSlug = decodeURIComponent(slug);
  const decodedChapterName = decodeURIComponent(chapterName);

  // Kiểm tra params
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

    // Nếu API không trả về dữ liệu hợp lệ hoặc chapter không tồn tại
    if (!response.success || !response.data || !response.data.chapter) {
      console.warn(`Chapter not found: ${decodedSlug}/${decodedChapterName}`);
      notFound();
    }

    // Trả về component reader kèm dữ liệu
    return (
      <ChapterReaderClient
        params={{ slug: decodedSlug, chapterName: decodedChapterName }}
        initialChapter={response.data}
      />
    );
  } catch (error: unknown) {
    // Nếu là lỗi 404, redirect đến notFound
    if ((error as { status?: number }).status === 404 || (error as Error).message?.includes("404")) {
      notFound();
    }

    // Đối với các lỗi khác, truyền error message
    return (
      <ChapterReaderClient
        params={{ slug: decodedSlug, chapterName: decodedChapterName }}
        initialError={(error as Error).message || "Không thể tải chapter"}
      />
    );
  }
}