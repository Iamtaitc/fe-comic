// src/app/(auth)/profile/page.tsx
"use client";
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { options } from '@/app/api/auth/[...next-auth]/options';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ReadingHistory from '@/components/profile/ReadingHistory';
import Bookmarks from '@/components/profile/Bookmarks';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default async function ProfilePage() {
  const session = await getServerSession(options);
  
  if (!session) {
    redirect('/login?callbackUrl=/profile');
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <ProfileHeader user={session.user} />
      
      <Tabs defaultValue="reading-history" className="mt-8">
        <TabsList className="grid w-full md:w-auto grid-cols-2 md:flex">
          <TabsTrigger value="reading-history">Lịch sử đọc truyện</TabsTrigger>
          <TabsTrigger value="bookmarks">Truyện đã lưu</TabsTrigger>
          <TabsTrigger value="settings">Cài đặt tài khoản</TabsTrigger>
        </TabsList>
        
        <TabsContent value="reading-history" className="mt-6">
          <ReadingHistory userId={session.user.id} />
        </TabsContent>
        
        <TabsContent value="bookmarks" className="mt-6">
          <Bookmarks userId={session.user.id} />
        </TabsContent>
        
        <TabsContent value="settings" className="mt-6">
          <ProfileSettings userId={session.user.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}