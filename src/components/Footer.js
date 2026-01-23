"use client";

import Link from "next/link";
import { Instagram, Linkedin, Twitter, Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-secondary text-white py-20 border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-2">
             <Link href="/" className="flex items-center gap-2 mb-8 group">
               <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-serif font-bold italic text-xl group-hover:scale-110 transition-transform">
                 s
               </div>
               <span className="font-serif text-2xl font-bold tracking-tight">somi</span>
             </Link>
             <p className="text-gray-400 max-w-sm mb-8 leading-relaxed">
               Radical convenience meets clinical rigor. We are redefining the standard of care for longevity and performance medicine.
             </p>
             <div className="flex gap-4">
               {[Instagram, Twitter, Linkedin].map((Icon, i) => (
                 <a key={i} href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-secondary transition-all">
                   <Icon size={18} />
                 </a>
               ))}
             </div>
          </div>

          {/* Links Column 1 */}
          <div>
            <h4 className="text-xs font-bold tracking-[0.2em] text-primary uppercase mb-8">Protocols</h4>
            <ul className="space-y-4">
              {['Weight Management', 'Hormone Optimization', 'Cognitive Function', 'Skin Health', 'Longevity Stack'].map(item => (
                <li key={item}>
                  <Link href="#" className="text-gray-400 hover:text-white transition-colors text-sm">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links Column 2 */}
          <div>
             <h4 className="text-xs font-bold tracking-[0.2em] text-primary uppercase mb-8">Somi</h4>
             <ul className="space-y-4">
               {['Our Vision', 'The Science', 'Reviews', 'Careers', 'Contact'].map(item => (
                 <li key={item}>
                   <Link href="#" className="text-gray-400 hover:text-white transition-colors text-sm">{item}</Link>
                 </li>
               ))}
             </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500 tracking-wide">© 2026 SOMI HEALTH. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-8">
            <Link href="#" className="text-xs text-gray-500 hover:text-white transition-colors tracking-wide">PRIVACY POLICY</Link>
            <Link href="#" className="text-xs text-gray-500 hover:text-white transition-colors tracking-wide">TERMS OF SERVICE</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
