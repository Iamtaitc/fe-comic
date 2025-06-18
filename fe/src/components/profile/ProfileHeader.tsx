// src/components/profile/ProfileHeader.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { Camera, Edit2, LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  joinedAt: string;
  storiesCount: number;
  commentsCount: number;
}

interface ProfileHeaderProps {
  user: User;
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState(user.bio || "");
  
  const handleUpdateBio = () => {
    // Giả lập cập nhật thông tin
    toast.success("Đã cập nhật thông tin cá nhân!");
    setIsEditing(false);
  };
  
  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Giả lập upload avatar
      toast.success("Đã cập nhật ảnh đại diện!");
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  
  return (
    <div className="bg-card rounded-lg shadow-sm border p-6 space-y-6">
      <div className="flex flex-col items-center md:flex-row md:items-start md:gap-6">
        <div className="relative group">
          <Avatar className="h-24 w-24 md:h-32 md:w-32">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="text-xl md:text-2xl">
              {user.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <label
            htmlFor="avatar-upload"
            // src/components/profile/ProfileHeader.tsx (tiếp)
            className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 
              group-hover:opacity-100 transition-opacity cursor-pointer"
          >
            <Camera className="h-6 w-6 text-white" />
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={handleAvatarUpload}
            />
          </label>
        </div>
        
        <div className="flex-1 mt-4 md:mt-0 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Settings className="h-5 w-5" />
                  <span className="sr-only">Tùy chọn</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Quản lý tài khoản</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Cài đặt tài khoản</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Edit2 className="mr-2 h-4 w-4" />
                  <span>Chỉnh sửa hồ sơ</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Đăng xuất</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <p className="text-muted-foreground text-sm mt-1">
            {user.email}
          </p>
          
          <div className="flex items-center justify-center md:justify-start gap-6 mt-4">
            <div className="text-center">
              <p className="font-semibold">{user.storiesCount}</p>
              <p className="text-xs text-muted-foreground">Truyện đã lưu</p>
            </div>
            <Separator orientation="vertical" className="h-8" />
            <div className="text-center">
              <p className="font-semibold">{user.commentsCount}</p>
              <p className="text-xs text-muted-foreground">Bình luận</p>
            </div>
            <Separator orientation="vertical" className="h-8" />
            <div className="text-center">
              <p className="font-semibold">{formatDate(user.joinedAt)}</p>
              <p className="text-xs text-muted-foreground">Tham gia</p>
            </div>
          </div>
          
          <div className="mt-4">
            {isEditing ? (
              <div className="space-y-2">
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  rows={3}
                  placeholder="Viết giới thiệu về bạn..."
                />
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setBio(user.bio || "");
                      setIsEditing(false);
                    }}
                  >
                    Hủy
                  </Button>
                  <Button
                    variant="manga"
                    size="sm"
                    onClick={handleUpdateBio}
                  >
                    Lưu
                  </Button>
                </div>
              </div>
            ) : (
              <div className="group relative">
                <p className="text-sm whitespace-pre-line">
                  {bio || "Thêm giới thiệu về bản thân..."}
                </p>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit2 className="h-4 w-4" />
                  <span className="sr-only">Chỉnh sửa</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}