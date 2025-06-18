// src/components/auth/ResetPasswordForm.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";

// Schema xác thực dữ liệu form
const formSchema = z
  .object({
    password: z.string().min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu không khớp",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof formSchema>;

export function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });
  
  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    
    try {
      // Giả lập API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Giả lập đặt lại mật khẩu thành công
      console.log("Reset password data:", { ...data, token });
      toast.success("Đặt lại mật khẩu thành công!");
      
      // Chuyển hướng đến trang đăng nhập
      router.push("/login");
    } catch (error) {
      toast.error("Đặt lại mật khẩu thất bại. Vui lòng thử lại.");
      console.error("Reset password error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="mx-auto max-w-md space-y-6 p-6 bg-card rounded-lg shadow-sm border">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">Đặt lại mật khẩu</h1>
        <p className="text-muted-foreground">
          Nhập mật khẩu mới cho tài khoản của bạn
        </p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mật khẩu mới</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                    <span className="sr-only">
                      {showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                    </span>
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Xác nhận mật khẩu mới</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                    <span className="sr-only">
                      {showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                    </span>
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button type="submit" variant="manga" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang xử lý...
              </>
            ) : (
              "Đặt lại mật khẩu"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}