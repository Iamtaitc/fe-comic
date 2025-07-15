"use client"

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookOpen, ArrowRight, Mail } from "lucide-react";
import Image from "next/image";
import Head from "next/head";

// 🎨 Enhanced CSS animations for About page
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

  @keyframes float {
    0%, 100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-10px);
    }
  }

  .animate-hero {
    animation: fadeInUp 0.8s ease-out;
  }

  .animate-mission {
    animation: scaleIn 1s ease-out 0.3s;
    animation-fill-mode: both;
  }

  .animate-feature {
    animation: fadeInUp 0.6s ease-out;
    animation-fill-mode: both;
  }

  .animate-feature:nth-child(1) { animation-delay: 0.5s; }
  .animate-feature:nth-child(2) { animation-delay: 0.7s; }
  .animate-feature:nth-child(3) { animation-delay: 0.9s; }

  .animate-notice {
    animation: fadeInLeft 0.8s ease-out 1.1s;
    animation-fill-mode: both;
  }

  .animate-thanks {
    animation: fadeInUp 0.8s ease-out 1.3s;
    animation-fill-mode: both;
  }

  .animate-button {
    animation: scaleIn 0.6s ease-out 1.5s;
    animation-fill-mode: both;
  }

  .float-icon {
    animation: float 3s ease-in-out infinite;
  }

  .hover-scale {
    transition: transform 0.3s ease;
  }

  .hover-scale:hover {
    transform: scale(1.05);
  }

  @media (prefers-reduced-motion: reduce) {
    .animate-hero,
    .animate-mission,
    .animate-feature,
    .animate-notice,
    .animate-thanks,
    .animate-button,
    .float-icon {
      animation: none;
    }
    
    .hover-scale:hover {
      transform: none;
    }
  }
`;

export default function About() {
  // 🏷️ Enhanced SEO structured data for About page
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "Giới thiệu Sub Truyện - Trang đọc Manga, Anime online",
    description: "Tìm hiểu về Sub Truyện - nền tảng đọc manga, anime, truyện tranh miễn phí. Đọc Naruto, One Piece, truyện chuyển sinh, xuyên không với trải nghiệm tuyệt vời.",
    url: "https://subtruyen.com/about",
    publisher: {
      "@type": "Organization",
      name: "Sub Truyện",
      url: "https://subtruyen.com",
      logo: "https://subtruyen.com/logo.png",
      description: "Nền tảng đọc manga, anime, truyện tranh online miễn phí"
    },
    inLanguage: "vi-VN",
    about: [
      {
        "@type": "Thing",
        name: "Manga"
      },
      {
        "@type": "Thing", 
        name: "Anime"
      },
      {
        "@type": "Thing",
        name: "Truyện tranh online"
      },
      {
        "@type": "Thing",
        name: "Naruto"
      },
      {
        "@type": "Thing",
        name: "One Piece"
      }
    ]
  };

  return (
    <>
      <Head>
        {/* 🔍 Primary SEO Meta Tags */}
        <title>Giới thiệu Sub Truyện | Đọc Manga, Anime, Truyện tranh Online Miễn phí</title>
        <meta name="description" content="Tìm hiểu về Sub Truyện - nền tảng đọc manga, anime, truyện tranh miễn phí hàng đầu. Đọc Naruto, One Piece, truyện chuyển sinh, xuyên không với kho tàng manga khổng lồ." />
        <meta name="keywords" content="giới thiệu sub truyện, anime, truyện tranh, manga, naruto, vua hải tặc, one piece, chuyển sinh, xuyên không, đọc truyện miễn phí" />
        
        {/* 🌐 Language and Region */}
        <meta name="language" content="vi-VN" />
        <link rel="canonical" href="https://subtruyen.com/about" />
        <link rel="alternate" hrefLang="vi" href="https://subtruyen.com/about" />
        
        {/* 📱 Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://subtruyen.com/about" />
        <meta property="og:title" content="Giới thiệu Sub Truyện | Nền tảng Manga, Anime hàng đầu" />
        <meta property="og:description" content="Khám phá Sub Truyện - trang đọc manga, anime miễn phí với Naruto, One Piece, truyện chuyển sinh. Trải nghiệm đọc truyện tuyệt vời!" />
        <meta property="og:image" content="https://subtruyen.com/og-about.jpg" />
        <meta property="og:site_name" content="Sub Truyện" />
        <meta property="og:locale" content="vi_VN" />
        
        {/* 🐦 Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://subtruyen.com/about" />
        <meta name="twitter:title" content="Giới thiệu Sub Truyện - Manga, Anime" />
        <meta name="twitter:description" content="Nền tảng đọc manga, anime miễn phí. Naruto, One Piece, truyện chuyển sinh và hàng ngàn bộ khác." />
        <meta name="twitter:image" content="https://subtruyen.com/og-about.jpg" />
        
        {/* 🏷️ Article Tags */}
        <meta name="article:author" content="Sub Truyện" />
        <meta name="article:publisher" content="Sub Truyện" />
        <meta name="article:section" content="About" />
        <meta name="article:tag" content="manga, anime, truyện tranh, giới thiệu, naruto, one piece" />
        
        {/* 🤖 Robots */}
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
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
        {/* 🦸 Hero Section with Thư Ngỏ */}
        <header className="relative py-20 overflow-hidden animate-hero">
          <div className="absolute inset-0 bg-[url('/luffy.jpg')] bg-cover bg-center opacity-20" />
          <div className="container relative z-10 text-center">
            <div className="flex justify-center mb-6">
              <BookOpen className="h-12 w-12 text-primary float-icon" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Thư ngỏ từ Sub Truyện
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Chào bạn, người bạn yêu <strong>manga</strong>! Sub Truyện là ngôi nhà chung cho những tâm hồn đam mê <strong>truyện tranh</strong>, <strong>anime</strong>. Từ <strong>Naruto</strong> đến <strong>One Piece</strong>, từ <strong>truyện chuyển sinh</strong> đến <strong>xuyên không</strong> - chúng tôi mong muốn mang đến những giây phút thư giãn, vui vẻ qua từng trang truyện đầy màu sắc.
            </p>
            <Button asChild size="lg" className="mt-8 group animate-button hover-scale">
              <Link href="/latest">
                Bắt đầu đọc <strong>manga</strong> ngay
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </header>

        {/* 📖 Mission Section */}
        <section className="py-16 bg-background/80">
          <div className="container grid md:grid-cols-2 gap-12 items-center">
            <div className="relative h-96 md:h-[500px] w-full max-w-sm mx-auto md:max-w-none animate-mission">
              <Image
                src="/anime.jpg"
                alt="Manga Art - Sub Truyện"
                fill
                className="object-contain rounded-lg shadow-lg hover-scale"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
            <div>
              <h2 className="text-3xl font-semibold text-foreground mb-4">Trải nghiệm tại Sub Truyện</h2>
              <p className="text-muted-foreground leading-relaxed">
                Chúng tôi luôn cố gắng mang đến trải nghiệm mượt mà nhất với kho <strong>manga</strong>, <strong>anime</strong> đa dạng và cập nhật nhanh chóng. Từ những bộ <strong>truyện tranh</strong> kinh điển như <strong>Naruto</strong>, <strong>One Piece (Vua Hải Tặc)</strong> đến các thể loại <strong>chuyển sinh</strong>, <strong>xuyên không</strong> hot nhất. Để duy trì trang web, đôi khi bạn sẽ thấy quảng cáo – đó là nguồn lực giúp Sub Truyện tiếp tục hoạt động. Nếu gặp bất kỳ lỗi nào, đừng ngần ngại liên hệ với chúng tôi qua{" "}
                <Link href="/contact" className="text-primary hover:underline">
                  trang liên hệ
                </Link>{" "}nha!
              </p>
            </div>
          </div>
        </section>

        {/* ✨ Features Section */}
        <section className="py-16 bg-background/90">
          <div className="container">
            <h2 className="text-3xl font-semibold text-center text-foreground mb-12">Điều gì làm Sub Truyện đặc biệt?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Kho manga đa dạng",
                  description: "Từ hành động gay cấn như Naruto, One Piece đến lãng mạn ngọt ngào, truyện chuyển sinh, xuyên không - tất cả đều có tại đây.",
                  icon: "📚",
                },
                {
                  title: "Cập nhật hàng ngày",
                  description: "Chương mới của manga, anime yêu thích mỗi ngày để bạn luôn theo kịp câu chuyện Naruto, One Piece và các bộ truyện hot khác.",
                  icon: "⚡",
                },
                {
                  title: "Thân thiện mọi thiết bị",
                  description: "Đọc manga, anime mượt mà trên điện thoại, máy tính bảng hay laptop. Trải nghiệm tối ưu mọi lúc mọi nơi.",
                  icon: "📱",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="bg-card p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 animate-feature hover-scale"
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 🙏 Apology Section */}
        <section className="py-16 bg-background/80 animate-notice">
          <div className="container text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-semibold text-foreground mb-4">Lời xin lỗi chân thành</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Nội dung <strong>manga</strong>, <strong>anime</strong>, <strong>truyện tranh</strong> trên Sub Truyện được tổng hợp từ nhiều nguồn API công khai. Chúng tôi luôn nỗ lực tôn trọng bản quyền và mang đến trải nghiệm tốt nhất khi bạn đọc <strong>Naruto</strong>, <strong>One Piece</strong>, <strong>truyện chuyển sinh</strong>. Nếu có bất kỳ nội dung nào chưa được cấp phép, chúng tôi thành thật xin lỗi và sẵn sàng hợp tác để xử lý.
            </p>
            <Button variant="outline" asChild className="hover-scale">
              <Link href="/contact">
                <Mail className="mr-2 h-4 w-4" /> Liên hệ ngay
              </Link>
            </Button>
          </div>
        </section>

        {/* 💝 Thank You Section */}
        <section className="py-16 bg-background/90 text-foreground animate-thanks">
          <div className="container text-center">
            <h2 className="text-3xl font-semibold mb-4">Lời cảm ơn từ Sub Truyện</h2>
            <p className="text-lg mb-8 max-w-xl mx-auto">
              Cảm ơn bạn đã đồng hành cùng Sub Truyện trong hành trình khám phá thế giới <strong>manga</strong>, <strong>anime</strong>, cảm ơn các nguồn API đã cung cấp dữ liệu <strong>truyện tranh</strong> tuyệt vời, và cảm ơn cộng đồng yêu <strong>Naruto</strong>, <strong>One Piece</strong>, <strong>truyện chuyển sinh</strong> đã luôn ủng hộ chúng tôi. Chúng tôi mong tiếp tục nhận được sự yêu thương để Sub Truyện ngày càng phát triển!
            </p>
            <Button asChild size="lg" variant="secondary" className="animate-button hover-scale">
              <Link href="/latest">Khám phá kho manga ngay</Link>
            </Button>
          </div>
        </section>
      </div>
    </>
  );
}