"use client"

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { useEffect } from "react";
import { gsap } from "gsap";
import { Logo } from "@/components/common/Logo";

export default function Terms() {
  useEffect(() => {
    // GSAP animations
    gsap.fromTo(
      ".hero-section",
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
    );
    gsap.fromTo(
      ".terms-section",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: "power2.out", delay: 0.5 }
    );
    gsap.fromTo(
      ".contact-section",
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
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden hero-section">
        <div className="absolute inset-0 bg-[url('/luffy.jpg')] bg-cover bg-center opacity-20" />
        <div className="container relative z-10 text-center">
          <div className="flex justify-center mb-6">
            <Logo className="h-12 w-auto" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Điều khoản sử dụng Sub Truyện
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Chào mừng bạn đến với Sub Truyện! Vui lòng đọc kỹ các điều khoản dưới đây để hiểu rõ quyền và nghĩa vụ khi sử dụng dịch vụ của chúng tôi.
          </p>
        </div>
      </section>

      {/* Terms Section */}
      <section className="py-16 bg-background/80">
        <div className="container max-w-4xl mx-auto space-y-12 terms-section">
          <div>
            <h2 className="text-2xl font-semibold text-foreground mb-4">1. Giới thiệu</h2>
            <p className="text-muted-foreground leading-relaxed">
              Điều khoản sử dụng này quy định các điều kiện áp dụng khi bạn truy cập và sử dụng Sub Truyện, một nền tảng đọc truyện tranh online miễn phí. Bằng cách sử dụng dịch vụ, bạn đồng ý tuân thủ các điều khoản này. Nếu bạn không đồng ý, vui lòng ngừng sử dụng trang web.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-foreground mb-4">2. Điều kiện sử dụng</h2>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Sub Truyện dành cho người dùng từ 13 tuổi trở lên. Nếu bạn dưới 13 tuổi, vui lòng sử dụng dịch vụ dưới sự giám sát của phụ huynh.</li>
              <li>Bạn đồng ý không sử dụng trang web cho các mục đích bất hợp pháp, gây hại, hoặc làm gián đoạn hoạt động của Sub Truyện.</li>
              <li>Chúng tôi có quyền tạm ngưng hoặc chấm dứt quyền truy cập của bạn nếu bạn vi phạm các điều khoản này.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-foreground mb-4">3. Nội dung và bản quyền</h2>
            <p className="text-muted-foreground leading-relaxed">
              Nội dung trên Sub Truyện được tổng hợp từ các nguồn API công khai. Chúng tôi không sở hữu bản quyền của các bộ truyện tranh và chỉ cung cấp nền tảng để người dùng truy cập. Nếu bất kỳ nội dung nào chưa được cấp phép, chúng tôi thành thật xin lỗi và cam kết hợp tác với các bên liên quan để xử lý. Vui lòng liên hệ chúng tôi qua{" "}
              <Link href="/contact" className="text-primary hover:underline">
                trang liên hệ
              </Link>{" "}nếu bạn phát hiện vấn đề bản quyền.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-foreground mb-4">4. Quảng cáo</h2>
            <p className="text-muted-foreground leading-relaxed">
              Để duy trì hoạt động của Sub Truyện, chúng tôi có thể hiển thị quảng cáo trên trang web. Những quảng cáo này là nguồn lực chính giúp chúng tôi cung cấp dịch vụ miễn phí. Chúng tôi cam kết giữ quảng cáo ở mức không làm gián đoạn trải nghiệm của bạn và cảm ơn sự thông cảm của bạn.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-foreground mb-4">5. Trách nhiệm của người dùng</h2>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Bạn đồng ý sử dụng Sub Truyện một cách có trách nhiệm, không sao chép, phân phối, hoặc chỉnh sửa nội dung mà không có sự cho phép.</li>
              <li>Nếu bạn gặp lỗi hoặc vấn đề kỹ thuật, vui lòng báo cáo qua{" "}
                <Link href="/contact" className="text-primary hover:underline">
                  trang liên hệ
                </Link>{" "}để chúng tôi cải thiện dịch vụ.</li>
              <li>Không sử dụng các công cụ hoặc phương pháp để truy cập trái phép, làm quá tải, hoặc gây hại cho hệ thống của Sub Truyện.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-foreground mb-4">6. Thay đổi điều khoản</h2>
            <p className="text-muted-foreground leading-relaxed">
              Sub Truyện có quyền cập nhật hoặc sửa đổi các điều khoản này bất kỳ lúc nào. Mọi thay đổi sẽ được đăng tải trên trang web và có hiệu lực ngay khi công bố. Bạn nên kiểm tra định kỳ để cập nhật các thay đổi.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-muted/50 contact-section">
        <div className="container text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-semibold text-foreground mb-4">Liên hệ với chúng tôi</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Nếu bạn có bất kỳ câu hỏi hoặc thắc mắc nào về điều khoản sử dụng, hãy liên hệ với chúng tôi. Đội ngũ Sub Truyện luôn sẵn sàng hỗ trợ bạn!
          </p>
          <Button asChild size="lg" className="cta-button">
            <Link href="/contact">
              <Mail className="mr-2 h-4 w-4" /> Gửi liên hệ
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}