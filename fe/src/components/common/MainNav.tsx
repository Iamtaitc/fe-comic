// src/components/common/MainNav.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Trang chủ", href: "/" },
  { label: "Mới cập nhật", href: "/latest" },
  { label: "Thể loại", href: "/category" },
  { label: "Truyện hot", href: "/hot" },
];

export function MainNav({ className }: { className?: string }) {
  const pathname = usePathname();
  
  return (
    <nav className={cn("flex items-center gap-6", className)}>
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            pathname === item.href && "text-primary font-semibold"
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}