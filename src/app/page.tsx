import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StatBanner from '@/components/ui/StatBanner';
import NotchedDivider from '@/components/ui/NotchedDivider';
import { db } from '@/lib/db';
import Link from 'next/link';
import { ArrowRight, Star, Quote, Check, Sparkles } from 'lucide-react';

export default function Home() {
  const products = db.getProducts();
  const featuredProducts = products.slice(0, 4); // Display first 4 as best sellers

  const pressLogos = [
    { name: 'VOGUE', desc: 'Arise in style' },
    { name: 'GQ', desc: 'Modern gentlemen' },
    { name: 'ARISE FASHION', desc: 'Global prints' },
    { name: 'BELLA NAIJA', desc: 'Elevated lifestyle' }
  ];

  const membershipTiers = [
    {
      name: 'Bronze Thread',
      price: 'Free',
      description: 'Start your style journey with essential perks.',
      features: [
        '5% reward points on every purchase',
        'Standard shipping on all orders',
        'Access to standard catalog and drops'
      ],
      cta: 'Join Free',
      active: false,
      popular: false
    },
    {
      name: 'Pretty Perks',
      price: '$10/mo',
      description: 'Elevate your wardrobe with early access and cash back.',
      features: [
        '10% reward points on every purchase',
        'Free standard shipping (no minimum)',
        '24-hour early access to capsule collections',
        'Exclusive members-only seasonal sales'
      ],
      cta: 'Get Perks',
      active: true,
      popular: true
    },
    {
      name: 'VIP Gold',
      price: '$25/mo',
      description: 'The ultimate luxury experience for fashion enthusiasts.',
      features: [
        '15% reward points on every purchase',
        'Complimentary express shipping',
        'Direct 1-on-1 text line with an Atelier Stylist',
        'Priority custom-tailoring slots',
        'Invitations to annual showroom previews'
      ],
      cta: 'Go VIP Gold',
      active: false,
      popular: false
    }
  ];

  const testimonials = [
    {
      name: 'Amina Yusuf',
      location: 'Abuja, Nigeria',
      quote: "The Modern Isi Agu Bomber is a work of art. The quality of the velvet and the custom hardware is unlike anything I've bought elsewhere. It is streetwear that commands respect.",
      rating: 5,
      image: 'Eccentric Woman by Nyore Eroyn - Nigeria.jpg'
    },
    {
      name: 'Tunde Adebayo',
      location: 'Lagos, Nigeria',
      quote: "Pretty Threads has completely redefined elevated casual wear for me. The Aso Oke trench is a masterpiece—it marries tradition and global modern styling flawlessly.",
      rating: 5,
      image: '26880929021915841.jpg'
    }
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Navigation */}
      <Header />

      <main className="flex-grow">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden bg-background py-12 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              
              {/* Left Column: Copywriting */}
              <div className="lg:col-span-6 space-y-8 animate-fade-in text-center lg:text-left">
                <div className="inline-flex items-center space-x-2 bg-muted px-4 py-1.5 rounded-full border border-border">
                  <Sparkles className="text-primary" size={16} />
                  <span className="text-xs font-semibold uppercase tracking-wider text-foreground">
                    Elevated Traditional Meets Modern Streetwear
                  </span>
                </div>
                
                <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
                  Boldly Crafted. <br />
                  <span className="text-primary font-normal italic">Effortlessly</span> Styled.
                </h1>
                
                <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed">
                  Pretty Threads designs premium, conversion-focused contemporary fashion blending rich traditional African textures with sleek modern silhouettes. Crafted for the confident and aspirational.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link
                    href="/shop"
                    className="inline-flex items-center justify-center gap-2 rounded-md bg-primary hover:bg-primary/95 text-primary-foreground font-semibold px-8 py-4 text-md transition-all shadow-md"
                  >
                    <span>Explore Collection</span>
                    <ArrowRight size={18} />
                  </Link>
                  <Link
                    href="/shop?category=Casuals"
                    className="inline-flex items-center justify-center gap-2 rounded-md bg-transparent border border-border hover:bg-muted text-foreground font-semibold px-8 py-4 text-md transition-all"
                  >
                    <span>View Lookbook</span>
                  </Link>
                </div>
              </div>

              {/* Right Column: Asymmetric Image Collage */}
              <div className="lg:col-span-6 relative h-[480px] sm:h-[540px] flex items-center justify-center">
                {/* Large Background Card */}
                <div className="absolute left-4 top-4 w-2/3 h-4/5 overflow-hidden rounded-lg shadow-xl border-4 border-background z-10 transform -rotate-3 notched-card hover:rotate-0 transition-all duration-300">
                  <img
                    src="/images/Loveth king styling - Nigeria 🇳🇬.jpg"
                    alt="Loveth King Styling Collection"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-border text-xs font-bold tracking-wide uppercase text-foreground">
                    Terracotta Kaftan
                  </div>
                </div>

                {/* Overlapping Secondary Card */}
                <div className="absolute right-4 bottom-4 w-1/2 h-3/4 overflow-hidden rounded-lg shadow-2xl border-4 border-background z-20 transform rotate-6 notched-card hover:rotate-0 transition-all duration-300">
                  <img
                    src="/images/Igbo attire - Isi agu 🇳🇬.jpg"
                    alt="Isi Agu Bomber Jacket"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-md">
                    New Drop
                  </div>
                  <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-sm px-3 py-1.5 rounded-full border border-border text-[11px] font-bold text-foreground">
                    Isi Agu Bomber
                  </div>
                </div>

                {/* Tiny Float badge */}
                <div className="absolute right-12 top-10 bg-background/95 backdrop-blur-sm border border-border p-3.5 rounded-xl shadow-lg z-30 transform -rotate-12 hidden sm:block">
                  <div className="flex items-center space-x-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">In Stock</span>
                  </div>
                  <p className="text-xs font-extrabold text-foreground mt-0.5">Hand-Woven</p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Press Strip */}
        <section className="bg-muted py-8 border-y border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="text-center text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-4">
              Featured in global fashion publications
            </p>
            <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16">
              {pressLogos.map((press, i) => (
                <div key={i} className="text-center group">
                  <span className="font-serif text-lg sm:text-xl font-black tracking-widest text-muted-foreground group-hover:text-primary transition-colors cursor-default">
                    {press.name}
                  </span>
                  <span className="block text-[8px] tracking-wider text-muted-foreground/50 uppercase">
                    {press.desc}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trust Stat Banner */}
        <StatBanner />

        {/* FEATURED BESTSELLERS SECTION */}
        <section className="py-24 bg-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-end justify-between mb-12">
              <div className="space-y-3">
                <span className="text-xs font-bold tracking-widest uppercase text-primary">Best Sellers</span>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                  The Atelier Favorites
                </h2>
              </div>
              <Link
                href="/shop"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/95 transition-colors group mt-4 md:mt-0"
              >
                <span>View Full Catalog</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.slug}`}
                  className="group block space-y-4"
                >
                  <div className="aspect-[3/4] w-full overflow-hidden rounded-md border border-border bg-muted relative notched-card">
                    <img
                      src={`/images/${product.images}`}
                      alt={product.name}
                      className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-4 right-4 bg-background/95 backdrop-blur-sm border border-border py-2 px-3.5 rounded-md text-xs font-bold text-primary shadow-sm">
                      ${product.price.toFixed(2)}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-primary">{product.category}</p>
                    <h3 className="font-serif text-lg font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {product.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Notched Section Divider */}
        <NotchedDivider color="bg-primary" height={12} direction="double" />

        {/* MEMBERSHIP TIER SECTION */}
        <section className="py-24 bg-muted/40">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
              <span className="text-xs font-bold tracking-widest uppercase text-primary">Atelier Loyalty</span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                Join the Pretty Threads Club
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Choose a membership tier to unlock tailored discounts, points multiplier tiers, complimentary express deliveries, and personal styling privileges.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {membershipTiers.map((tier) => (
                <div
                  key={tier.name}
                  className={`bg-card border rounded-lg p-8 relative flex flex-col justify-between shadow-sm notched-card ${
                    tier.popular ? 'border-primary ring-2 ring-primary/20' : 'border-border'
                  }`}
                >
                  {tier.popular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-md">
                      Most Popular
                    </div>
                  )}

                  <div className="space-y-6">
                    <div>
                      <h3 className="font-serif text-xl font-bold text-foreground">{tier.name}</h3>
                      <div className="mt-4 flex items-baseline">
                        <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">{tier.price}</span>
                      </div>
                      <p className="mt-2 text-xs text-muted-foreground">{tier.description}</p>
                    </div>

                    <ul className="space-y-4 border-t border-border pt-6">
                      {tier.features.map((feature, i) => (
                        <li key={i} className="flex items-start space-x-3 text-sm">
                          <Check className="text-primary flex-shrink-0 mt-0.5" size={16} />
                          <span className="text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-8 pt-6 border-t border-border">
                    <Link
                      href="/account"
                      className={`w-full inline-flex items-center justify-center rounded-md py-3 text-sm font-semibold transition-all shadow-sm ${
                        tier.popular
                          ? 'bg-primary hover:bg-primary/95 text-primary-foreground'
                          : 'bg-muted hover:bg-muted-foreground/10 text-foreground'
                      }`}
                    >
                      {tier.cta}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TESTIMONIALS SECTION */}
        <section className="py-24 bg-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-xl mx-auto space-y-4 mb-16">
              <span className="text-xs font-bold tracking-widest uppercase text-primary">Voices of Style</span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                What the Community Says
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {testimonials.map((t, idx) => (
                <div
                  key={idx}
                  className="bg-card border border-border p-8 rounded-lg flex flex-col justify-between shadow-sm relative notched-card"
                >
                  <Quote className="absolute right-8 top-8 text-primary/10" size={54} />
                  
                  <div className="space-y-6">
                    <div className="flex space-x-1">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} className="text-amber-500 fill-current" size={16} />
                      ))}
                    </div>
                    
                    <p className="text-sm italic text-muted-foreground leading-relaxed">
                      "{t.quote}"
                    </p>
                  </div>

                  <div className="flex items-center space-x-4 mt-8 pt-6 border-t border-border">
                    <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-full border border-primary bg-muted">
                      <img
                        src={`/images/${t.image}`}
                        alt={t.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-foreground">{t.name}</h4>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{t.location}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
