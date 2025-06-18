"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import logo from "../../../public/sublogo.png";

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-2 ${className || ""}`}>
      <motion.div
        initial={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        <Image 
          src={logo} 
          alt="SubTruyện" 
          width={40} 
          height={40} 
          className="w-auto h-8" 
          priority
        />
      </motion.div>
    </Link>
  );
}