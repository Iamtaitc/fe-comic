import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ReduxProvider } from "../src/store/provider"
import { Header } from "../src/components/common/Header"
import Footer from "../src/components/common/Footer"
import { TooltipProvider } from "../src/components/ui/tooltip"
import { AuthModals } from "../src/components/auth/AuthModals"
import "./globals.css"
import { AuthInitializer } from "@/components/auth/AuthInitializer"


const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SubTruyện - Đọc truyện tranh online",
  description: "Đọc truyện tranh online miễn phí với kho truyện đồ sộ và cập nhật liên tục",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={inter.className}>
        <ReduxProvider>
            <TooltipProvider>
              <AuthInitializer />
              <Header />
              <main>{children}</main>
              <Footer />
              <AuthModals />
              <AuthModals />
            </TooltipProvider>
        </ReduxProvider>
      </body>
    </html>
  )
}
