// src/components/home/FeaturedCategories.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Flame, Heart, Shield } from "lucide-react";

interface FeaturedCategory {
  name: string;
  slug: string;
  description: string;
  color: string;
  gradient: string;
  icon: React.ReactNode;
  storyCount?: number;
}

const featuredCategories: FeaturedCategory[] = [
  {
    name: "Xuyên Không",
    slug: "xuyen-khong",
    description: "Du hành qua không gian thời gian",
    color: "from-purple-500 to-pink-500",
    gradient: "bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20",
    icon: <Sparkles className="h-6 w-6" />,
    storyCount: 156
  },
  {
    name: "Chuyển Sinh",
    slug: "chuyen-sinh",
    description: "Tái sinh trong thế giới mới",
    color: "from-blue-500 to-cyan-500",
    gradient: "bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-900/20",
    icon: <Flame className="h-6 w-6" />,
    storyCount: 203
  },
  {
    name: "Manga",
    slug: "manga",
    description: "Truyện tranh Nhật Bản",
    color: "from-orange-500 to-red-500",
    gradient: "bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/20 dark:to-red-900/20",
    icon: <Heart className="h-6 w-6" />,
    storyCount: 1250
  },
  {
    name: "16+",
    slug: "16",
    description: "Nội dung dành cho người lớn",
    color: "from-rose-500 to-pink-500",
    gradient: "bg-gradient-to-br from-rose-100 to-pink-100 dark:from-rose-900/20 dark:to-pink-900/20",
    icon: <Shield className="h-6 w-6" />,
    storyCount: 89
  }
];

export function FeaturedCategories() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <section className="py-16 ">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Thể Loại Nổi Bật
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Khám phá những thể loại truyện tranh được yêu thích nhất với nội dung đa dạng và hấp dẫn
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {featuredCategories.map((category) => (
            <motion.div
              key={category.slug}
              variants={itemVariants}
              whileHover={{ 
                scale: 1.05,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href={`/category/${category.slug}`}>
                <div className={`relative p-6 rounded-xl border transition-all duration-300 group ${category.gradient}`}>
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-10 rounded-xl overflow-hidden">
                    <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-white/20" />
                    <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-white/10" />
                  </div>

                  <div className="relative z-10">
                    {/* Icon & Badge */}
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-lg bg-gradient-to-br ${category.color} text-white shadow-lg`}>
                        {category.icon}
                      </div>
                      <Badge variant="secondary" className="bg-white/80 text-gray-700">
                        {category.storyCount} truyện
                      </Badge>
                    </div>

                    {/* Content */}
                    <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {category.description}
                    </p>

                    {/* Hover Effect */}
                    <div className="absolute inset-0 rounded-xl from-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Link
            href="/category"
            className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl"
          >
            Xem tất cả thể loại
            <motion.div
              className="ml-2"
              animate={{ x: [0, 4, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              →
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}