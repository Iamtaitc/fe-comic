"use client"
import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

export function ThemeProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange={true} // Tắt hiệu ứng chuyển đổi để cố định theme
      storageKey="subtruyện-theme"
    >
      {children}
    </NextThemesProvider>
  )
}