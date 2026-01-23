"use client";

import { motion } from "framer-motion";

export default function LeadMagnet() {
  return (
    <section className="py-24 bg-primary text-white text-center">
      <div className="container mx-auto px-6 max-w-3xl">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.8 }}
        >
          <h2 className="font-serif text-4xl md:text-5xl mb-6">Unlock your free Guide to Longevity</h2>
          <p className="text-white/80 mb-10 max-w-lg mx-auto leading-relaxed">
            Join 10,000+ others receiving weekly physician-vetted protocols for optimal health and performance.
          </p>

          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-1 px-6 py-4 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-sm"
              required
            />
            <button 
              type="submit" 
              className="px-8 py-4 bg-white text-primary rounded-full font-bold tracking-widest text-xs hover:bg-gray-100 transition-colors shadow-lg"
            >
              GET THE GUIDE
            </button>
          </form>
          
          <p className="text-[10px] text-white/50 mt-6 tracking-widest uppercase">
            No spam. Unsubscribe anytime.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
