"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { LogIn } from "lucide-react"
import { Logo } from "./Logo"
import { MainNav } from "./MainNav"
import { MobileNav } from "./MobileNav"
import { SearchInput } from "./SearchInput"
import { useDispatch, useSelector } from "react-redux"
import type { RootState, AppDispatch } from "@/store/store"
import { openLoginModal } from "@/store/slices/authSlice"
import { UserMenu } from "../auth/UserMenu"

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const dispatch = useDispatch<AppDispatch>()
  const { isAuthenticated } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled ? "bg-background/80 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-4">
          <MobileNav />
          <Logo />
          <MainNav className="hidden md:flex" />
        </div>

        <div className="flex items-center gap-4">
          <SearchInput className="hidden md:flex" />
          <SearchInput mobile className="md:hidden" />
          {isAuthenticated ? (
            <UserMenu />
          ) : (
            <Button
              variant="default"
              size="sm"
              className="gap-2 rounded-full"
              onClick={() => dispatch(openLoginModal())}
            >
              <LogIn className="h-4 w-4" />
              <span className="hidden sm:inline-block">Đăng nhập</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
