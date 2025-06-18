"use client";
import { useEffect, useRef } from 'react';
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { BookOpen, TrendingUp, Clock } from "lucide-react";
import { gsap } from 'gsap';

interface CategoryHeaderProps {
  title: string;
  description: string;
  totalStories: number;
  slug: string;
}

export function CategoryHeader({ 
  title, 
  description, 
  totalStories, 
  slug 
}: CategoryHeaderProps) {
  // Lấy gradient color dựa trên slug
  const getGradientBySlug = (slug: string) => {
    const gradients: Record<string, string> = {
      "xuyen-khong": "from-purple-600 via-pink-600 to-blue-600",
      "chuyen-sinh": "from-blue-600 via-cyan-600 to-teal-600", 
      "manga": "from-orange-600 via-red-600 to-pink-600",
      "16": "from-rose-600 via-pink-600 to-purple-600",
      default: "from-primary via-primary/80 to-primary/60"
    };
    return gradients[slug] || gradients.default;
  };

  const gradient = getGradientBySlug(slug);
  const cosmicFlowRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = cosmicFlowRef.current;
    const particleContainer = particlesRef.current;
    
    if (!container || !particleContainer) return;

    // Generate particles
    const particleCount = 30;
    const particles: HTMLDivElement[] = [];
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = `absolute rounded-full bg-white/30 glow transition-all duration-300`;
      particle.style.width = `${Math.random() * 4 + 2}px`;
      particle.style.height = particle.style.width;
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.bottom = `${Math.random() * 60}px`;
      particleContainer.appendChild(particle);
      particles.push(particle);
    }

    // Animate particles with wave-like motion
    particles.forEach((particle, index) => {
      gsap.to(particle, {
        x: () => Math.sin(index * 0.5 + Date.now() * 0.001) * 50,
        y: () => -Math.cos(index * 0.3 + Date.now() * 0.001) * 30 - 20,
        scale: () => Math.random() * 0.5 + 0.8,
        opacity: () => Math.random() * 0.4 + 0.3,
        duration: 3 + Math.random() * 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: index * 0.1,
      });
    });

    // Mouse interaction
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      particles.forEach((particle) => {
        const particleRect = particle.getBoundingClientRect();
        const particleX = particleRect.left - rect.left + particleRect.width / 2;
        const particleY = particleRect.top - rect.top + particleRect.height / 2;
        
        const dx = mouseX - particleX;
        const dy = mouseY - particleY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
          const angle = Math.atan2(dy, dx);
          gsap.to(particle, {
            x: -Math.cos(angle) * 20,
            y: -Math.sin(angle) * 20,
            duration: 0.3,
            overwrite: 'auto',
          });
        }
      });
    };

    container.addEventListener('mousemove', handleMouseMove);

    // Cleanup
    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      particles.forEach((particle) => particle.remove());
    };
  }, []);

  return (
    <div className={`relative py-16 bg-gradient-to-r ${gradient} overflow-hidden`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-white/20 animate-pulse" />
        <div className="absolute top-32 right-20 w-24 h-24 rounded-full bg-white/10 animate-pulse delay-1000" />
        <div className="absolute bottom-20 left-1/4 w-40 h-40 rounded-full bg-white/15 animate-pulse delay-500" />
        <div className="absolute bottom-10 right-10 w-28 h-28 rounded-full bg-white/10 animate-pulse delay-1500" />
      </div>

      {/* Animated Background Lines */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"
          animate={{
            x: ["-100%", "100%"],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
          animate={{
            x: ["100%", "-100%"],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "linear",
            delay: 1,
          }}
        />
      </div>

      <div className="container relative z-10">
        <div className="max-w-4xl mx-auto text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
              <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                {title}
              </span>
            </h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed max-w-2xl mx-auto"
            >
              {description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-wrap items-center justify-center gap-4 mb-8"
            >
              <Badge className="bg-white/20 hover:bg-white/30 text-white border-white/30 text-sm px-4 py-2">
                <BookOpen className="w-4 h-4 mr-2" />
                {totalStories} truyện
              </Badge>
              
              <Badge className="bg-white/20 hover:bg-white/30 text-white border-white/30 text-sm px-4 py-2">
                <TrendingUp className="w-4 h-4 mr-2" />
                Đang hot
              </Badge>
              
              <Badge className="bg-white/20 hover:bg-white/30 text-white border-white/30 text-sm px-4 py-2">
                <Clock className="w-4 h-4 mr-2" />
                Cập nhật liên tục
              </Badge>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1 }}
              className="inline-flex flex-col items-center"
            >
              <span className="text-white/70 text-sm mb-2">Khám phá thêm</span>
              <motion.div
                animate={{
                  y: [0, 8, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center"
              >
                <motion.div
                  animate={{
                    y: [0, 12, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="w-1 h-3 bg-white/60 rounded-full mt-2"
                />
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Cosmic Flow Effect */}
      <div ref={cosmicFlowRef} className="absolute bottom-0 left-0 right-0 h-32 overflow-hidden z-20">
        {/* Particle Container */}
        <div ref={particlesRef} className="absolute bottom-0 left-0 right-0 h-full"></div>
        
        {/* Gradient Overlay for Smooth Transition */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent z-30"></div>
      </div>

      <style jsx>{`
        .glow {
          box-shadow: 0 0 8px 2px rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </div>
  );
}