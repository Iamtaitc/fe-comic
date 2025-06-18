import { Metadata } from "next";
import { notFound } from "next/navigation";

interface StoriesLayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

// Metadata cho SEO
const storiesMetadata: Record<string, { title: string; description: string; keywords: string[] }> = {
  all: {
    title: "Truyện Nổi Bật - SubTruyện",
    description: "Khám phá những bộ truyện nổi bật nhất, được yêu thích bởi hàng triệu độc giả trên SubTruyện.",
    keywords: ["truyện nổi bật", "truyện tranh", "manga", "comic", "popular"],
  },
  ongoing: {
    title: "Truyện Đang Phát Hành - SubTruyện",
    description: "Theo dõi các bộ truyện đang phát hành với những chương mới nhất được cập nhật liên tục.",
    keywords: ["truyện đang phát hành", "ongoing", "truyện tranh", "manga"],
  },
  completed: {
    title: "Truyện Đã Hoàn Thành - SubTruyện",
    description: "Thưởng thức những bộ truyện đã hoàn thành với cốt truyện trọn vẹn và hấp dẫn.",
    keywords: ["truyện hoàn thành", "completed", "truyện tranh", "manga"],
  },
  upcoming: {
    title: "Truyện Sắp Ra Mắt - SubTruyện",
    description: "Đón chờ những bộ truyện sắp ra mắt với những câu chuyện đầy hứa hẹn.",
    keywords: ["truyện sắp ra mắt", "upcoming", "truyện tranh", "manga"],
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const meta = storiesMetadata[slug];

  if (!meta) {
    return {
      title: "Danh mục truyện - SubTruyện",
      description: "Khám phá các danh mục truyện tranh đa dạng và hấp dẫn.",
    };
  }

  return {
    title: meta.title,
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
      canonical: `/stories/${slug}`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-snippet": -1,
        "max-image-preview": "large",
      },
    },
  };
}

// Validate slug và generate static params
export async function generateStaticParams() {
  return [
    { slug: "all" },
    { slug: "ongoing" },
    { slug: "completed" },
    { slug: "upcoming" },
  ];
}

export default async function StoriesLayout({ children, params }: StoriesLayoutProps) {
  const { slug } = await params;
  const validSlugs = ["all", "ongoing", "completed", "upcoming"];

  // Validate slug
  if (!validSlugs.includes(slug)) {
    notFound();
  }

  return (
    <>
      {/* Structured Data cho SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": storiesMetadata[slug]?.title || "Danh mục truyện",
            "description": storiesMetadata[slug]?.description || "Khám phá các danh mục truyện tranh",
            "url": `https://subtruyen.com/stories/${slug}`,
            "isPartOf": {
              "@type": "WebSite",
              "name": "SubTruyện",
              "url": "https://subtruyen.com",
            },
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Trang chủ",
                  "item": "https://subtruyen.com",
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": storiesMetadata[slug]?.title || "Danh mục",
                  "item": `https://subtruyen.com/stories/${slug}`,
                },
              ],
            },
          }),
        }}
      />
      {children}
    </>
  );
}