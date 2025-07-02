// app/layout.tsx - Integrated with existing structure
import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ReduxProvider } from "../src/store/provider"
import { Header } from "../src/components/common/Header"
import Footer from "../src/components/common/Footer"
import { TooltipProvider } from "../src/components/ui/tooltip"
import { AuthModals } from "../src/components/auth/AuthModals"
import { AuthInitializer } from "@/components/auth/AuthInitializer"
import { AppWrapper } from "@/components/AppWrapper"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SubTruyện - Đọc truyện tranh online",
  description: "Đọc truyện tranh online miễn phí với kho truyện đồ sộ và cập nhật liên tục",
  keywords: "truyện tranh, manga, anime, chuyển sinh, đọc truyện online, SubTruyện",
  authors: [{ name: "SubTruyện Team" }],
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#3b82f6",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#3b82f6" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <ReduxProvider>
          <TooltipProvider>
            <AppWrapper>
              {/* 🔑 Auth & App Initialization */}
              <AuthInitializer />
              
              {/* 🎨 App Layout Structure */}
              <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1">
                  {children}
                </main>
                <Footer />
              </div>
              
              {/* 🔧 Modals & Overlays */}
              <AuthModals />
            </AppWrapper>
          </TooltipProvider>
        </ReduxProvider>
        
        {/* 📊 Development Performance Monitoring */}
        {process.env.NODE_ENV === 'development' && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                // Performance monitoring for development
                window.addEventListener('load', () => {
                  setTimeout(() => {
                    if (performance.getEntriesByType) {
                      const perfData = performance.getEntriesByType('navigation')[0];
                      console.log('📊 Page Load Performance:', {
                        'DOM Content Loaded': Math.round(perfData.domContentLoadedEventEnd - perfData.fetchStart) + 'ms',
                        'Load Complete': Math.round(perfData.loadEventEnd - perfData.fetchStart) + 'ms'
                      });
                      
                      // Paint metrics
                      const paintEntries = performance.getEntriesByType('paint');
                      paintEntries.forEach(entry => {
                        console.log('🎨 ' + entry.name + ':', Math.round(entry.startTime) + 'ms');
                      });
                    }
                  }, 1000);
                });
              `,
            }}
          />
        )}
      </body>
    </html>
  )
}