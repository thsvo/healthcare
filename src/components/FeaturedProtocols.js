"use client";

import { motion } from "framer-motion";

const protocols = [
  {
    id: 1,
    title: "Semaglutide",
    color: "bg-blue-100",
    bottleColor: "from-blue-400 to-blue-600",
    labelColor: "bg-blue-500",
  },
  {
    id: 2,
    title: "NAD+",
    color: "bg-yellow-50",
    bottleColor: "from-yellow-300 to-yellow-500",
    labelColor: "bg-yellow-400",
  },
  {
    id: 3,
    title: "TRT",
    color: "bg-green-50",
    bottleColor: "from-green-400 to-green-600",
    labelColor: "bg-green-500",
  }
];

export default function FeaturedProtocols() {
  return (
    <section id="shop" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <h2 className="font-serif text-4xl md:text-5xl text-foreground">Semaglutide</h2>
        </motion.div>

        {/* Protocol Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {protocols.map((item, idx) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className="group"
            >
              {/* Product Card with Bottle Illustration */}
              <div className={`${item.color} rounded-3xl p-8 aspect-square flex items-center justify-center mb-6 relative overflow-hidden`}>
                {/* Simplified Bottle SVG */}
                <div className="relative">
                  <div className={`w-24 h-36 bg-gradient-to-b ${item.bottleColor} rounded-2xl shadow-lg relative`}>
                    {/* Bottle Cap */}
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-6 bg-white rounded-t-lg shadow-md" />
                    {/* Label */}
                    <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-16 bg-white rounded-lg p-2 shadow">
                      <p className="font-serif text-xs text-center text-foreground font-bold">somi</p>
                      <div className={`w-full h-1 ${item.labelColor} rounded mt-1`} />
                      <p className="text-[6px] text-center text-muted-foreground mt-1 uppercase tracking-wider">Rx Only</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Button */}
              <button className="w-full py-4 bg-foreground text-background rounded-full text-xs font-bold tracking-[0.2em] hover:bg-primary transition-colors mb-3">
                ORDER PROTOCOL
              </button>
              
              {/* Disclaimer */}
              <p className="text-[9px] text-muted-foreground text-center tracking-[0.15em] uppercase">
                Clinical Discretion Advised
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
