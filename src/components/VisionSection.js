"use client";

import { motion } from "framer-motion";

export default function VisionSection() {
  return (
    <section id="vision" className="py-20 bg-background overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Circular Image - Fish-eye effect like reference */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative w-full max-w-[400px] mx-auto"
          >
            <div className="aspect-square rounded-full overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=2670&auto=format&fit=crop" 
                alt="Medical professionals"
                className="object-cover w-full h-full scale-125 hover:scale-130 transition-transform duration-700"
              />
            </div>
          </motion.div>

          {/* Text Content */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col text-left"
          >
            <span className="text-[10px] font-bold tracking-[0.3em] text-muted-foreground uppercase mb-8">
              The Somi Vision
            </span>
            
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-[1.1] text-foreground mb-6">
              Science shouldn't feel like a <span className="italic">chore.</span>
            </h2>
            
            <p className="text-muted-foreground leading-relaxed text-sm max-w-md">
              We combine clinical rigor with radical convenience—bringing you evidence-based protocols that feel effortless.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
