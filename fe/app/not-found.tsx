// src/app/not-found.tsx
import Link from 'next/link'
import { Button } from '../src/components/ui/button'

export default function NotFound() {
  return (
    <div className="container flex h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">404</h1>
      <h2 className="mt-2 text-2xl font-semibold">Không tìm thấy trang</h2>
      <p className="mt-4 text-center text-muted-foreground">
        Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
      </p>
      <Button asChild className="mt-8">
        <Link href="/">Trở về trang chủ</Link>
      </Button>
    </div>
  )
}