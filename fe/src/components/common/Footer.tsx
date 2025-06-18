//fe\src\components\common\Footer.tsx
"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Facebook, Mail, Youtube } from "lucide-react";
import { FaTiktok } from "react-icons/fa";
import { Logo } from "./Logo";
import { gsap } from "gsap";

export default function Footer() {
  useEffect(() => {
    // GSAP animations
    gsap.fromTo(
      ".footer-section",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
    );
    gsap.fromTo(
      ".footer-column",
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.2, ease: "power2.out", delay: 0.3 }
    );
    gsap.fromTo(
      ".social-link",
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 0.5, stagger: 0.1, ease: "bounce.out", delay: 0.8 }
    );
  }, []);

  return (
    <footer className="w-full border-t bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 footer-section">
      <div className="container grid gap-8 sm:grid-cols-2 lg:grid-cols-4 footer-columns">
        {/* Logo and About */}
        <div className="flex flex-col gap-4 footer-column">
          <Logo className="h-8 w-auto" />
          <p className="text-sm text-muted-foreground">
            Đọc truyện tranh online miễn phí với kho truyện đồ sộ và cập nhật liên tục.
          </p>
          <p className="text-sm text-muted-foreground">
            Cảm ơn các nguồn API cung cấp dữ liệu. Chúng tôi xin lỗi nếu có bất kỳ nội dung nào chưa được cấp phép.
          </p>
          <div className="flex gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full social-link hover:bg-red-300 hover:text-red-500"
              asChild
            >
              <Link href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full social-link hover:bg-red-300 hover:text-red-500"
              asChild
            >
              <Link href="mailto:contact@subtruyen.vn" target="_blank">
                <Mail className="h-5 w-5" />
                <span className="sr-only">Gmail</span>
              </Link>
            </Button>
            <Button
              asChild
              size="sm"
              className="rounded-full hover:bg-red-300 hover:text-red-500"
            >
              <Link href="https://www.tiktok.com" target="_blank" rel="noopener noreferrer">
                <span className="h-5 w-5 flex items-center justify-center">
                  <FaTiktok />
                </span>
                <span className="sr-only">TikTok</span>
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full social-link hover:bg-red-300 hover:text-red-500"
              asChild
            >
              <Link href="https://www.youtube.com" target="_blank" rel="noopener noreferrer">
                <Youtube className="h-5 w-5" />
                <span className="sr-only">YouTube</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Navigation - Khám phá */}
        <div className="footer-column">
          <h3 className="mb-4 text-lg font-semibold">Khám phá</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/latest" className="text-muted-foreground hover:text-foreground transition-colors">
                Truyện mới cập nhật
              </Link>
            </li>
            <li>
              <Link href="/hot" className="text-muted-foreground hover:text-foreground transition-colors">
                Truyện hot
              </Link>
            </li>
            <li>
              <Link href="/completed" className="text-muted-foreground hover:text-foreground transition-colors">
                Truyện hoàn thành
              </Link>
            </li>
            <li>
              <Link href="/category" className="text-muted-foreground hover:text-foreground transition-colors">
                Thể loại
              </Link>
            </li>
          </ul>
        </div>

        {/* Navigation - Liên kết */}
        <div className="footer-column">
          <h3 className="mb-4 text-lg font-semibold">Liên kết</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                Giới thiệu
              </Link>
            </li>
            <li>
              <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                Điều khoản sử dụng
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                Chính sách bảo mật
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                Liên hệ
              </Link>
            </li>
          </ul>
        </div>

        {/* App Download */}
        <div className="footer-column">
          <h3 className="mb-4 text-lg font-semibold">Tải ứng dụng</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Tải ứng dụng để có trải nghiệm tốt nhất trên điện thoại
          </p>
          <div className="flex flex-col gap-2">
            <Button variant="outline" className="w-full justify-start gap-2 hover:bg-accent">
              <svg viewBox="0 0 24 24" className="h-5 w-5">
                <path
                  fill="currentColor"
                  d="M19.665 16.811a10.316 10.316 0 0 1-1.021 1.837c-.537.767-.978 1.297-1.316 1.592-.525.482-1.089.73-1.692.744-.432 0-.954-.123-1.562-.373-.61-.249-1.17-.371-1.683-.371-.537 0-1.113.122-1.73.371-.616.25-1.114.381-1.495.393-.577.019-1.155-.231-1.731-.752-.367-.32-.826-.87-1.377-1.648-.59-.829-1.075-1.794-1.455-2.891-.407-1.187-.611-2.335-.611-3.447 0-1.273.275-2.372.823-3.292a4.857 4.857 0 0 1 1.73-1.751 4.65 4.65 0 0 1 2.348-.662c.46 0 1.063.142 1.81.422s1.227.422 1.436.422c.158 0 .689-.167 1.593-.498.853-.307 1.573-.434 2.163-.384 1.6.129 2.801.759 3.6 1.895-1.43.867-2.137 2.08-2.123 3.637.012 1.213.453 2.222 1.317 3.023a4.33 4.33 0 0 0 1.315.863c-.106.307-.218.6-.333.882zM15.998 2.38c0 .95-.348 1.838-1.039 2.659-.836.976-1.846 1.541-2.941 1.452a2.955 2.955 0 0 1-.021-.36c0-.913.396-1.889 1.103-2.688.352-.404.8-.741 1.343-1.009.542-.264 1.054-.41 1.536-.435.013.128.019.255.019.381z"
                />
              </svg>
              <span>App Store</span>
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2 hover:bg-accent">
              <svg viewBox="0 0 24 24" className="h-5 w-5">
                <path
                  fill="currentColor"
                  d="M5.257 2.066c.701 0 1.418.253 1.98.729l.009.009-9.354 9.355a2.529 2.529 0 0 1-.715-1.762L19.799 12l-2.6 2.6.022.008A2.529 2.529 0 0 1 16.466 19l-9.372-9.373-.002.001a2.529 2.529 0 0 1 .434-3.993l-.002-.002a2.529 2.529 0 0 1 3.732.433zm15.015 8.334a1.632 1.632 0 0 1 1.595 1.306l.005.082v.426a1.632 1.632 0 0 1-1.432 1.619l-.168.013h-.8v1.8h-2.4v-4.8h3.2zm-4.8 0a1.632 1.632 0 0 1 1.595 1.306l.005.082v.426a1.632 1.632 0 0 1-1.432 1.619l-.168.013h-.8v1.8h-2.4v-4.8h3.2z"
                />
              </svg>
              <span>Google Play</span>
            </Button>
          </div>
        </div>
      </div>
      <div className="container mt-8 border-t pt-8">
        <p className="text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Sub Truyện. Tất cả quyền được bảo lưu.
        </p>
      </div>
    </footer>
  );
}