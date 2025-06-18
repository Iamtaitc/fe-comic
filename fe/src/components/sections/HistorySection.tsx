// src/components/sections/HistorySection.tsx
"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  History, 
  Trash2, 
  X, 
  AlertTriangle,
  Calendar,
  BookOpen,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { getUserHistory, clearAllHistory, clearHistoryById } from '@/lib/api/comic';
import { StoryObject } from '@/lib/api/comic';
import Link from 'next/link';

interface HistoryItem extends StoryObject {
  historyId: string;
  readAt: string;
  currentChapter?: number;
  totalChapters?: number;
  lastChapterRead?: string;
}

interface HistorySectionProps {
  userId?: string;
  showManagementControls?: boolean;
  maxItems?: number;
}

export function HistorySection({ 
  userId, 
  showManagementControls = false,
  maxItems = 12 
}: HistorySectionProps) {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showClearAllDialog, setShowClearAllDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<HistoryItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  // Load history data
  const loadHistory = async () => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await getUserHistory({ page: 1, limit: maxItems });
      
      if (response.success && response.data?.data?.stories) {
        // Map stories to history items (assume API returns history metadata)
        const items: HistoryItem[] = response.data.data.stories.map((story, index) => ({
          ...story,
          historyId: `history_${story._id}_${index}`, // Temporary ID
          readAt: new Date(Date.now() - index * 3600000).toISOString(), // Mock recent times
          currentChapter: Math.floor(Math.random() * 20) + 1,
          totalChapters: Math.floor(Math.random() * 50) + 20,
        }));
        
        setHistoryItems(items);
      } else {
        setHistoryItems([]);
      }
    } catch (err) {
      console.error('Failed to load history:', err);
      setError('Không thể tải lịch sử đọc');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [userId, maxItems]);

  // Format thời gian đọc
  const formatReadTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    
    if (diffInDays > 0) {
      return `${diffInDays} ngày trước`;
    } else if (diffInHours > 0) {
      return `${diffInHours} giờ trước`;
    } else if (diffInMinutes > 0) {
      return `${diffInMinutes} phút trước`;
    } else {
      return 'Vừa đọc';
    }
  };

  // Xóa toàn bộ lịch sử
  const handleClearAll = async () => {
    setIsDeleting(true);
    
    try {
      const result = await clearAllHistory();
      
      if (result.success) {
        toast({
          title: "Đã xóa lịch sử",
          description: "Toàn bộ lịch sử đọc đã được xóa"
        });
        setHistoryItems([]);
      } else {
        toast({
          title: "Lỗi",
          description: result.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể xóa lịch sử. Vui lòng thử lại.",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
      setShowClearAllDialog(false);
    }
  };

  // Xóa một mục lịch sử
  const handleDeleteItem = async (item: HistoryItem) => {
    setIsDeleting(true);
    
    try {
      const result = await clearHistoryById(item.historyId);
      
      if (result.success) {
        toast({
          title: "Đã xóa",
          description: `Đã xóa "${item.name}" khỏi lịch sử`
        });
        setHistoryItems(prev => prev.filter(h => h.historyId !== item.historyId));
      } else {
        toast({
          title: "Lỗi",
          description: result.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể xóa mục này. Vui lòng thử lại.",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
      setItemToDelete(null);
    }
  };

  // Loading skeleton
  if (loading) {
    return (
      <section className="py-8">
        <div className="container">
          <div className="flex items-center justify-between mb-6">
            <Skeleton className="h-7 w-40" />
            {showManagementControls && <Skeleton className="h-9 w-24" />}
          </div>
          <div className="space-y-4">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4 border rounded-lg">
                <Skeleton className="w-12 h-16 rounded" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-2 w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="py-8">
        <div className="container">
          <Alert variant="destructive">
            <AlertDescription className="flex items-center justify-between">
              <span>{error}</span>
              <Button variant="outline" size="sm" onClick={loadHistory}>
                Thử lại
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      </section>
    );
  }

  // No user logged in
  if (!userId) {
    return (
      <section className="py-8">
        <div className="container">
          <div className="text-center py-12">
            <History className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Cần đăng nhập</h3>
            <p className="text-muted-foreground mb-4">
              Đăng nhập để xem lịch sử đọc truyện của bạn
            </p>
            <Button asChild>
              <Link href="/login">Đăng nhập</Link>
            </Button>
          </div>
        </div>
      </section>
    );
  }

  // Empty state
  if (historyItems.length === 0) {
    return (
      <section className="py-8">
        <div className="container">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <History className="h-6 w-6 text-orange-500" />
              Lịch sử đọc
            </h2>
          </div>
          <div className="text-center py-12">
            <History className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Chưa có lịch sử đọc</h3>
            <p className="text-muted-foreground">
              Các truyện bạn đã đọc sẽ xuất hiện ở đây
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8">
      <div className="container">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-orange-500/10">
              <History className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Lịch sử đọc</h2>
              <p className="text-sm text-muted-foreground">
                {historyItems.length} truyện đã đọc
              </p>
            </div>
          </div>
          
          {showManagementControls && historyItems.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowClearAllDialog(true)}
              className="text-destructive hover:text-destructive"
              disabled={isDeleting}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Xóa tất cả
            </Button>
          )}
        </div>

        {/* History List */}
        <div className="space-y-3">
          <AnimatePresence>
            {historyItems.map((item) => (
              <motion.div
                key={item.historyId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center gap-4 p-4 bg-card rounded-lg border hover:shadow-md transition-all group"
              >
                {/* Cover Image */}
                <Link 
                  href={`/truyen/${item.slug}`}
                  className="flex-shrink-0 group-hover:scale-105 transition-transform"
                >
                  <img
                    src={item.thumb_url || '/placeholder-cover.jpg'}
                    alt={item.name}
                    className="w-12 h-16 object-cover rounded shadow-sm"
                  />
                </Link>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <Link 
                    href={`/truyen/${item.slug}`}
                    className="block hover:text-primary transition-colors"
                  >
                    <h4 className="font-medium truncate mb-1 text-sm">
                      {item.name}
                    </h4>
                  </Link>
                  
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{formatReadTime(item.readAt)}</span>
                    </div>
                    
                    {item.currentChapter && item.totalChapters && (
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-3 w-3" />
                        <span>Chapter {item.currentChapter}/{item.totalChapters}</span>
                      </div>
                    )}

                    {item.lastChapterRead && (
                      <Badge variant="secondary" className="text-xs py-0">
                        {item.lastChapterRead}
                      </Badge>
                    )}
                  </div>

                  {/* Progress bar */}
                  {item.currentChapter && item.totalChapters && (
                    <div className="w-full bg-muted rounded-full h-1.5">
                      <div 
                        className="bg-primary h-1.5 rounded-full transition-all"
                        style={{ 
                          width: `${Math.min((item.currentChapter / item.totalChapters) * 100, 100)}%` 
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Actions */}
                {showManagementControls && (
                  <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setItemToDelete(item)}
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      disabled={isDeleting}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Show More Button */}
        {historyItems.length >= maxItems && (
          <div className="text-center mt-6">
            <Button 
              variant="outline" 
              onClick={() => {
                // Load more logic
                console.log('Load more history items');
              }}
            >
              Xem thêm lịch sử
            </Button>
          </div>
        )}

        {/* Dialog xác nhận xóa tất cả */}
        <AlertDialog open={showClearAllDialog} onOpenChange={setShowClearAllDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                Xóa toàn bộ lịch sử?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Hành động này sẽ xóa vĩnh viễn toàn bộ lịch sử đọc của bạn. 
                Bạn không thể hoàn tác sau khi xóa.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>Hủy</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleClearAll}
                className="bg-destructive hover:bg-destructive/90"
                disabled={isDeleting}
              >
                {isDeleting ? "Đang xóa..." : "Xóa tất cả"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Dialog xác nhận xóa một mục */}
        <AlertDialog open={!!itemToDelete} onOpenChange={(open) => !open && setItemToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Xóa khỏi lịch sử?</AlertDialogTitle>
              <AlertDialogDescription>
                Bạn có chắc muốn xóa "{itemToDelete?.name}" khỏi lịch sử đọc?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>Hủy</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => itemToDelete && handleDeleteItem(itemToDelete)}
                disabled={isDeleting}
              >
                {isDeleting ? "Đang xóa..." : "Xóa"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </section>
  );
}