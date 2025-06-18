// src/components/story/CommentSection.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, ThumbsUp, ThumbsDown, Reply } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Comment {
  id: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  content: string;
  createdAt: string;
  likes: number;
  dislikes: number;
  replies: Reply[];
}

interface Reply {
  id: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  content: string;
  createdAt: string;
  likes: number;
  dislikes: number;
}

interface CommentSectionProps {
  storyId: string;
  comments: Comment[];
}

export function CommentSection({ storyId, comments: initialComments }: CommentSectionProps) {
  const [comments, setComments] = useState(initialComments);
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  
  const { register, handleSubmit, reset } = useForm<{ content: string }>();
  const { register: registerReply, handleSubmit: handleSubmitReply, reset: resetReply } = useForm<{ content: string }>();
  
  const onSubmit = (data: { content: string }) => {
    const newComment = {
      id: Date.now().toString(),
      user: {
        id: "user-1",
        name: "Người dùng",
      },
      content: data.content,
      createdAt: new Date().toISOString(),
      likes: 0,
      dislikes: 0,
      replies: [],
    };
    
    setComments([newComment, ...comments]);
    reset();
  };
  
  const onSubmitReply = (data: { content: string }) => {
    if (!activeReplyId) return;
    
    const newReply = {
      id: Date.now().toString(),
      user: {
        id: "user-1",
        name: "Người dùng",
      },
      content: data.content,
      createdAt: new Date().toISOString(),
      likes: 0,
      dislikes: 0,
    };
    
    setComments(
      comments.map((comment) => {
        if (comment.id === activeReplyId) {
          return {
            ...comment,
            replies: [...comment.replies, newReply],
          };
        }
        return comment;
      })
    );
    
    resetReply();
    setActiveReplyId(null);
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };
  
  return (
    <div className="py-8">
      <div className="container">
        <h2 className="manga-section-title">
          <MessageSquare className="h-6 w-6 text-manga-orange" />
          Bình luận ({comments.length})
        </h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="mb-8">
          <Textarea
            placeholder="Viết bình luận của bạn..."
            className="mb-3 min-h-[100px]"
            {...register("content", { required: true })}
          />
          <Button type="submit" variant="manga">
            Gửi bình luận
          </Button>
        </form>
        
        <div className="space-y-6">
          {comments.length === 0 ? (
            <div className="rounded-lg border border-dashed p-8 text-center">
              <p className="text-muted-foreground">
                Chưa có bình luận nào. Hãy trở thành người đầu tiên bình luận!
              </p>
            </div>
          ) : (
            comments.map((comment) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="rounded-lg border bg-card p-4">
                  <div className="flex gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={comment.user.avatar} alt={comment.user.name} />
                      <AvatarFallback>{getInitials(comment.user.name)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{comment.user.name}</h4>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>
                      <p className="mt-2 whitespace-pre-line text-sm">{comment.content}</p>
                      <div className="mt-3 flex items-center gap-4">
                        <Button variant="ghost" size="sm" className="h-8 gap-1 px-2">
                          <ThumbsUp className="h-4 w-4" />
                          <span>{comment.likes}</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 gap-1 px-2">
                          <ThumbsDown className="h-4 w-4" />
                          <span>{comment.dislikes}</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 gap-1 px-2"
                          onClick={() => setActiveReplyId(activeReplyId === comment.id ? null : comment.id)}
                        >
                          <Reply className="h-4 w-4" />
                          <span>Trả lời</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <AnimatePresence>
                  {activeReplyId === comment.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="ml-12 overflow-hidden"
                    >
                      <form onSubmit={handleSubmitReply(onSubmitReply)} className="mb-4">
                        <Textarea
                          placeholder={`Trả lời ${comment.user.name}...`}
                          className="mb-3 min-h-[80px]"
                          {...registerReply("content", { required: true })}
                        />
                        <div className="flex gap-2">
                          <Button type="submit" variant="manga" size="sm">
                            Gửi
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setActiveReplyId(null)}
                          >
                            Hủy
                          </Button>
                        </div>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {comment.replies.length > 0 && (
                  <div className="ml-12 space-y-4">
                    {comment.replies.map((reply) => (
                      <motion.div
                        key={reply.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-lg border bg-card p-4"
                      >
                        <div className="flex gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={reply.user.avatar} alt={reply.user.name} />
                            <AvatarFallback>{getInitials(reply.user.name)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium">{reply.user.name}</h4>
                              <span className="text-xs text-muted-foreground">
                                {formatDate(reply.createdAt)}
                              </span>
                            </div>
                            <p className="mt-2 whitespace-pre-line text-sm">{reply.content}</p>
                            <div className="mt-3 flex items-center gap-4">
                              <Button variant="ghost" size="sm" className="h-7 gap-1 px-2 text-xs">
                                <ThumbsUp className="h-3 w-3" />
                                <span>{reply.likes}</span>
                              </Button>
                              <Button variant="ghost" size="sm" className="h-7 gap-1 px-2 text-xs">
                                <ThumbsDown className="h-3 w-3" />
                                <span>{reply.dislikes}</span>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}