"use client"
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { useEffect } from "react";
import { gsap } from "gsap";
import { Logo } from "@/components/common/Logo";

export default function Privacy() {
  useEffect(() => {
    // GSAP animations
    gsap.fromTo(
      ".hero-section",
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
    );
    gsap.fromTo(
      ".privacy-section",
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
            Chính sách bảo mật Sub Truyện
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Tại Sub Truyện, chúng tôi cam kết bảo vệ thông tin cá nhân của bạn. Vui lòng đọc chính sách bảo mật dưới đây để hiểu cách chúng tôi thu thập, sử dụng và bảo vệ dữ liệu của bạn.
          </p>
        </div>
      </section>

      {/* Privacy Section */}
      <section className="py-16 bg-background/80">
        <div className="container max-w-4xl mx-auto space-y-12 privacy-section">
          <div>
            <h2 className="text-2xl font-semibold text-foreground mb-4">1. Giới thiệu</h2>
            <p className="text-muted-foreground leading-relaxed">
              Chính sách bảo mật này giải thích cách Sub Truyện thu thập, sử dụng, lưu trữ và bảo vệ thông tin của người dùng khi truy cập và sử dụng dịch vụ của chúng tôi. Chúng tôi cam kết tôn trọng quyền riêng tư của bạn và bảo vệ dữ liệu cá nhân theo các tiêu chuẩn cao nhất.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-foreground mb-4">2. Thông tin chúng tôi thu thập</h2>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li><strong>Thông tin tự động thu thập:</strong> Khi bạn truy cập Sub Truyện, chúng tôi có thể thu thập dữ liệu như địa chỉ IP, loại trình duyệt, thiết bị sử dụng, và các trang bạn xem thông qua cookies và công nghệ tương tự.</li>
              <li><strong>Thông tin bạn cung cấp:</strong> Nếu bạn liên hệ với chúng tôi qua biểu mẫu liên hệ hoặc email, chúng tôi có thể thu thập thông tin như tên, địa chỉ email, và nội dung tin nhắn.</li>
              <li><strong>Không thu thập thông tin nhạy cảm:</strong> Chúng tôi không yêu cầu hoặc thu thập thông tin như số thẻ tín dụng, thông tin tài khoản ngân hàng, hoặc dữ liệu cá nhân nhạy cảm khác.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-foreground mb-4">3. Cách chúng tôi sử dụng thông tin</h2>
            <p className="text-muted-foreground leading-relaxed">
              Chúng tôi sử dụng thông tin thu thập được để:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Cải thiện trải nghiệm người dùng, tối ưu hóa giao diện và hiệu suất trang web.</li>
              <li>Phân tích dữ liệu sử dụng để hiểu rõ nhu cầu và sở thích của bạn, từ đó cung cấp nội dung phù hợp hơn.</li>
              <li>Hiển thị quảng cáo phù hợp thông qua các đối tác quảng cáo bên thứ ba.</li>
              <li>Phản hồi các yêu cầu, thắc mắc, hoặc báo cáo lỗi từ bạn qua trang liên hệ.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-foreground mb-4">4. Chia sẻ thông tin</h2>
            <p className="text-muted-foreground leading-relaxed">
              Sub Truyện không bán hoặc chia sẻ thông tin cá nhân của bạn với bên thứ ba, trừ các trường hợp sau:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li><strong>Đối tác quảng cáo:</strong> Chúng tôi có thể chia sẻ dữ liệu ẩn danh (e.g., xu hướng sử dụng) với các đối tác quảng cáo để hiển thị quảng cáo phù hợp.</li>
              <li><strong>Yêu cầu pháp lý:</strong> Chúng tôi có thể tiết lộ thông tin nếu được yêu cầu bởi luật pháp hoặc cơ quan chức năng.</li>
              <li><strong>Nhà cung cấp dịch vụ:</strong> Chúng tôi có thể chia sẻ thông tin với các nhà cung cấp dịch vụ kỹ thuật (e.g., hosting, analytics) để duy trì hoạt động của trang web, nhưng họ được yêu cầu bảo mật dữ liệu.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-foreground mb-4">5. Bảo mật dữ liệu</h2>
            <p className="text-muted-foreground leading-relaxed">
              Chúng tôi áp dụng các biện pháp bảo mật kỹ thuật và tổ chức để bảo vệ thông tin của bạn khỏi truy cập trái phép, mất mát, hoặc lạm dụng. Tuy nhiên, không có hệ thống nào đảm bảo an toàn tuyệt đối, vì vậy chúng tôi khuyến khích bạn bảo vệ thông tin cá nhân của mình khi sử dụng internet.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-foreground mb-4">6. Quyền của người dùng</h2>
            <p className="text-muted-foreground leading-relaxed">
              Bạn có các quyền sau đối với thông tin cá nhân của mình:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li><strong>Truy cập:</strong> Yêu cầu xem thông tin chúng tôi lưu trữ về bạn.</li>
              <li><strong>Chỉnh sửa:</strong> Yêu cầu sửa đổi nếu thông tin không chính xác.</li>
              <li><strong>Xóa:</strong> Yêu cầu xóa dữ liệu cá nhân, trừ khi chúng tôi cần lưu trữ theo yêu cầu pháp lý.</li>
              <li><strong>Từ chối cookies:</strong> Bạn có thể tắt cookies trong trình duyệt, nhưng điều này có thể ảnh hưởng đến trải nghiệm sử dụng.</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-2">
              Để thực hiện các quyền này, vui lòng liên hệ qua{" "}
              <Link href="/contact" className="text-primary hover:underline">
                trang liên hệ
              </Link>.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-foreground mb-4">7. Thay đổi chính sách bảo mật</h2>
            <p className="text-muted-foreground leading-relaxed">
              Sub Truyện có quyền cập nhật chính sách bảo mật này bất kỳ lúc nào. Mọi thay đổi sẽ được đăng tải trên trang web và có hiệu lực ngay khi công bố. Chúng tôi khuyến khích bạn kiểm tra định kỳ để nắm bắt các cập nhật.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-muted/50 contact-section">
        <div className="container text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-semibold text-foreground mb-4">Liên hệ với chúng tôi</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Nếu bạn có thắc mắc về chính sách bảo mật hoặc cần hỗ trợ về quyền riêng tư, đội ngũ Sub Truyện luôn sẵn sàng giúp đỡ. Hãy liên hệ ngay!
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