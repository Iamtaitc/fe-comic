"use client"

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { Logo } from "@/components/common/Logo";
import Head from "next/head";

// 🎨 Shared CSS animations (same as Terms page)
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
  .animate-section:nth-child(7) { animation-delay: 0.7s; }

  .animate-contact {
    animation: fadeInLeft 0.8s ease-out 0.9s;
    animation-fill-mode: both;
  }

  .animate-button {
    animation: scaleIn 0.6s ease-out 1.1s;
    animation-fill-mode: both;
  }

  @media (prefers-reduced-motion: reduce) {
    .animate-hero,
    .animate-section,
    .animate-contact,
    .animate-button {
      animation: none;
    }
  }
`;

export default function Privacy() {
  // 🏷️ SEO structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Chính sách bảo mật - Sub Truyện",
    description: "Chính sách bảo mật trang web đọc manga, anime, truyện tranh online miễn phí. Bảo vệ thông tin người dùng khi đọc Naruto, One Piece và các bộ truyện chuyển sinh.",
    url: "https://subtruyen.com/privacy",
    publisher: {
      "@type": "Organization",
      name: "Sub Truyện",
      url: "https://subtruyen.com"
    },
    inLanguage: "vi-VN",
    about: [
      {
        "@type": "Thing",
        name: "Bảo mật dữ liệu"
      },
      {
        "@type": "Thing", 
        name: "Quyền riêng tư"
      },
      {
        "@type": "Thing",
        name: "Manga website"
      }
    ]
  };

  return (
    <>
      <Head>
        {/* 🔍 Primary SEO Meta Tags */}
        <title>Chính sách bảo mật - Sub Truyện | Manga, Anime, Truyện tranh Online</title>
        <meta name="description" content="Chính sách bảo mật Sub Truyện - Cam kết bảo vệ thông tin cá nhân khi đọc manga, anime miễn phí. Naruto, One Piece, truyện chuyển sinh, xuyên không an toàn." />
        <meta name="keywords" content="chính sách bảo mật, anime, truyện tranh, manga, naruto, vua hải tặc, one piece, chuyển sinh, xuyên không, quyền riêng tư" />
        
        {/* 🌐 Language and Region */}
        <meta name="language" content="vi-VN" />
        <link rel="canonical" href="https://subtruyen.com/privacy" />
        <link rel="alternate" hrefLang="vi" href="https://subtruyen.com/privacy" />
        
        {/* 📱 Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://subtruyen.com/privacy" />
        <meta property="og:title" content="Chính sách bảo mật - Sub Truyện | Đọc Manga An toàn" />
        <meta property="og:description" content="Chính sách bảo mật trang đọc manga, anime miễn phí. Bảo vệ thông tin khi đọc Naruto, One Piece, truyện chuyển sinh." />
        <meta property="og:image" content="https://subtruyen.com/og-privacy.jpg" />
        <meta property="og:site_name" content="Sub Truyện" />
        <meta property="og:locale" content="vi_VN" />
        
        {/* 🐦 Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://subtruyen.com/privacy" />
        <meta name="twitter:title" content="Chính sách bảo mật - Sub Truyện" />
        <meta name="twitter:description" content="Cam kết bảo vệ thông tin cá nhân khi đọc manga, anime miễn phí. An toàn tuyệt đối." />
        <meta name="twitter:image" content="https://subtruyen.com/og-privacy.jpg" />
        
        {/* 🏷️ Article Tags */}
        <meta name="article:author" content="Sub Truyện" />
        <meta name="article:publisher" content="Sub Truyện" />
        <meta name="article:section" content="Privacy" />
        <meta name="article:tag" content="bảo mật, quyền riêng tư, manga, anime" />
        
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
        {/* 🦸 Hero Section */}
        <header className="relative py-20 overflow-hidden animate-hero">
          <div className="absolute inset-0 bg-[url('/luffy.jpg')] bg-cover bg-center opacity-20" />
          <div className="container relative z-10 text-center">
            <div className="flex justify-center mb-6">
              <Logo className="h-12 w-auto" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Chính sách bảo mật Sub Truyện
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Tại Sub Truyện, chúng tôi cam kết bảo vệ thông tin cá nhân của bạn khi đọc <strong>manga</strong>, <strong>anime</strong>. Vui lòng đọc chính sách bảo mật dưới đây để hiểu cách chúng tôi thu thập, sử dụng và bảo vệ dữ liệu của bạn.
            </p>
          </div>
        </header>

        {/* 🔒 Privacy Section */}
        <main className="py-16 bg-background/80">
          <div className="container max-w-4xl mx-auto space-y-12">
            
            <article className="animate-section">
              <h2 className="text-2xl font-semibold text-foreground mb-4">1. Giới thiệu</h2>
              <p className="text-muted-foreground leading-relaxed">
                Chính sách bảo mật này giải thích cách Sub Truyện thu thập, sử dụng, lưu trữ và bảo vệ thông tin của người dùng khi truy cập và đọc <strong>manga</strong>, <strong>anime</strong>, <strong>truyện tranh</strong> trên dịch vụ của chúng tôi. Chúng tôi cam kết tôn trọng quyền riêng tư của bạn và bảo vệ dữ liệu cá nhân theo các tiêu chuẩn cao nhất khi bạn thưởng thức <strong>Naruto</strong>, <strong>One Piece</strong>, hay các bộ <strong>truyện chuyển sinh</strong>.
              </p>
            </article>

            <article className="animate-section">
              <h2 className="text-2xl font-semibold text-foreground mb-4">2. Thông tin chúng tôi thu thập</h2>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li><strong>Thông tin tự động thu thập:</strong> Khi bạn đọc <strong>manga</strong>, <strong>anime</strong> trên Sub Truyện, chúng tôi có thể thu thập dữ liệu như địa chỉ IP, loại trình duyệt, thiết bị sử dụng, và các trang bạn xem thông qua cookies và công nghệ tương tự.</li>
                <li><strong>Thông tin bạn cung cấp:</strong> Nếu bạn liên hệ với chúng tôi về các vấn đề <strong>truyện tranh</strong> qua biểu mẫu liên hệ hoặc email, chúng tôi có thể thu thập thông tin như tên, địa chỉ email, và nội dung tin nhắn.</li>
                <li><strong>Không thu thập thông tin nhạy cảm:</strong> Chúng tôi không yêu cầu hoặc thu thập thông tin như số thẻ tín dụng, thông tin tài khoản ngân hàng, hoặc dữ liệu cá nhân nhạy cảm khác khi bạn đọc <strong>truyện chuyển sinh</strong> hay <strong>xuyên không</strong>.</li>
              </ul>
            </article>

            <article className="animate-section">
              <h2 className="text-2xl font-semibold text-foreground mb-4">3. Cách chúng tôi sử dụng thông tin</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Chúng tôi sử dụng thông tin thu thập được để cải thiện trải nghiệm đọc <strong>manga</strong>, <strong>anime</strong> của bạn:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Cải thiện trải nghiệm người dùng, tối ưu hóa giao diện và hiệu suất trang web khi đọc <strong>Naruto</strong>, <strong>One Piece</strong>.</li>
                <li>Phân tích dữ liệu sử dụng để hiểu rõ sở thích về <strong>truyện tranh</strong>, <strong>manga</strong> của bạn, từ đó gợi ý nội dung phù hợp hơn.</li>
                <li>Hiển thị quảng cáo phù hợp với sở thích đọc <strong>truyện chuyển sinh</strong>, <strong>xuyên không</strong> thông qua các đối tác quảng cáo bên thứ ba.</li>
                <li>Phản hồi các yêu cầu, thắc mắc, hoặc báo cáo lỗi từ bạn qua trang liên hệ.</li>
              </ul>
            </article>

            <article className="animate-section">
              <h2 className="text-2xl font-semibold text-foreground mb-4">4. Chia sẻ thông tin</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Sub Truyện không bán hoặc chia sẻ thông tin cá nhân của bạn với bên thứ ba, trừ các trường hợp sau:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li><strong>Đối tác quảng cáo:</strong> Chúng tôi có thể chia sẻ dữ liệu ẩn danh về xu hướng đọc <strong>manga</strong>, <strong>anime</strong> với các đối tác quảng cáo để hiển thị quảng cáo phù hợp.</li>
                <li><strong>Yêu cầu pháp lý:</strong> Chúng tôi có thể tiết lộ thông tin nếu được yêu cầu bởi luật pháp hoặc cơ quan chức năng.</li>
                <li><strong>Nhà cung cấp dịch vụ:</strong> Chúng tôi có thể chia sẻ thông tin với các nhà cung cấp dịch vụ kỹ thuật (hosting, analytics) để duy trì hoạt động của trang đọc <strong>truyện tranh</strong>, nhưng họ được yêu cầu bảo mật dữ liệu.</li>
              </ul>
            </article>

            <article className="animate-section">
              <h2 className="text-2xl font-semibold text-foreground mb-4">5. Bảo mật dữ liệu</h2>
              <p className="text-muted-foreground leading-relaxed">
                Chúng tôi áp dụng các biện pháp bảo mật kỹ thuật và tổ chức để bảo vệ thông tin của bạn khỏi truy cập trái phép, mất mát, hoặc lạm dụng khi sử dụng dịch vụ đọc <strong>manga</strong>, <strong>anime</strong>. Tuy nhiên, không có hệ thống nào đảm bảo an toàn tuyệt đối, vì vậy chúng tôi khuyến khích bạn bảo vệ thông tin cá nhân của mình khi sử dụng internet.
              </p>
            </article>

            <article className="animate-section">
              <h2 className="text-2xl font-semibold text-foreground mb-4">6. Quyền của người dùng</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Bạn có các quyền sau đối với thông tin cá nhân của mình khi sử dụng Sub Truyện:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li><strong>Truy cập:</strong> Yêu cầu xem thông tin chúng tôi lưu trữ về hoạt động đọc <strong>truyện tranh</strong> của bạn.</li>
                <li><strong>Chỉnh sửa:</strong> Yêu cầu sửa đổi nếu thông tin không chính xác.</li>
                <li><strong>Xóa:</strong> Yêu cầu xóa dữ liệu cá nhân, trừ khi chúng tôi cần lưu trữ theo yêu cầu pháp lý.</li>
                <li><strong>Từ chối cookies:</strong> Bạn có thể tắt cookies trong trình duyệt, nhưng điều này có thể ảnh hưởng đến trải nghiệm đọc <strong>manga</strong>, <strong>anime</strong>.</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Để thực hiện các quyền này, vui lòng liên hệ qua{" "}
                <Link href="/contact" className="text-primary hover:underline">
                  trang liên hệ
                </Link>.
              </p>
            </article>

            <article className="animate-section">
              <h2 className="text-2xl font-semibold text-foreground mb-4">7. Thay đổi chính sách bảo mật</h2>
              <p className="text-muted-foreground leading-relaxed">
                Sub Truyện có quyền cập nhật chính sách bảo mật này bất kỳ lúc nào. Mọi thay đổi sẽ được đăng tải trên trang web và có hiệu lực ngay khi công bố. Chúng tôi khuyến khích bạn kiểm tra định kỳ để nắm bắt các cập nhật liên quan đến việc bảo vệ thông tin khi đọc <strong>manga</strong>, <strong>anime</strong>.
              </p>
            </article>
          </div>
        </main>

        {/* 📞 Contact Section */}
        <section className="py-16 bg-muted/50 animate-contact">
          <div className="container text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-semibold text-foreground mb-4">Liên hệ với chúng tôi</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Nếu bạn có thắc mắc về chính sách bảo mật hoặc cần hỗ trợ về quyền riêng tư khi đọc <strong>manga</strong>, <strong>anime</strong>, <strong>Naruto</strong>, <strong>One Piece</strong>, đội ngũ Sub Truyện luôn sẵn sàng giúp đỡ. Hãy liên hệ ngay!
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