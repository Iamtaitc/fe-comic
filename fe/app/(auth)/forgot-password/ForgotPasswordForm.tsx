// src/components/auth/ForgotPasswordForm.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
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
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

// Schema xác thực dữ liệu form
const formSchema = z.object({
  email: z.string().email({ message: "Email không hợp lệ" }),
});

type FormValues = z.infer<typeof formSchema>;

export function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });
  
  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    
    try {
      // Giả lập API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      console.log("Forgot password data:", data);
      setIsSubmitted(true);
      toast.success("Email đặt lại mật khẩu đã được gửi!");
    } catch (error) {
      toast.error("Gửi email thất bại. Vui lòng thử lại sau.");
      console.error("Forgot password error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isSubmitted) {
    return (
      <div className="mx-auto max-w-md space-y-6 p-6 bg-card rounded-lg shadow-sm border">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Kiểm tra email của bạn</h1>
          <p className="text-muted-foreground">
            Chúng tôi đã gửi một email đến <span className="font-medium">{form.getValues().email}</span> với
            hướng dẫn để đặt lại mật khẩu của bạn.
          </p>
        </div>
        
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Nếu bạn không nhận được email trong vòng vài phút, vui lòng kiểm tra
            thư mục spam hoặc thử lại.
          </p>
          
          <div className="flex flex-col space-y-2">
            <Button
              variant="outline"
              onClick={() => setIsSubmitted(false)}
              className="w-full"
            >
              Thử lại với email khác
            </Button>
            <Link href="/login" passHref>
              <Button variant="ghost" className="w-full">
                Quay lại đăng nhập
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="mx-auto max-w-md space-y-6 p-6 bg-card rounded-lg shadow-sm border">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">Quên mật khẩu</h1>
        <p className="text-muted-foreground">
          Nhập email của bạn để nhận liên kết đặt lại mật khẩu
        </p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="your.email@example.com"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button type="submit" variant="manga" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang gửi...
              </>
            ) : (
              "Gửi liên kết đặt lại"
            )}
          </Button>
        </form>
      </Form>
      
      <div className="text-center text-sm">
        <p className="text-muted-foreground">
          Nhớ mật khẩu?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Quay lại đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
}