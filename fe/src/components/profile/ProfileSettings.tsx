// src/components/profile/ProfileSettings.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

// Schema xác thực dữ liệu form
const profileFormSchema = z.object({
  username: z.string().min(3, { message: "Tên người dùng phải có ít nhất 3 ký tự" }),
  email: z.string().email({ message: "Email không hợp lệ" }),
  bio: z.string().max(500, { message: "Giới thiệu không được vượt quá 500 ký tự" }).optional(),
  language: z.string(),
  displayName: z.string().max(50, { message: "Tên hiển thị không được vượt quá 50 ký tự" }).optional(),
});

const notificationFormSchema = z.object({
  newChapter: z.boolean().default(true),
  newComment: z.boolean().default(true),
  email: z.boolean().default(true),
  browser: z.boolean().default(true),
  newsletter: z.boolean().default(false),
});

const passwordFormSchema = z
  .object({
    currentPassword: z.string().min(1, { message: "Vui lòng nhập mật khẩu hiện tại" }),
    newPassword: z.string().min(6, { message: "Mật khẩu mới phải có ít nhất 6 ký tự" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Mật khẩu không khớp",
    path: ["confirmPassword"],
  });

type ProfileFormValues = z.infer<typeof profileFormSchema>;
type NotificationFormValues = z.infer<typeof notificationFormSchema>;
type PasswordFormValues = z.infer<typeof passwordFormSchema>;

export function ProfileSettings() {
  const [activeTab, setActiveTab] = useState("general");
  // src/components/profile/ProfileSettings.tsx (tiếp)
  const [activeTab, setActiveTab] = useState("general");
  const [isLoading, setIsLoading] = useState(false);
  
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: "mangaFan123",
      email: "example@email.com",
      bio: "Yêu thích đọc truyện tranh, đặc biệt là thể loại hành động và phiêu lưu.",
      language: "vi",
      displayName: "Manga Fan",
    },
  });
  
  const notificationForm = useForm<NotificationFormValues>({
    resolver: zodResolver(notificationFormSchema),
    defaultValues: {
      newChapter: true,
      newComment: true,
      email: true,
      browser: true,
      newsletter: false,
    },
  });
  
  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });
  
  const onSubmitProfile = async (data: ProfileFormValues) => {
    setIsLoading(true);
    
    try {
      // Giả lập API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      console.log("Profile data:", data);
      toast.success("Đã cập nhật thông tin cá nhân!");
    } catch (error) {
      toast.error("Lỗi khi cập nhật thông tin. Vui lòng thử lại.");
      console.error("Profile update error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const onSubmitNotifications = async (data: NotificationFormValues) => {
    setIsLoading(true);
    
    try {
      // Giả lập API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      console.log("Notification settings:", data);
      toast.success("Đã cập nhật cài đặt thông báo!");
    } catch (error) {
      toast.error("Lỗi khi cập nhật cài đặt. Vui lòng thử lại.");
      console.error("Notification update error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const onSubmitPassword = async (data: PasswordFormValues) => {
    setIsLoading(true);
    
    try {
      // Giả lập API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      console.log("Password data:", data);
      toast.success("Đã đổi mật khẩu thành công!");
      passwordForm.reset({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast.error("Lỗi khi đổi mật khẩu. Vui lòng thử lại.");
      console.error("Password update error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">Cài đặt tài khoản</h2>
        <p className="text-muted-foreground">
          Quản lý tài khoản và cài đặt cá nhân của bạn
        </p>
      </div>
      
      <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general">Thông tin chung</TabsTrigger>
          <TabsTrigger value="notifications">Thông báo</TabsTrigger>
          <TabsTrigger value="security">Bảo mật</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="mt-6 space-y-6">
          <Form {...profileForm}>
            <form onSubmit={profileForm.handleSubmit(onSubmitProfile)} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={profileForm.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tên người dùng</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={isLoading} />
                      </FormControl>
                      <FormDescription>
                        Tên đăng nhập của bạn. Không thể thay đổi sau khi đã đặt.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={profileForm.control}
                  name="displayName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tên hiển thị</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={isLoading} />
                      </FormControl>
                      <FormDescription>
                        Tên hiển thị trong các bình luận và bài viết.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={profileForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={isLoading} />
                      </FormControl>
                      <FormDescription>
                        Email được sử dụng để đăng nhập và nhận thông báo.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={profileForm.control}
                  name="language"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ngôn ngữ</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={isLoading}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn ngôn ngữ" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="vi">Tiếng Việt</SelectItem>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="ja">日本語</SelectItem>
                          <SelectItem value="zh">中文</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Ngôn ngữ hiển thị của ứng dụng.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={profileForm.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giới thiệu</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Viết vài điều về bản thân..."
                        className="min-h-[120px]"
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormDescription>
                      Hiển thị trên trang hồ sơ của bạn. Tối đa 500 ký tự.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end">
                <Button type="submit" variant="manga" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang lưu...
                    </>
                  ) : (
                    "Lưu thay đổi"
                  )}
                </Button>
              </div>
            </form>
          </Form>
          
          <Separator />
          
          <div>
            <h3 className="text-lg font-medium">Xóa tài khoản</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Khi xóa tài khoản, tất cả dữ liệu của bạn sẽ bị xóa vĩnh viễn và không thể khôi phục.
            </p>
            <Button variant="destructive" className="mt-4">
              Xóa tài khoản
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="notifications" className="mt-6 space-y-6">
          <Form {...notificationForm}>
            <form onSubmit={notificationForm.handleSubmit(onSubmitNotifications)} className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Loại thông báo</h3>
                
                <FormField
                  control={notificationForm.control}
                  name="newChapter"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base cursor-pointer">
                          Chương mới
                        </FormLabel>
                        <FormDescription>
                          Nhận thông báo khi truyện yêu thích có chương mới.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={isLoading}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={notificationForm.control}
                  name="newComment"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base cursor-pointer">
                          Phản hồi bình luận
                        </FormLabel>
                        <FormDescription>
                          Nhận thông báo khi có người phản hồi bình luận của bạn.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={isLoading}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Kênh thông báo</h3>
                
                <FormField
                  control={notificationForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base cursor-pointer">
                          Email
                        </FormLabel>
                        <FormDescription>
                          Nhận thông báo qua email.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={isLoading}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={notificationForm.control}
                  name="browser"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base cursor-pointer">
                          Trình duyệt
                        </FormLabel>
                        <FormDescription>
                          Nhận thông báo trên trình duyệt khi đang trực tuyến.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={isLoading}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={notificationForm.control}
                  name="newsletter"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <FormLabel className="text-base cursor-pointer">
                            Bản tin
                          </FormLabel>
                          <Badge>Mới</Badge>
                        </div>
                        <FormDescription>
                          Nhận bản tin hàng tuần về truyện mới và cập nhật.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={isLoading}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="flex justify-end">
                <Button type="submit" variant="manga" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang lưu...
                    </>
                  ) : (
                    "Lưu thay đổi"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </TabsContent>
        
        <TabsContent value="security" className="mt-6 space-y-6">
          <Form {...passwordForm}>
            <form onSubmit={passwordForm.handleSubmit(onSubmitPassword)} className="space-y-6">
              <h3 className="text-lg font-medium">Đổi mật khẩu</h3>
              
              <FormField
                control={passwordForm.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mật khẩu hiện tại</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={passwordForm.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mật khẩu mới</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormDescription>
                      Mật khẩu phải có ít nhất 6 ký tự.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={passwordForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Xác nhận mật khẩu mới</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end">
                <Button type="submit" variant="manga" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang cập nhật...
                    </>
                  ) : (
                    "Cập nhật mật khẩu"
                  )}
                </Button>
              </div>
            </form>
          </Form>
          
          <Separator />
          
          <div>
            <h3 className="text-lg font-medium">Phiên đăng nhập</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Quản lý các thiết bị đang đăng nhập vào tài khoản của bạn.
            </p>
            
            <div className="mt-4 space-y-3">
              <div className="rounded-lg border p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Chrome trên Windows</p>
                    <p className="text-xs text-muted-foreground">
                      Phiên hiện tại • IP: 192.168.1.1
                    </p>
                  </div>
                  <Badge>Hiện tại</Badge>
                </div>
              </div>
              
              <div className="rounded-lg border p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Safari trên iPhone</p>
                    <p className="text-xs text-muted-foreground">
                      Đăng nhập lần cuối: 2 ngày trước • IP: 192.168.1.2
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Đăng xuất
                  </Button>
                </div>
              </div>
            </div>
            
            <Button variant="outline" className="mt-4">
              Đăng xuất khỏi tất cả thiết bị
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}