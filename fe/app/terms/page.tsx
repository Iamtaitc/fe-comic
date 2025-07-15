"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { Logo } from "@/components/common/Logo";
import Head from "next/head";

// 🎨 CSS-only animations
const styles = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fadeInLeft {
    from {
      opacity: 0;
      transform: translateX(-30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  .animate-hero {
    animation: fadeInUp 0.8s ease-out;
  }

  .animate-section {
    animation: fadeInUp 0.6s ease-out;
    animation-fill-mode: both;
  }

  .animate-section:nth-child(1) { animation-delay: 0.1s; }
  .animate-section:nth-child(2) { animation-delay: 0.2s; }
  .animate-section:nth-child(3) { animation-delay: 0.3s; }
  .animate-section:nth-child(4) { animation-delay: 0.4s; }
  .animate-section:nth-child(5) { animation-delay: 0.5s; }
  .animate-section:nth-child(6) { animation-delay: 0.6s; }

  .animate-contact {
    animation: fadeInLeft 0.8s ease-out 0.8s;
    animation-fill-mode: both;
  }

  .animate-button {
    animation: scaleIn 0.6s ease-out 1s;
    animation-fill-mode: both;
  }

  /* Respect user preferences */
  @media (prefers-reduced-motion: reduce) {
    .animate-hero,
    .animate-section,
    .animate-contact,
    .animate-button {
      animation: none;
    }
  }
`;

export default function Terms() {
  // 🏷️ SEO structured data for manga/anime website
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Điều khoản sử dụng - Sub Truyện",
    description:
      "Điều khoản sử dụng trang web đọc truyện tranh, manga, anime online miễn phí tại Sub Truyện. Đọc Naruto, One Piece và hàng ngàn bộ manga khác.",
    url: "https://subtruyen.com/terms",
    publisher: {
      "@type": "Organization",
      name: "Sub Truyện",
      url: "https://subtruyen.com",
    },
    inLanguage: "vi-VN",
    about: [
      {
        "@type": "Thing",
        name: "Manga",
      },
      {
        "@type": "Thing",
        name: "Anime",
      },
      {
        "@type": "Thing",
        name: "Truyện tranh",
      },
    ],
  };

  return (
    <>
      <Head>
        {/* 🔍 Primary SEO Meta Tags */}
        <title>
          Điều khoản sử dụng - Sub Truyện | Đọc Manga, Anime, Truyện tranh
          Online
        </title>
        <meta
          name="description"
          content="Điều khoản sử dụng Sub Truyện - Trang web đọc truyện tranh, manga, anime miễn phí. Đọc Naruto, One Piece, truyện chuyển sinh, xuyên không và hàng ngàn bộ manga khác."
        />
        <meta
          name="keywords"
          content="anime, truyện tranh, chuyển sinh, xuyên không, manga, naruto, vua hải tặc, one piece, điều khoản sử dụng, sub truyện"
        />

        {/* 🌐 Language and Region */}
        <meta name="language" content="vi-VN" />
        <link rel="canonical" href="https://subtruyen.com/terms" />
        <link
          rel="alternate"
          hrefLang="vi"
          href="https://subtruyen.com/terms"
        />

        {/* 📱 Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://subtruyen.com/terms" />
        <meta
          property="og:title"
          content="Điều khoản sử dụng - Sub Truyện | Đọc Manga Online"
        />
        <meta
          property="og:description"
          content="Điều khoản sử dụng trang đọc manga, anime miễn phí. Naruto, One Piece, truyện chuyển sinh, xuyên không."
        />
        <meta
          property="og:image"
          content="https://subtruyen.com/og-terms.jpg"
        />
        <meta property="og:site_name" content="Sub Truyện" />
        <meta property="og:locale" content="vi_VN" />

        {/* 🐦 Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://subtruyen.com/terms" />
        <meta name="twitter:title" content="Điều khoản sử dụng - Sub Truyện" />
        <meta
          name="twitter:description"
          content="Điều khoản sử dụng trang đọc manga, anime miễn phí. Naruto, One Piece, truyện chuyển sinh."
        />
        <meta
          name="twitter:image"
          content="https://subtruyen.com/og-terms.jpg"
        />

        {/* 🏷️ Article Tags */}
        <meta name="article:author" content="Sub Truyện" />
        <meta name="article:publisher" content="Sub Truyện" />
        <meta name="article:section" content="Legal" />
        <meta
          name="article:tag"
          content="anime, manga, truyện tranh, điều khoản"
        />

        {/* 🤖 Robots */}
        <meta
          name="robots"
          content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        />
        <meta name="googlebot" content="index, follow" />

        {/* 📊 Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />

        {/* 🎨 Inline Critical CSS */}
        <style dangerouslySetInnerHTML={{ __html: styles }} />
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-background to-muted">
        {/* 🦸 Hero Section */}
        <header className="relative py-20 overflow-hidden animate-hero">
          <div className="absolute inset-0 bg-[url('/luffy.jpg')] bg-cover bg-center opacity-20" />
          <div className="container relative z-10 text-center">
            <div className="flex justify-center mb-6">
              <Logo className="h-12 w-auto" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Điều khoản sử dụng Sub Truyện
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Chào mừng bạn đến với Sub Truyện! Vui lòng đọc kỹ các điều khoản
              dưới đây để hiểu rõ quyền và nghĩa vụ khi sử dụng dịch vụ đọc
              manga, anime của chúng tôi.
            </p>
          </div>
        </header>

        {/* 📋 Terms Section */}
        <main className="py-16 bg-background/80">
          <div className="container max-w-4xl mx-auto space-y-12">
            <article className="animate-section">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                1. Giới thiệu
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Điều khoản sử dụng này quy định các điều kiện áp dụng khi bạn
                truy cập và sử dụng Sub Truyện, một nền tảng đọc{" "}
                <strong>truyện tranh online</strong>, <strong>manga</strong>,{" "}
                <strong>anime</strong> miễn phí. Tại đây bạn có thể đọc{" "}
                <strong>Naruto</strong>,{" "}
                <strong>One Piece (Vua Hải Tặc)</strong>, các bộ{" "}
                <strong>truyện chuyển sinh</strong>,{" "}
                <strong>xuyên không</strong> và hàng ngàn bộ manga khác. Bằng
                cách sử dụng dịch vụ, bạn đồng ý tuân thủ các điều khoản này.
              </p>
            </article>

            <article className="animate-section">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                2. Điều kiện sử dụng
              </h2>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>
                  Sub Truyện dành cho người dùng từ 13 tuổi trở lên. Nếu bạn
                  dưới 13 tuổi, vui lòng sử dụng dịch vụ dưới sự giám sát của
                  phụ huynh.
                </li>
                <li>
                  Bạn đồng ý không sử dụng trang web cho các mục đích bất hợp
                  pháp, gây hại, hoặc làm gián đoạn hoạt động của Sub Truyện.
                </li>
                <li>
                  Chúng tôi có quyền tạm ngưng hoặc chấm dứt quyền truy cập của
                  bạn nếu bạn vi phạm các điều khoản này.
                </li>
              </ul>
            </article>

            <article className="animate-section">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                3. Nội dung và bản quyền
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Nội dung <strong>manga</strong>, <strong>anime</strong>,{" "}
                <strong>truyện tranh</strong> trên Sub Truyện được tổng hợp từ
                các nguồn API công khai. Chúng tôi không sở hữu bản quyền của
                các bộ truyện như <strong>Naruto</strong>,{" "}
                <strong>One Piece</strong>, hay các bộ{" "}
                <strong>truyện chuyển sinh</strong> khác và chỉ cung cấp nền
                tảng để người dùng truy cập. Nếu bất kỳ nội dung nào chưa được
                cấp phép, chúng tôi thành thật xin lỗi và cam kết hợp tác với
                các bên liên quan để xử lý. Vui lòng liên hệ chúng tôi qua{" "}
                <Link href="/contact" className="text-primary hover:underline">
                  trang liên hệ
                </Link>{" "}
                nếu bạn phát hiện vấn đề bản quyền.
              </p>
            </article>

            <article className="animate-section">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                4. Quảng cáo
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Để duy trì hoạt động của Sub Truyện và cung cấp miễn phí các bộ{" "}
                <strong>manga</strong>, <strong>anime</strong> chất lượng cao,
                chúng tôi có thể hiển thị quảng cáo trên trang web. Những quảng
                cáo này là nguồn lực chính giúp chúng tôi cung cấp dịch vụ miễn
                phí. Chúng tôi cam kết giữ quảng cáo ở mức không làm gián đoạn
                trải nghiệm đọc truyện của bạn.
              </p>
            </article>

            <article className="animate-section">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                5. Trách nhiệm của người dùng
              </h2>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>
                  Bạn đồng ý sử dụng Sub Truyện một cách có trách nhiệm, không
                  sao chép, phân phối, hoặc chỉnh sửa nội dung{" "}
                  <strong>manga</strong>, <strong>anime</strong> mà không có sự
                  cho phép.
                </li>
                <li>
                  Nếu bạn gặp lỗi hoặc vấn đề kỹ thuật khi đọc{" "}
                  <strong>truyện tranh</strong>, vui lòng báo cáo qua{" "}
                  <Link
                    href="/contact"
                    className="text-primary hover:underline"
                  >
                    trang liên hệ
                  </Link>{" "}
                  để chúng tôi cải thiện dịch vụ.
                </li>
                <li>
                  Không sử dụng các công cụ hoặc phương pháp để truy cập trái
                  phép, làm quá tải, hoặc gây hại cho hệ thống của Sub Truyện.
                </li>
              </ul>
            </article>

            <article className="animate-section">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                6. Thay đổi điều khoản
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Sub Truyện có quyền cập nhật hoặc sửa đổi các điều khoản này bất
                kỳ lúc nào. Mọi thay đổi sẽ được đăng tải trên trang web và có
                hiệu lực ngay khi công bố. Bạn nên kiểm tra định kỳ để cập nhật
                các thay đổi.
              </p>
            </article>
          </div>
        </main>

        {/* 📞 Contact Section */}
        <section className="py-16 bg-muted/50 animate-contact">
          <div className="container text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-semibold text-foreground mb-4">
              Liên hệ với chúng tôi
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Nếu bạn có bất kỳ câu hỏi hoặc thắc mắc nào về điều khoản sử dụng,
              hoặc cần hỗ trợ về việc đọc <strong>manga</strong>,{" "}
              <strong>anime</strong> trên Sub Truyện, hãy liên hệ với chúng tôi.
              Đội ngũ Sub Truyện luôn sẵn sàng hỗ trợ bạn!
            </p>
            <Button asChild size="lg" className="animate-button">
              <Link href="/contact">
                <Mail className="mr-2 h-4 w-4" /> Gửi liên hệ
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </>
  );
}
