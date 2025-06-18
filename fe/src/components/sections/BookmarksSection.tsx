// src/components/sections/BookmarksSection.tsx
"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark, BookmarkCheck, Heart, Eye, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { getUserBookmarks, removeBookmark } from '@/lib/api/comic';
import { StoryObject } from '@/lib/api/comic';
import { StoryGrid } from '../home/StoryCard';
import Link from 'next/link';

interface BookmarksSectionProps {
  userId?: string;
  maxItems?: number;
  showGrid?: boolean;
}

export function BookmarksSection({ 
  userId, 
  maxItems = 12,
  showGrid = true 
}: BookmarksSectionProps) {
  const [bookmarkedStories, setBookmarkedStories] = useState<StoryObject[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [removingIds, setRemovingIds] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  // Load bookmarked stories
  const loadBookmarks = async () => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await getUserBookmarks({ page: 1, limit: maxItems });
      
      if (response.success && response.data?.data?.stories) {
        setBookmarkedStories(response.data.data.stories);
      } else {
        setBookmarkedStories([]);
      }
    } catch (err) {
      console.error('Failed to load bookmarks:', err);
      setError('Không thể tải danh sách truyện đã lưu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookmarks();
  }, [userId, maxItems]);

  // Remove bookmark
  const handleRemoveBookmark = async (storyId: string, storyName: string) => {
    setRemovingIds(prev => new Set([...prev, storyId]));
    
    try {
      const result = await removeBookmark(storyId);
      
      if (result.success) {
        toast({
          title: "Đã bỏ lưu",
          description: `Đã bỏ "${storyName}" khỏi danh sách yêu thích`
        });
        setBookmarkedStories(prev => prev.filter(story => story._id !== storyId));
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
        description: "Không thể bỏ lưu truyện. Vui lòng thử lại.",
        variant: "destructive"
      });
    } finally {
      setRemovingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(storyId);
        return newSet;
      });
    }
  };

  // Format số
  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  // Loading skeleton
  if (loading) {
    return (
      <section className="py-8">
        <div className="container">
          <div className="flex items-center justify-between mb-6">
            <Skeleton className="h-7 w-48" />
          </div>
          {showGrid ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className="manga-card">
                  <div className="manga-cover relative aspect-[2/3]">
                    <Skeleton className="absolute inset-0 rounded-lg" />
                  </div>
                  <div className="p-3 space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {Array(4).fill(0).map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-4 border rounded-lg">
                  <Skeleton className="w-12 h-16 rounded" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          )}
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
              <Button variant="outline" size="sm" onClick={loadBookmarks}>
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
            <Bookmark className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Cần đăng nhập</h3>
            <p className="text-muted-foreground mb-4">
              Đăng nhập để xem danh sách truyện đã lưu
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
  if (bookmarkedStories.length === 0) {
    return (
      <section className="py-8">
        <div className="container">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Bookmark className="h-6 w-6 text-pink-500" />
              Truyện đã lưu
            </h2>
          </div>
          <div className="text-center py-12">
            <Bookmark className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Chưa có truyện nào được lưu</h3>
            <p className="text-muted-foreground">
              Nhấn vào biểu tượng bookmark để lưu truyện yêu thích
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
            <div className="p-2 rounded-lg bg-pink-500/10">
              <Bookmark className="h-5 w-5 text-pink-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Truyện đã lưu</h2>
              <p className="text-sm text-muted-foreground">
                {bookmarkedStories.length} truyện yêu thích
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        {showGrid ? (
          /* Grid Layout */
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            <AnimatePresence>
              {bookmarkedStories.map((story) => (
                <motion.div
                  key={story._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="manga-card group relative overflow-hidden"
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link href={`/truyen/${story.slug}`} className="block">
                    {/* Cover Image */}
                    <div className="manga-cover relative overflow-hidden aspect-[2/3]">
                      <img
                        src={story.thumb_url || '/placeholder-cover.jpg'}
                        alt={story.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* Status badge */}
                      <div className="absolute top-2 left-2 z-10">
                        <Badge className="text-xs bg-green-500 hover:bg-green-600 text-white border-0">
                          {story.status === 'completed' ? 'Hoàn thành' : 'Đang ra'}
                        </Badge>
                      </div>

                      {/* Remove bookmark button */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 z-10 h-8 w-8 bg-black/30 hover:bg-black/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleRemoveBookmark(story._id, story.name);
                        }}
                        disabled={removingIds.has(story._id)}
                      >
                        <BookmarkCheck className="h-4 w-4 text-yellow-400" />
                      </Button>
                    </div>

                    {/* Content */}
                    <div className="p-3">
                      <h3 className="font-semibold text-sm line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                        {story.name}
                      </h3>

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            <span>{formatNumber(story.views || 0)}</span>
                          </div>
                          
                          {story.ratingValue && (
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-current text-yellow-400" />
                              <span>{story.ratingValue.toFixed(1)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          /* List Layout */
          <div className="space-y-3">
            <AnimatePresence>
              {bookmarkedStories.map((story) => (
                <motion.div
                  key={story._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center gap-4 p-4 bg-card rounded-lg border hover:shadow-md transition-all group"
                >
                  {/* Cover Image */}
                  <Link 
                    href={`/truyen/${story.slug}`}
                    className="flex-shrink-0 group-hover:scale-105 transition-transform"
                  >
                    <img
                      src={story.thumb_url || '/placeholder-cover.jpg'}
                      alt={story.name}
                      className="w-12 h-16 object-cover rounded shadow-sm"
                    />
                  </Link>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <Link 
                      href={`/truyen/${story.slug}`}
                      className="block hover:text-primary transition-colors"
                    >
                      <h4 className="font-medium truncate mb-1 text-sm">
                        {story.name}
                      </h4>
                    </Link>
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-1">
                      <Badge variant="secondary" className="text-xs py-0">
                        {story.status === 'completed' ? 'Hoàn thành' : 'Đang ra'}
                      </Badge>
                      
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        <span>{formatNumber(story.views || 0)}</span>
                      </div>
                      
                      {story.ratingValue && (
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-current text-yellow-400" />
                          <span>{story.ratingValue.toFixed(1)}</span>
                        </div>
                      )}
                    </div>

                    {story.description && (
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {story.description}
                      </p>
                    )}
                  </div>

                  {/* Remove button */}
                  <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveBookmark(story._id, story.name)}
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      disabled={removingIds.has(story._id)}
                    >
                      <BookmarkCheck className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Show More Button */}
        {bookmarkedStories.length >= maxItems && (
          <div className="text-center mt-6">
            <Button 
              variant="outline" 
              onClick={() => {
                // Load more logic
                console.log('Load more bookmarks');
              }}
            >
              Xem thêm truyện đã lưu
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}