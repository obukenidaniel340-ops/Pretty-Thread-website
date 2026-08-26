'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Send, ArrowRight, Sparkles } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  const footerLinks = {
    collections: [
      { label: 'New Arrivals', href: '/shop' },
      { label: 'Traditional Boubous', href: '/shop?category=Casuals' },
      { label: 'Tailored Dresses', href: '/shop?category=Dresses' },
      { label: 'Streetwear Jackets', href: '/shop?category=Outerwear' },
      { label: 'Aso Oke Co-ords', href: '/shop?category=Co-ords' }
    ],
    support: [
      { label: 'Size Guide', href: '#' },
      { label: 'Shipping & Delivery', href: '#' },
      { label: 'Returns & Exchanges', href: '#' },
      { label: 'Order Tracking', href: '/account' },
      { label: 'Contact Us', href: '#' }
    ],
    company: [
      { label: 'Our Story', href: '#' },
      { label: 'Atelier Craftsmanship', href: '#' },
      { label: 'Sustainability Focus', href: '#' },
      { label: 'Careers', href: '#' },
      { label: 'Privacy Policy', href: '#' }
    ]
  };

  return (
    <footer className="w-full bg-[#1F2022] text-[#FDFBF7] mt-auto">
      {/* Newsletter Block */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 border-b border-[#FDFBF7]/10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-center">
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight">
              Join the Pretty Threads Atelier
            </h3>
            <p className="text-sm text-[#FDFBF7]/70 max-w-xl">
              Subscribe to unlock early access to our seasonal capsule collections, exclusive member perks, and traditional craftsmanship stories.
            </p>
          </div>
          <div>
            {subscribed ? (
              <div className="flex items-center space-x-2 text-primary font-medium text-sm bg-primary/10 py-3 px-4 rounded-md border border-primary/20">
                <Sparkles size={18} />
                <span>You're on the list! Thank you for subscribing.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-[#2C2D30] border border-[#FDFBF7]/15 rounded-md px-4 py-3 text-sm placeholder:text-[#FDFBF7]/40 text-[#FDFBF7] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-primary hover:bg-primary/95 text-primary-foreground font-semibold px-6 py-3 text-sm transition-all sm:w-auto w-full shadow-md"
                >
                  <span>Subscribe</span>
                  <ArrowRight size={16} />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Main Links Block */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="font-serif text-3xl font-bold tracking-tight text-primary">
              Pretty Threads<span className="text-[#FDFBF7]">.</span>
            </Link>
            <p className="text-sm text-[#FDFBF7]/60 leading-relaxed max-w-sm">
              We design streetwear-meets-elevated-casual apparel that blends traditional African textures with modern silhouettes. Crafted for the confident, aspirational, and effortlessly stylish.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="h-9 w-9 bg-[#2C2D30] hover:bg-primary hover:text-primary-foreground rounded-full transition-colors text-[#FDFBF7]/80 flex items-center justify-center text-xs font-bold font-sans" aria-label="Instagram">
                IG
              </a>
              <a href="#" className="h-9 w-9 bg-[#2C2D30] hover:bg-primary hover:text-primary-foreground rounded-full transition-colors text-[#FDFBF7]/80 flex items-center justify-center text-xs font-bold font-sans" aria-label="Twitter">
                X
              </a>
              <a href="#" className="h-9 w-9 bg-[#2C2D30] hover:bg-primary hover:text-primary-foreground rounded-full transition-colors text-[#FDFBF7]/80 flex items-center justify-center text-xs font-bold font-sans" aria-label="Facebook">
                FB
              </a>
            </div>
          </div>

          {/* Quick links columns */}
          <div>
            <h4 className="text-xs font-bold tracking-widest uppercase text-primary mb-5">Collections</h4>
            <ul className="space-y-3.5 text-sm text-[#FDFBF7]/70">
              {footerLinks.collections.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold tracking-widest uppercase text-primary mb-5">Customer Care</h4>
            <ul className="space-y-3.5 text-sm text-[#FDFBF7]/70">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold tracking-widest uppercase text-primary mb-5">Atelier</h4>
            <ul className="space-y-3.5 text-sm text-[#FDFBF7]/70">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Legal Bar */}
      <div className="w-full bg-[#17181A] text-center py-6 text-xs text-[#FDFBF7]/40 border-t border-[#FDFBF7]/5">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Pretty Threads Atelier. All rights reserved.</p>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
