// fe\src\components\home\CategoryList.tsx
"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { CategoryObject } from "@/lib/api/comic"
import { Layers } from "lucide-react"

interface CategoryListProps {
  categories: CategoryObject[]
}

export function CategoryList({ categories }: CategoryListProps) {
  // Mở rộng danh sách gradients với nhiều màu sắc hơn
  const gradients = [
    "from-blue-600 to-indigo-700",
    "from-emerald-600 to-teal-700",
    "from-orange-500 to-red-600",
    "from-purple-600 to-pink-700",
    "from-cyan-500 to-blue-700",
    "from-rose-500 to-fuchsia-700",
    "from-violet-600 to-blue-800",
    "from-lime-500 to-green-700",
    "from-amber-500 to-orange-600",
    "from-pink-600 to-rose-800",
    "from-sky-500 to-cyan-700",
    "from-red-600 to-pink-700",
  ]

  // Animation variants cho container
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.02,
      },
    },
  }

  // Animation variants cho từng item
  const item = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  }

  return (
    <section className="py-10 bg-gradient-to-b from-accent/10 to-accent/5">
      <div className="container mx-auto px-4">
        <h2 className="flex items-center gap-2 text-xl font-bold text-foreground mb-6">
          <Layers className="h-6 w-6 text-primary" />
          Thể loại truyện
        </h2>

        <motion.div
          className="grid grid-cols-2 grid-rows-6 gap-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {categories.map((category, index) => (
            <motion.div
              key={category._id}
              variants={item}
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Link
                href={`/category/${category.slug}`}
                className={`group relative flex h-20 items-center justify-center rounded-xl border border-accent/20 bg-gradient-to-br p-3 text-center text-white shadow-sm transition-all duration-300 hover:shadow-md ${
                  gradients[index % gradients.length]
                } hover:animate-gradientFlow`}
              >
                <div className="relative z-10">
                  <motion.span
                    className="block text-base font-medium"
                    initial={{ y: 0 }}
                    whileHover={{ y: -1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {category.name}
                  </motion.span>
                  {category.storyCount && (
                    <span className="block text-xs opacity-85 mt-0.5">
                      {category.storyCount} truyện
                    </span>
                  )}
                </div>
                <div className="absolute inset-0 rounded-xl bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <style jsx>{`
        @keyframes gradientFlow {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .animate-gradientFlow {
          background-size: 300% 300%;
          animation: gradientFlow 2.5s ease infinite;
        }
      `}</style>
    </section>
  )
}



