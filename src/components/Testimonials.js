"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const reviews = [
  {
    id: 1,
    text: "Somi completely changed my perspective on healthcare. It's proactive, not reactive. The team actually listens.",
    author: "James D.",
    role: "Member since 2023",
    rating: 5,
  },
  {
    id: 2,
    text: "I feel 10 years younger. The protocols are easy to follow and the results speak for themselves.",
    author: "Sarah M.",
    role: "Member since 2024",
    rating: 5,
  },
  {
    id: 3,
    text: "Finally, a service that takes men's health seriously without the stigma. Highly recommended.",
    author: "Michael R.",
    role: "Member since 2023",
    rating: 5,
  }
];

export default function Testimonials() {
  return (
    <section id="reviews" className="py-24 bg-secondary text-white relative overflow-hidden">
      {/* Decorative Blur */}
      <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-xs font-bold tracking-[0.2em] text-primary uppercase mb-4 block">
            Member Voices
          </span>
          <h2 className="font-serif text-4xl md:text-5xl">
            Real results, real people.
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {reviews.map((review, idx) => (
            <motion.div 
              key={review.id}
              initial={{ opacity: 0, scaled: 0.9 }}
              whileInView={{ opacity: 1, scaled: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
              className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:border-primary/50 transition-colors"
            >
              <div className="flex gap-1 text-primary mb-6">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>
              <p className="text-lg leading-relaxed mb-6 text-gray-200 font-serif">"{review.text}"</p>
              <div>
                <p className="font-bold text-white">{review.author}</p>
                <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">{review.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
