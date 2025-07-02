// fe\src\components\auth\LoginModal.tsx
"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

import type { RootState, AppDispatch } from "@/store/store"
import { loginUser, closeAuthModals, openRegisterModal, clearError } from "@/store/slices/authSlice"

const loginSchema = z.object({
  username: z.string().min(1, "Tên đăng nhập không được để trống"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  rememberMe: z.boolean().default(false),
})

type LoginFormData = z.infer<typeof loginSchema>

export function LoginModal() {
  const [showPassword, setShowPassword] = useState(false)
  const dispatch = useDispatch<AppDispatch>()
  const { isLoginModalOpen, isLoading, error } = useSelector((state: RootState) => state.auth)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      rememberMe: false,
    },
  })

  const rememberMe = watch("rememberMe")

  const onSubmit = async (data: LoginFormData) => {
    try {
      await dispatch(loginUser({ username: data.username, password: data.password })).unwrap()
      toast.success("Đăng nhập thành công!")
      reset()
    } catch (error: any) {
      toast.error(error || "Đăng nhập thất bại")
    }
  }

  const handleClose = () => {
    dispatch(closeAuthModals())
    dispatch(clearError())
    reset()
  }

  const handleSwitchToRegister = () => {
    dispatch(openRegisterModal())
    dispatch(clearError())
    reset()
  }

  return (
    <Dialog open={isLoginModalOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Đăng nhập</DialogTitle>
          <DialogDescription className="text-center">Đăng nhập để trải nghiệm đầy đủ tính năng</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">{error}</div>}

          <div className="space-y-2">
            <Label htmlFor="username">Tên đăng nhập</Label>
            <Input
              id="username"
              type="text"
              placeholder="Nhập tên đăng nhập"
              {...register("username")}
              className={errors.username ? "border-red-500" : ""}
            />
            {errors.username && <p className="text-sm text-red-600">{errors.username.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Mật khẩu</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Nhập mật khẩu"
                {...register("password")}
                className={errors.password ? "border-red-500 pr-10" : "pr-10"}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="rememberMe"
              checked={rememberMe}
              onCheckedChange={(checked) => setValue("rememberMe", !!checked)}
            />
            <Label htmlFor="rememberMe" className="text-sm font-normal">
              Ghi nhớ đăng nhập
            </Label>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang đăng nhập...
              </>
            ) : (
              "Đăng nhập"
            )}
          </Button>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Chưa có tài khoản?{" "}
              <Button
                type="button"
                variant="link"
                className="p-0 h-auto font-semibold"
                onClick={handleSwitchToRegister}
              >
                Đăng ký ngay
              </Button>
            </p>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}