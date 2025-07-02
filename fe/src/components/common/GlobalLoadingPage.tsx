// components/common/GlobalLoadingPage.tsx - Updated for SubTruyện brand
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Heart, Zap } from "lucide-react";
import Image from "next/image";
import logo from "../../../public/sublogo.png";

interface GlobalLoadingPageProps {
  onLoadingComplete?: () => void;
  minLoadingTime?: number; // Minimum time to show loading (ms)
}

export function GlobalLoadingPage({ 
  onLoadingComplete, 
  minLoadingTime = 2000 
}: GlobalLoadingPageProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const loadingSteps = [
    { icon: Zap, text: "Đang tải thư viện SubTruyện...", color: "text-blue-500" },
    { icon: Sparkles, text: "Chuẩn bị nội dung mới nhất...", color: "text-purple-500" },
    { icon: Heart, text: "Tối ưu trải nghiệm đọc...", color: "text-green-500" },
    { icon: Heart, text: "Sắp hoàn tất, chờ chút nhé!", color: "text-red-500" }
  ];

  useEffect(() => {
    const stepDuration = minLoadingTime / loadingSteps.length;
    
    const stepInterval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < loadingSteps.length - 1) {
          return prev + 1;
        }
        clearInterval(stepInterval);
        
        // Complete loading after last step
        setTimeout(() => {
          setIsComplete(true);
          onLoadingComplete?.();
        }, stepDuration);
        
        return prev;
      });
    }, stepDuration);

    return () => clearInterval(stepInterval);
  }, [minLoadingTime, onLoadingComplete]);

  const logoVariants = {
    hidden: { opacity: 0, scale: 0.5, rotate: -180 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      rotate: 0,
      transition: { 
        duration: 0.8, 
        ease: [0.25, 0.1, 0.25, 1],
        type: "spring",
        stiffness: 100
      }
    }
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: { duration: 0.3 }
    }
  };

  const progressVariants = {
    hidden: { width: 0 },
    visible: { 
      width: `${((currentStep + 1) / loadingSteps.length) * 100}%`,
      transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }
    }
  };

  if (isComplete) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black"
      initial={{ opacity: 1 }}
      exit={{ 
        opacity: 0, 
        scale: 0.95,
        transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }
      }}
    >
      {/* Background Animated Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-300 rounded-full opacity-40"
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              scale: [1, 1.5, 1],
              opacity: [0.4, 0.8, 0.4]
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              repeatType: "reverse",
              delay: Math.random() * 3
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center max-w-md mx-auto px-6">
        {/* Logo/Brand */}
        <motion.div
          className="mb-8"
          variants={logoVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="relative">
            {/* Logo Container with Glow Effect */}
            <motion.div
              className="relative w-48 h-48 mx-auto mb-6 rounded-3xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 50%, rgba(236, 72, 153, 0.1) 100%)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)'
              }}
              animate={{ 
                rotate: [0, 2, -2, 0],
                scale: [1, 1.02, 1]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity, 
                repeatType: "reverse",
                ease: "easeInOut"
              }}
            >
              {/* Animated Background Gradient */}
              <motion.div
                className="absolute inset-0 rounded-3xl opacity-20"
                style={{
                  background: 'linear-gradient(135deg, #3b82f6, #9333ea, #ec4899)'
                }}
                animate={{
                  rotate: 360
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
              
              {/* Logo Image - 2.5x larger */}
              <motion.div
                className="relative z-10"
                animate={{
                  scale: [1, 1.05, 1]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                <Image
                  src={logo}
                  alt="SubTruyện"
                  width={200}
                  height={200}
                  className="w-48 h-48 object-contain drop-shadow-xl"
                  priority
                />
              </motion.div>
            </motion.div>
            
            {/* Enhanced Sparkle Effects around logo */}
            {Array.from({ length: 12 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1.5 h-1.5 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full"
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                  rotate: 360,
                  x: [0, Math.cos((i * 30) * Math.PI / 180) * 15, 0],
                  y: [0, Math.sin((i * 30) * Math.PI / 180) * 15, 0]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut"
                }}
                style={{
                  left: `${50 + Math.cos((i * 30) * Math.PI / 180) * 90}%`,
                  top: `${50 + Math.sin((i * 30) * Math.PI / 180) * 90}%`
                }}
              />
            ))}
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
              SubTruyện
            </h1>
            <motion.p 
              className="text-base text-gray-600 font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
            >
              Thế giới truyện tranh của bạn
            </motion.p>
          </motion.div>
        </motion.div>

        {/* Loading Steps */}
        <div className="mb-8">
          <AnimatePresence mode="wait">
            {loadingSteps.map((step, index) => {
              const Icon = step.icon;
              return currentStep === index ? (
                <motion.div
                  key={index}
                  variants={textVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="flex items-center justify-center gap-3"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Icon className={`w-5 h-5 ${step.color}`} />
                  </motion.div>
                  <span className="text-gray-700 font-medium">
                    {step.text}
                  </span>
                </motion.div>
              ) : null;
            })}
          </AnimatePresence>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full relative"
              variants={progressVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Progress bar glow effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-full blur-sm opacity-50"
                animate={{
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
            </motion.div>
          </div>
          <motion.p 
            className="text-sm text-gray-500 mt-3 font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            {Math.round(((currentStep + 1) / loadingSteps.length) * 100)}% hoàn thành
          </motion.p>
        </div>

        {/* Fun Facts */}
        <motion.div
          className="space-y-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <div className="text-xs text-gray-400 italic">
            💡 Mẹo: Bookmark trang để đọc offline!
          </div>
          <div className="text-xs text-gray-400 italic">
            📚 Hơn 10,000+ truyện đang chờ bạn khám phá
          </div>
        </motion.div>

        {/* SubTruyện branding footer */}
        <motion.div
          className="absolute bottom-6 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2 }}
        >
          <p className="text-xs text-gray-400">
            © 2024 SubTruyện. Trải nghiệm đọc truyện tuyệt vời.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default GlobalLoadingPage;