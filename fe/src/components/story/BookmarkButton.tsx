// src/components/story/BookmarkButton.tsx
'use client';

import { useTransition, useState } from 'react';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { bookmarkStory } from '@/app/_actions/user-actions';
import { useToast } from '@/components/ui/use-toast';

export default function BookmarkButton({ storyId, isBookmarked = false }) {
  const [isPending, startTransition] = useTransition();
  const [bookmarked, setBookmarked] = useState(isBookmarked);
  const { toast } = useToast();
  
  const handleBookmark = async () => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append('storyId', storyId);
      
      const result = await bookmarkStory(formData);
      
      if (result.error) {
        toast({
          variant: 'destructive',
          title: 'Lỗi',
          description: result.error,
        });
      } else {
        setBookmarked(true);
        toast({
          title: 'Thành công',
          description: 'Đã thêm truyện vào danh sách yêu thích',
        });
      }
    });
  };
  
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleBookmark}
      disabled={isPending || bookmarked}
      className="flex items-center gap-1"
    >
      {bookmarked ? (
        <>
          <BookmarkCheck size={16} className="text-primary" />
          <span>Đã lưu</span>
        </>
      ) : (
        <>
          <Bookmark size={16} />
          <span>Lưu truyện</span>
        </>
      )}
    </Button>
  );
}