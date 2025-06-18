// src/app/error.tsx
'use client'

import { useEffect } from 'react'
import { Button } from '../src/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="container flex h-screen flex-col items-center justify-center">
      <h2 className="text-2xl font-semibold">Đã xảy ra lỗi!</h2>
      <p className="mt-4 text-center text-muted-foreground">
        Đã có lỗi xảy ra. Vui lòng thử lại sau.
      </p>
      <Button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
        className="mt-8"
      >
        Thử lại
      </Button>
    </div>
  )
}