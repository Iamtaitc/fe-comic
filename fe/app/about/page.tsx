"use client"
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookOpen, ArrowRight, Mail } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";
import { gsap } from "gsap";

export default function About() {
  useEffect(() => {
    // GSAP animations
    gsap.fromTo(
      ".hero-section",
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
    );
    gsap.fromTo(
      ".mission-image",
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1.2, ease: "elastic.out(1, 0.5)", delay: 0.5 }
    );
    gsap.fromTo(
      ".feature-card",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: "power2.out", delay: 1 }
    );
    gsap.fromTo(
      ".notice-section",
      { opacity: 0, x: -50 },
      { opacity: 1, x: 0, duration: 1, ease: "power3.out", delay: 1.5 }
    );
    gsap.fromTo(
      ".cta-button",
      { scale: 0.9, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1, ease: "bounce.out", delay: 2 }
    );
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Hero Section with Thư Ngỏ */}
      <section className="relative py-20 overflow-hidden hero-section">
        <div className="absolute inset-0 bg-[url('/luffy.jpg')] bg-cover bg-center opacity-20" />
        <div className="container relative z-10 text-center">
          <div className="flex justify-center mb-6">
            <BookOpen className="h-12 w-12 text-primary animate-pulse" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Thư ngỏ từ Sub Truyện
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Chào bạn, người bạn yêu manga! Sub Truyện là ngôi nhà chung cho những tâm hồn đam mê truyện tranh. Chúng tôi mong muốn mang đến những giây phút thư giãn, vui vẻ qua từng trang truyện đầy màu sắc. Hãy cùng nhau khám phá thế giới manga rực rỡ nhé!
          </p>
          <Button asChild size="lg" className="mt-8 group cta-button">
            <Link href="/latest">
              Bắt đầu đọc ngay
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-background/80">
        <div className="container grid md:grid-cols-2 gap-12 items-center">
          <div className="relative h-96 md:h-[500px] w-full max-w-sm mx-auto md:max-w-none mission-image">
            <Image
              src="/anime.jpg"
              alt="Manga Art"
              fill
              className="object-contain rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
          <div>
            <h2 className="text-3xl font-semibold text-foreground mb-4">Trải nghiệm tại Sub Truyện</h2>
            <p className="text-muted-foreground leading-relaxed">
              Chúng tôi luôn cố gắng mang đến trải nghiệm mượt mà nhất với kho truyện đa dạng và cập nhật nhanh chóng. Để duy trì trang web, đôi khi bạn sẽ thấy quảng cáo – đó là nguồn lực giúp Sub Truyện tiếp tục hoạt động. Nếu gặp bất kỳ lỗi nào, đừng ngần ngại liên hệ với chúng tôi qua{" "}
              <Link href="/contact" className="text-primary hover:underline">
                trang liên hệ
              </Link>{" "}nha!
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-background/90">
        <div className="container">
          <h2 className="text-3xl font-semibold text-center text-foreground mb-12">Điều gì làm Sub Truyện đặc biệt?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Truyện đa dạng",
                description: "Từ hành động gay cấn đến lãng mạn ngọt ngào, tất cả đều có tại đây.",
                icon: "📚",
              },
              {
                title: "Cập nhật hàng ngày",
                description: "Chương mới mỗi ngày để bạn luôn theo kịp câu chuyện yêu thích.",
                icon: "⚡",
              },
              {
                title: "Thân thiện mọi thiết bị",
                description: "Đọc truyện mượt mà trên điện thoại, máy tính bảng hay laptop.",
                icon: "📱",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-card p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 feature-card"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Apology Section */}
      <section className="py-16 bg-background/80 notice-section">
        <div className="container text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-semibold text-foreground mb-4">Lời xin lỗi chân thành</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Nội dung trên Sub Truyện được tổng hợp từ nhiều nguồn API công khai. Chúng tôi luôn nỗ lực tôn trọng bản quyền và mang đến trải nghiệm tốt nhất. Nếu có bất kỳ nội dung nào chưa được cấp phép, chúng tôi thành thật xin lỗi và sẵn sàng hợp tác để xử lý. Xin hãy thông cảm và hỗ trợ chúng tôi nhé!
          </p>
          <Button variant="outline" asChild>
            <Link href="/contact">
              <Mail className="mr-2 h-4 w-4" /> Liên hệ ngay
            </Link>
          </Button>
        </div>
      </section>

      {/* Thank You Section */}
      <section className="py-16 bg-background/90 text-foreground">
        <div className="container text-center">
          <h2 className="text-3xl font-semibold mb-4">Lời cảm ơn từ Sub Truyện</h2>
          <p className="text-lg mb-8 max-w-xl mx-auto">
            Cảm ơn bạn đã đồng hành cùng Sub Truyện, cảm ơn các nguồn API đã cung cấp dữ liệu tuyệt vời, và cảm ơn cộng đồng đã luôn ủng hộ chúng tôi. Chúng tôi mong tiếp tục nhận được sự giúp đỡ và yêu thương từ các bạn để Sub Truyện ngày càng phát triển!
          </p>
          <Button asChild size="lg" variant="secondary" className="cta-button">
            <Link href="/latest">Khám phá kho truyện ngay</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}