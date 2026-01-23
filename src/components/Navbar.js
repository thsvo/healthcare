"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-background/90 backdrop-blur-md py-4" : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo - Circle "s" + "somi" text */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-serif font-bold italic text-lg">
            s
          </div>
          <span className="font-serif text-xl font-medium tracking-tight text-foreground">somi</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-16">
          {["SHOP", "VISION", "REVIEWS", "FAQ"].map((item) => (
            <Link 
              key={item} 
              href={`#${item.toLowerCase()}`}
              className="text-[10px] font-medium tracking-[0.25em] text-foreground/70 hover:text-foreground transition-colors"
            >
              {item}
            </Link>
          ))}
        </div>

        {/* Action Button */}
        <div className="hidden md:block">
          <Link 
            href="/login"
            className="px-6 py-2.5 bg-foreground text-background rounded-full text-[10px] font-medium tracking-[0.2em] hover:bg-primary transition-colors"
          >
            LOG IN
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden text-foreground"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 right-0 bg-background border-t border-muted md:hidden p-6 shadow-lg flex flex-col gap-6"
        >
          {["SHOP", "VISION", "REVIEWS", "FAQ"].map((item) => (
            <Link 
              key={item} 
              href={`#${item.toLowerCase()}`}
              className="text-xs font-medium tracking-[0.2em] text-foreground hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              {item}
            </Link>
          ))}
          <Link 
            href="/login"
            className="w-full text-center px-6 py-3 bg-foreground text-background rounded-full text-[10px] font-medium tracking-[0.2em]"
            onClick={() => setMobileMenuOpen(false)}
          >
            LOG IN
          </Link>
        </motion.div>
      )}
    </nav>
  );
}
