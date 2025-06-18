"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Moon, Sun, Laptop } from "lucide-react"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Giải quyết vấn đề hydration
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // Render một placeholder để tránh layout shift
    return (
      <Button variant="ghost" size="icon" className="rounded-full w-10 h-10">
        <span className="sr-only">Toggle theme</span>
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          {theme === "light" ? (
            <Sun className="h-5 w-5 text-amber-500" />
          ) : theme === "dark" ? (
            <Moon className="h-5 w-5 text-sky-400" />
          ) : (
            <Laptop className="h-5 w-5 text-slate-400" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")} className="flex items-center gap-2 cursor-pointer">
          <Sun className="h-4 w-4 text-amber-500" />
          <span>Sáng</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")} className="flex items-center gap-2 cursor-pointer">
          <Moon className="h-4 w-4 text-sky-400" />
          <span>Tối</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")} className="flex items-center gap-2 cursor-pointer">
          <Laptop className="h-4 w-4 text-slate-400" />
          <span>Hệ thống</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}