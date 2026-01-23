"use client";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import CategoryCards from "@/components/CategoryCards";
import VisionSection from "@/components/VisionSection";
import FeaturedProtocols from "@/components/FeaturedProtocols";
import Testimonials from "@/components/Testimonials";
import LeadMagnet from "@/components/LeadMagnet";
import Footer from "@/components/Footer";
import { useEffect } from "react";

export default function Home() {
  // Smooth scroll behavior for anchor links
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = "auto";
    };
  }, []);

  return (
    <main className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 selection:text-primary">
      <Navbar />
      <Hero />
      <CategoryCards />
      <VisionSection />
      <FeaturedProtocols />
      <Testimonials />
      <LeadMagnet />
      <Footer />
    </main>
  );
}
