import { Metadata } from "next";
import { getCategory } from "@/lib/api/comic/category";

interface CategoryLayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

// Hàm tạo metadata động dựa trên slug
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const categories = await getCategory();
  const category = categories.find((cat) => cat.slug === slug);

  if (!category) {
    return {
      title: "Thể loại truyện - SubTruyện",
      description: "Khám phá các thể loại truyện tranh đa dạng và hấp dẫn",
    };
  }

  const title = `Truyện ${category.name} - SubTruyện`;
  const description = `Khám phá các truyện thuộc thể loại ${category.name.toLowerCase()} với những câu chuyện hấp dẫn và đa dạng.`;
  const keywords = [category.slug, category.name.toLowerCase(), "truyện tranh", "manga", "comic"];

  return {
    title,
    description,
    keywords: keywords.join(", "),
    openGraph: {
      title,
      description,
      type: "website",
      siteName: "SubTruyện",
      locale: "vi_VN",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
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
      },
    },
  };
}

// Tạo static params từ API
export async function generateStaticParams() {
  const categories = await getCategory();
  return categories.map((category) => ({
    slug: category.slug,
  }));
}

export default async function CategoryLayout({ children, params }: CategoryLayoutProps) {
  const { slug } = await params;
  const categories = await getCategory();
  const category = categories.find((cat) => cat.slug === slug);

  // Không cần kiểm tra validSlugs nữa
  // if (!category) {
  //   notFound();
  // }

  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": category?.name || "Thể loại truyện",
            "description": category
              ? `Khám phá các truyện thuộc thể loại ${category.name.toLowerCase()}`
              : "Khám phá các thể loại truyện tranh",
            "url": `https://subtruyen.com/category/${slug}`,
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
                  "name": category?.name || "Thể loại",
                  "item": `https://subtruyen.com/category/${slug}`,
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