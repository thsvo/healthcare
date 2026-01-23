"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const categories = [
  {
    id: 1,
    title: "TESTOSTERONE",
    icon: "🚀",
    color: "bg-[#F3E8FF]", // Light purple
  },
  {
    id: 2,
    title: "MENTAL\nCLARITY",
    icon: "🧠",
    color: "bg-[#FCE7F3]", // Light pink
  },
  {
    id: 3,
    title: "SKIN\nHEALTH",
    icon: "🧴",
    color: "bg-[#FEF3C7]", // Light cream/beige
  },
  {
    id: 4,
    title: "BROWSE\nCATALOG",
    icon: "🔍",
    color: "bg-[#F3F4F6]", // Light gray
    href: "/services"
  },
];

export default function CategoryCards() {
  return (
    <section className="py-6 px-6">
      <div className="container mx-auto">
        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="w-full sm:w-auto"
            >
              <Link 
                href={cat.href || "#"} 
                className={`${cat.color} rounded-full px-6 py-4 flex items-center gap-4 min-w-[180px] hover:shadow-md transition-all cursor-pointer`}
              >
                <span className="text-2xl">
                  {cat.icon}
                </span>
                <span className="text-[10px] font-bold tracking-[0.15em] text-foreground whitespace-pre-line leading-tight">
                  {cat.title}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
