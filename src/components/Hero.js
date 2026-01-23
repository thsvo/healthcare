"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative min-h-[85vh] flex flex-col items-center justify-center text-center overflow-hidden pt-24 pb-8">
      {/* Background Gradient/Glow Effects - Blue edges like reference */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-[60%] h-[60%] bg-blue-400/20 blur-[150px] rounded-full -translate-x-1/4 -translate-y-1/4" />
        <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-blue-300/15 blur-[120px] rounded-full translate-x-1/4 -translate-y-1/4" />
        <div className="absolute bottom-0 left-1/2 w-[80%] h-[50%] bg-blue-400/15 blur-[150px] rounded-full -translate-x-1/2 translate-y-1/4" />
      </div>

      <div className="container relative z-10 px-6 flex flex-col items-center">
        {/* Main Headline - Exact match to reference */}
        <motion.h1 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="font-serif text-[3.5rem] sm:text-[5rem] md:text-[6.5rem] lg:text-[8rem] leading-[0.95] tracking-tight"
        >
          <span className="block text-primary">weight loss</span>
          <span className="block text-foreground italic">personalized to you</span>
        </motion.h1>

        {/* Subheading */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-12 text-[10px] md:text-[11px] font-medium tracking-[0.35em] uppercase text-muted-foreground"
        >
          Precision Medicine Meets High-End Care
        </motion.p>
      </div>
    </section>
  );
}
