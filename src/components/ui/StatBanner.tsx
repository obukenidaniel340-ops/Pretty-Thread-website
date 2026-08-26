import React from 'react';
import { Users, Star, RotateCcw, ShieldCheck } from 'lucide-react';

export default function StatBanner() {
  const stats = [
    {
      icon: <Users className="text-primary-foreground" size={24} />,
      value: '50K+',
      label: 'Happy Customers Worldwide'
    },
    {
      icon: <Star className="text-primary-foreground fill-current" size={24} />,
      value: '4.9★',
      label: 'Average Customer Rating'
    },
    {
      icon: <RotateCcw className="text-primary-foreground" size={24} />,
      value: '30 Days',
      label: 'Free Returns & Exchanges'
    },
    {
      icon: <ShieldCheck className="text-primary-foreground" size={24} />,
      value: '100%',
      label: 'Secure Mock Payment Checkouts'
    }
  ];

  return (
    <section className="w-full bg-primary text-primary-foreground relative py-10 notched-banner-double z-10 -mt-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-primary-foreground/20">
          {stats.map((stat, i) => (
            <div 
              key={i} 
              className={`flex flex-col items-center justify-center text-center px-4 ${
                i > 1 ? 'pt-6 md:pt-0' : ''
              }`}
            >
              <div className="mb-2 p-2.5 rounded-full bg-background/10 backdrop-blur-sm">
                {stat.icon}
              </div>
              <span className="font-serif text-2xl sm:text-3xl font-extrabold tracking-tight">
                {stat.value}
              </span>
              <span className="mt-1 text-xs tracking-wider uppercase text-primary-foreground/80 font-medium">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
