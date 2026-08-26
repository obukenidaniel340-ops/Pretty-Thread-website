'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useStore } from '@/store/useStore';
import { Star, Heart, ShoppingBag, Truck, RotateCcw, AlertTriangle, Check, ArrowLeft, MessageSquare, ShieldCheck, Sparkles, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Variant {
  id: string;
  size: string;
  color: string;
  sku: string;
  stock: number;
  priceOverride?: number | null;
}

interface Review {
  id: string;
  userName: string;
  rating: number;
  text: string;
  createdAt: string;
}

interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string;
  variants: Variant[];
  reviews: Review[];
}

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Omit<Product, 'variants' | 'reviews'>[];
}

export default function ProductDetailClient({
  product,
  relatedProducts
}: ProductDetailClientProps) {
  const { addToCart, toggleWishlist, isInWishlist } = useStore();

  // Selected state
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  
  // Custom toast notification state
  const [toastMessage, setToastMessage] = useState('');
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  // Reviews state (client side update after submission)
  const [reviews, setReviews] = useState<Review[]>(product.reviews);
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  // Extract unique colors and sizes available for this product
  const uniqueSizes = Array.from(new Set(product.variants.map((v) => v.size)));
  const uniqueColors = Array.from(new Set(product.variants.map((v) => v.color)));

  // Auto-select first size and color on load
  useEffect(() => {
    if (uniqueSizes.length > 0) setSelectedSize(uniqueSizes[0]);
    if (uniqueColors.length > 0) setSelectedColor(uniqueColors[0]);
  }, [product]);

  // Match variant whenever size or color changes
  useEffect(() => {
    if (selectedSize && selectedColor) {
      const match = product.variants.find(
        (v) => v.size === selectedSize && v.color === selectedColor
      );
      setSelectedVariant(match || null);
    }
  }, [selectedSize, selectedColor, product]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleAddToCart = () => {
    if (!selectedVariant) {
      showToast('Please select a size and color');
      return;
    }
    if (selectedVariant.stock <= 0) {
      showToast('This variant is currently sold out');
      return;
    }

    addToCart({
      id: selectedVariant.id,
      productId: product.id,
      name: product.name,
      image: product.images,
      size: selectedVariant.size,
      color: selectedVariant.color,
      price: selectedVariant.priceOverride || product.price,
      sku: selectedVariant.sku,
    });
    showToast(`Added ${product.name} (${selectedVariant.size} / ${selectedVariant.color}) to bag!`);
  };

  const handleToggleWishlist = () => {
    toggleWishlist(product.id);
    const inWish = isInWishlist(product.id);
    showToast(
      inWish 
        ? `Removed ${product.name} from wishlist.` 
        : `Added ${product.name} to wishlist.`
    );
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName || !reviewText) {
      showToast('Please fill out all review fields.');
      return;
    }

    setReviewSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'usr_customer', // simulated logged-in user
          userName: reviewName,
          productId: product.id,
          rating: reviewRating,
          text: reviewText
        })
      });

      const data = await res.json();
      if (data.success) {
        setReviews([data.review, ...reviews]);
        setReviewText('');
        showToast('Review submitted successfully!');
      } else {
        showToast(data.error || 'Failed to submit review.');
      }
    } catch (error) {
      console.error(error);
      showToast('An error occurred submitting your review.');
    } finally {
      setReviewSubmitting(false);
    }
  };

  const isFavorited = isInWishlist(product.id);
  const currentPrice = selectedVariant?.priceOverride || product.price;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 relative">
      {/* Toast Alert */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 bg-[#1F2022] text-[#FDFBF7] px-5 py-3 rounded-lg shadow-xl border border-primary/20 flex items-center space-x-2.5 text-xs font-semibold tracking-wide"
          >
            <Sparkles className="text-primary animate-pulse" size={16} />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Back button */}
      <Link
        href="/shop"
        className="inline-flex items-center space-x-2 text-xs font-bold tracking-widest uppercase text-muted-foreground hover:text-primary transition-colors mb-8"
      >
        <ArrowLeft size={14} />
        <span>Back to catalog</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        
        {/* Left Side: Product Gallery */}
        <div className="lg:col-span-7 space-y-6">
          <div className="aspect-[3/4] w-full overflow-hidden rounded-lg border border-border bg-card relative notched-card shadow-sm">
            <img
              src={`/images/${product.images}`}
              alt={product.name}
              className="h-full w-full object-cover object-center"
            />
            {selectedVariant && selectedVariant.stock <= 0 && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <span className="bg-red-500 text-white font-bold uppercase tracking-widest text-xs px-6 py-2 rounded shadow-md">
                  Sold Out
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Product Details & Purchase Form */}
        <div className="lg:col-span-5 space-y-8">
          <div className="space-y-4">
            <p className="text-xs font-bold tracking-widest uppercase text-primary">{product.category}</p>
            <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-foreground leading-tight">{product.name}</h1>
            
            {/* Price & Rating */}
            <div className="flex items-center space-x-4 border-b border-border/60 pb-6">
              <span className="text-2xl font-bold text-primary">${currentPrice.toFixed(2)}</span>
              <div className="h-4 w-px bg-border" />
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="text-amber-500 fill-current" size={15} />
                ))}
                <span className="text-xs text-muted-foreground ml-1.5">({reviews.length} Verified Reviews)</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground leading-relaxed">
            {product.description}
          </p>

          {/* Variant Forms */}
          <div className="space-y-6">
            
            {/* Colors Selectors */}
            {uniqueColors.length > 0 && (
              <div className="space-y-2.5">
                <span className="text-xs font-bold tracking-widest uppercase text-muted-foreground">Select Color: {selectedColor}</span>
                <div className="flex space-x-3">
                  {uniqueColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 border text-xs font-bold rounded-md uppercase tracking-wide transition-all ${
                        selectedColor === color
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-border bg-card text-muted-foreground hover:border-foreground'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes Selectors */}
            {uniqueSizes.length > 0 && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold tracking-widest uppercase text-muted-foreground">Select Size</span>
                  <button
                    onClick={() => setIsSizeGuideOpen(true)}
                    className="text-xs text-primary hover:underline font-bold"
                  >
                    Size Guide
                  </button>
                </div>
                <div className="flex space-x-3">
                  {uniqueSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`h-11 w-11 border rounded-md flex items-center justify-center text-xs font-bold transition-all ${
                        selectedSize === size
                          ? 'border-primary bg-primary text-primary-foreground shadow-md'
                          : 'border-border bg-card text-foreground hover:border-foreground'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Dynamic Stock Level Indicator */}
            {selectedVariant && (
              <div className="py-2.5 px-4 bg-muted/40 rounded-md border border-border/50 text-xs flex items-center justify-between">
                <span className="font-semibold text-muted-foreground">Variant SKU: {selectedVariant.sku}</span>
                <span className="flex items-center space-x-1.5 font-bold">
                  {selectedVariant.stock <= 0 ? (
                    <>
                      <AlertTriangle className="text-red-500" size={14} />
                      <span className="text-red-500 uppercase">Sold Out</span>
                    </>
                  ) : selectedVariant.stock <= 5 ? (
                    <>
                      <AlertTriangle className="text-amber-500" size={14} />
                      <span className="text-amber-500">Low Stock: Only {selectedVariant.stock} left!</span>
                    </>
                  ) : (
                    <>
                      <Check className="text-green-600" size={14} />
                      <span className="text-green-600">{selectedVariant.stock} In Stock</span>
                    </>
                  )}
                </span>
              </div>
            )}

            {/* Add to Cart & Wishlist Trigger Bar */}
            <div className="flex space-x-4 pt-4">
              <button
                onClick={handleAddToCart}
                disabled={!selectedVariant || selectedVariant.stock <= 0}
                className="flex-1 flex items-center justify-center gap-2 bg-primary hover:bg-primary/95 disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed text-primary-foreground font-semibold py-4 rounded-md transition-all shadow-md"
              >
                <ShoppingBag size={18} />
                <span>Add to Shopping Bag</span>
              </button>
              
              <button
                onClick={handleToggleWishlist}
                className={`p-4 border rounded-md transition-all flex items-center justify-center ${
                  isFavorited
                    ? 'border-red-200 bg-red-50 text-red-500 hover:bg-red-100'
                    : 'border-border bg-card text-muted-foreground hover:border-foreground'
                }`}
                aria-label="Wishlist Toggle"
              >
                <Heart size={20} className={isFavorited ? 'fill-current' : ''} />
              </button>
            </div>

          </div>

          {/* Delivery & Accordion Disclosures (using HTML details/summary natively!) */}
          <div className="space-y-3.5 border-t border-border pt-8">
            <details name="info-accordion" className="group border border-border rounded-md bg-card overflow-hidden">
              <summary className="flex items-center justify-between px-4 py-3.5 text-sm font-semibold uppercase tracking-wider text-foreground cursor-pointer hover:bg-muted/50 select-none list-none">
                <span>Fabric & Care Details</span>
                <span className="text-xs transition-transform group-open:rotate-180">▼</span>
              </summary>
              <div className="p-4 border-t border-border text-xs text-muted-foreground leading-relaxed space-y-2">
                <p>Designed with premium breathable fabrics celebrating regional textures and colors.</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Dry clean highly recommended to preserve embroidery and fabric luster.</li>
                  <li>Cool iron on reverse side. Do not bleach.</li>
                  <li>Made with pride and premium craftsmanship.</li>
                </ul>
              </div>
            </details>

            <details name="info-accordion" className="group border border-border rounded-md bg-card overflow-hidden">
              <summary className="flex items-center justify-between px-4 py-3.5 text-sm font-semibold uppercase tracking-wider text-foreground cursor-pointer hover:bg-muted/50 select-none list-none">
                <span>Complimentary Delivery & Returns</span>
                <span className="text-xs transition-transform group-open:rotate-180">▼</span>
              </summary>
              <div className="p-4 border-t border-border text-xs text-muted-foreground space-y-3 leading-relaxed">
                <div className="flex items-start space-x-2.5">
                  <Truck className="text-primary flex-shrink-0 mt-0.5" size={16} />
                  <div>
                    <p className="font-bold text-foreground">Standard Delivery: Free</p>
                    <p>Deliveries are shipped within 2-3 business days. Free standard shipping applies globally.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2.5">
                  <RotateCcw className="text-primary flex-shrink-0 mt-0.5" size={16} />
                  <div>
                    <p className="font-bold text-foreground">Returns & Exchanges: Free within 30 Days</p>
                    <p>Returns on unused items in original packaging are fully supported. Simply initiate a returns request.</p>
                  </div>
                </div>
              </div>
            </details>
          </div>

        </div>
      </div>

      {/* REVIEWS & RATINGS BLOCK */}
      <section className="py-16 border-t border-border mt-20">
        <h2 className="font-serif text-2xl font-bold text-foreground mb-10 flex items-center space-x-2">
          <MessageSquare className="text-primary" size={22} />
          <span>Customer Reviews & Feedback</span>
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Reviews List */}
          <div className="lg:col-span-7 space-y-6">
            {reviews.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">No reviews have been written for this product yet. Be the first to share your thoughts!</p>
            ) : (
              reviews.map((rev) => (
                <div key={rev.id} className="bg-card border border-border p-6 rounded-lg space-y-3 shadow-sm notched-card-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-bold text-foreground">{rev.userName}</h4>
                      <p className="text-[10px] text-muted-foreground">Verified Purchase | {new Date(rev.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex space-x-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3.5 w-3.5 ${
                            i < rev.rating ? 'text-amber-500 fill-current' : 'text-muted-foreground/30'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    "{rev.text}"
                  </p>
                </div>
              ))
            )}
          </div>

          {/* Add Review Form */}
          <div className="lg:col-span-5 bg-card border border-border p-6 rounded-lg shadow-sm notched-card">
            <h3 className="font-serif text-lg font-bold text-foreground mb-4">Write a Product Review</h3>
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-1">Your Name</label>
                <input
                  type="text"
                  placeholder="e.g. Chioma Bello"
                  value={reviewName}
                  onChange={(e) => setReviewName(e.target.value)}
                  className="w-full bg-background border border-border rounded-md px-3.5 py-2 text-xs text-foreground outline-none focus:border-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-1">Star Rating</label>
                <select
                  value={reviewRating}
                  onChange={(e) => setReviewRating(parseInt(e.target.value))}
                  className="bg-background border border-border rounded-md px-3 py-2 text-xs text-foreground outline-none"
                >
                  <option value="5">5 Stars (Excellent)</option>
                  <option value="4">4 Stars (Good)</option>
                  <option value="3">3 Stars (Average)</option>
                  <option value="2">2 Stars (Poor)</option>
                  <option value="1">1 Star (Very Poor)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-1">Your Feedback</label>
                <textarea
                  placeholder="Tell us what you loved about this piece..."
                  rows={4}
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  className="w-full bg-background border border-border rounded-md px-3.5 py-2 text-xs text-foreground outline-none focus:border-primary resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={reviewSubmitting}
                className="w-full bg-primary hover:bg-primary/95 disabled:bg-muted text-primary-foreground font-semibold py-2.5 rounded-md text-xs transition-colors shadow-sm"
              >
                {reviewSubmitting ? 'Submitting Review...' : 'Submit Feedback'}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* RELATED PRODUCTS */}
      {relatedProducts.length > 0 && (
        <section className="py-16 border-t border-border mt-10">
          <h2 className="font-serif text-2xl font-bold text-foreground mb-8">Related Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <Link key={p.id} href={`/product/${p.slug}`} className="group space-y-3 block">
                <div className="aspect-[3/4] w-full overflow-hidden rounded-md border border-border bg-muted relative notched-card-sm">
                  <img
                    src={`/images/${p.images}`}
                    alt={p.name}
                    className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div>
                  <h3 className="font-serif text-sm font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                    {p.name}
                  </h3>
                  <span className="text-xs font-bold text-primary">${p.price.toFixed(2)}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Size Guide Modal */}
      <AnimatePresence>
        {isSizeGuideOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSizeGuideOpen(false)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-x-4 top-[15%] sm:mx-auto sm:max-w-md bg-background border border-border p-6 rounded-lg shadow-2xl z-50 notched-card space-y-4"
            >
              <div className="flex justify-between items-center border-b border-border pb-3">
                <h3 className="font-serif text-lg font-bold text-foreground">Atelier Size Chart</h3>
                <button
                  onClick={() => setIsSizeGuideOpen(false)}
                  className="p-1 rounded-full text-muted-foreground hover:bg-muted"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="overflow-x-auto text-xs">
                <table className="w-full border-collapse border border-border text-center">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="border border-border p-2 font-semibold">Size</th>
                      <th className="border border-border p-2 font-semibold">Bust (in)</th>
                      <th className="border border-border p-2 font-semibold">Waist (in)</th>
                      <th className="border border-border p-2 font-semibold">Hips (in)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-border p-2 font-bold">S</td>
                      <td className="border border-border p-2">32-34</td>
                      <td className="border border-border p-2">24-26</td>
                      <td className="border border-border p-2">34-36</td>
                    </tr>
                    <tr className="bg-muted/20">
                      <td className="border border-border p-2 font-bold">M</td>
                      <td className="border border-border p-2">35-37</td>
                      <td className="border border-border p-2">27-29</td>
                      <td className="border border-border p-2">37-39</td>
                    </tr>
                    <tr>
                      <td className="border border-border p-2 font-bold">L</td>
                      <td className="border border-border p-2">38-40</td>
                      <td className="border border-border p-2">30-32</td>
                      <td className="border border-border p-2">40-42</td>
                    </tr>
                    <tr className="bg-muted/20">
                      <td className="border border-border p-2 font-bold">XL</td>
                      <td className="border border-border p-2">41-43</td>
                      <td className="border border-border p-2">33-35</td>
                      <td className="border border-border p-2">43-45</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="text-[10px] text-muted-foreground leading-relaxed italic">
                *Fits may vary depending on the silhouette and fabric. The Kaftans and Agbadas are designed for a relaxed drape.
              </p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
