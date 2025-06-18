// src/components/common/MobileNav.tsx
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Logo } from "./Logo";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Trang chủ", href: "/" },
  { label: "Mới cập nhật", href: "/latest" },
  { label: "Thể loại", href: "/category" },
  { label: "Truyện hot", href: "/hot" },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <div className="py-4">
          <Logo className="mb-6" />
          
          <nav className="grid gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-foreground transition-all hover:bg-accent",
                  pathname === item.href && "bg-accent/50 font-medium"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
}