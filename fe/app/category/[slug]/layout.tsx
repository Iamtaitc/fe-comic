// app/category/[slug]/layout.tsx
import { Metadata } from "next";
import { notFound } from "next/navigation";

interface CategoryLayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

// Metadata for SEO optimization
const categoryMetadata: Record<string, { title: string; description: string; keywords: string[] }> = {
  "xuyen-khong": {
    title: "Truyện Xuyên Không - Du Hành Qua Không Gian Thời Gian",
    description: "Đọc truyện xuyên không hay nhất, các câu chuyện về du hành qua không gian và thời gian đầy kịch tính và hấp dẫn.",
    keywords: ["xuyên không", "du hành thời gian", "truyện tranh", "manga", "comic"]
  },
  "chuyen-sinh": {
    title: "Truyện Chuyển Sinh - Tái Sinh Trong Thế Giới Mới", 
    description: "Khám phá các câu chuyện chuyển sinh độc đáo, hành trình tái sinh và chinh phục thế giới mới với sức mạnh kiếp trước.",
    keywords: ["chuyển sinh", "tái sinh", "isekai", "truyện tranh", "manga"]
  },
  "manga": {
    title: "Manga - Truyện Tranh Nhật Bản Hay Nhất",
    description: "Bộ sưu tập manga Nhật Bản đa dạng thể loại: hành động, lãng mạn, kinh dị, siêu nhiên. Cập nhật liên tục.",
    keywords: ["manga", "truyện tranh nhật bản", "comic", "anime", "japanese manga"]
  },
  "16": {
    title: "Truyện 16+ - Nội Dung Dành Cho Người Trưởng Thành",
    description: "Truyện tranh 16+ với nội dung sâu sắc dành cho độc giả trưởng thành, khám phá các chủ đề phức tạp về tình yêu và cuộc sống.",
    keywords: ["truyện 16+", "mature", "adult", "romance", "drama"]
  }
};

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}): Promise<Metadata> {
  const { slug } = await params;
  const meta = categoryMetadata[slug];
  
  if (!meta) {
    return {
      title: "Thể loại truyện - SubTruyện",
      description: "Khám phá các thể loại truyện tranh đa dạng và hấp dẫn"
    };
  }

  return {
    title: `${meta.title} | SubTruyện`,
    description: meta.description,
    keywords: meta.keywords.join(", "),
    openGraph: {
      title: meta.title,
      description: meta.description,
      type: "website",
      siteName: "SubTruyện",
      locale: "vi_VN",
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
    },
    alternates: {
      canonical: `/category/${slug}`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-snippet": -1,
        "max-image-preview": "large",
      }
    }
  };
}

// Validate slug and generate static params for known categories
export async function generateStaticParams() {
  return [
    { slug: "xuyen-khong" },
    { slug: "chuyen-sinh" },
    { slug: "manga" },
    { slug: "16" },
  ];
}

export default async function CategoryLayout({ children, params }: CategoryLayoutProps) {
  const { slug } = await params;
  const validSlugs = ["xuyen-khong", "chuyen-sinh", "manga", "16"];
  
  // Validate slug - redirect to 404 if invalid
  if (!validSlugs.includes(slug)) {
    notFound();
  }

  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": categoryMetadata[slug]?.title || "Thể loại truyện",
            "description": categoryMetadata[slug]?.description || "Khám phá các thể loại truyện tranh",
            "url": `https://subtruyen.com/category/${slug}`,
            "isPartOf": {
              "@type": "WebSite",
              "name": "SubTruyện", 
              "url": "https://subtruyen.com"
            },
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Trang chủ",
                  "item": "https://subtruyen.com"
                },
                {
                  "@type": "ListItem", 
                  "position": 2,
                  "name": categoryMetadata[slug]?.title || "Thể loại",
                  "item": `https://subtruyen.com/category/${slug}`
                }
              ]
            }
          })
        }}
      />
      {children}
    </>
  );
}

