'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CreditCard, Truck, ShieldCheck, ShoppingBag, CheckCircle, ArrowLeft, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CheckoutPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const { cart, clearCart, user } = useStore();

  // Form states
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('Nigeria');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');

  // Discount Promo States
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoAppliedMsg, setPromoAppliedMsg] = useState('');

  // Flow states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successOrder, setSuccessOrder] = useState<any>(null);

  useEffect(() => {
    setIsMounted(true);
    if (user) {
      setEmail(user.email);
      setName(user.name);
    }
  }, [user]);

  // If not mounted yet
  if (!isMounted) return null;

  // Pricing calculations
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = subtotal * (discountPercent / 100);
  const shippingCost = subtotal > 150 ? 0 : 15.0; // Free shipping over $150
  const grandTotal = subtotal - discountAmount + shippingCost;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.toUpperCase() === 'PRETTY10') {
      setDiscountPercent(10);
      setPromoAppliedMsg('PRETTY10 code applied! Enjoy 10% off.');
      setErrorMessage('');
    } else {
      setErrorMessage('Invalid discount coupon code.');
      setPromoAppliedMsg('');
      setDiscountPercent(0);
    }
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      setErrorMessage('Your shopping cart is currently empty.');
      return;
    }
    if (!address || !city || !postalCode) {
      setErrorMessage('Please fill out all shipping details.');
      return;
    }
    if (cardNumber.length < 16 || cardExpiry.length < 4 || cardCvc.length < 3) {
      setErrorMessage('Please enter a valid credit card details.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id || null,
          guestEmail: !user ? email : null,
          guestName: !user ? name : null,
          shippingAddress: `${address}, ${city}, ${postalCode}, ${country}`,
          items: cart.map(item => ({
            variantId: item.id,
            quantity: item.quantity,
            price: item.price
          })),
          paymentMethod: 'Credit Card (Simulated Stripe)'
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessOrder(data.order);
        clearCart(); // empty cart state
      } else {
        setErrorMessage(data.error || 'Failed to complete checkout processing.');
      }
    } catch (error) {
      console.error(error);
      setErrorMessage('An error occurred during order routing.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />

      <main className="flex-grow py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <AnimatePresence mode="wait">
            {!successOrder ? (
              /* ACTIVE CHECKOUT LAYOUT VIEW */
              <motion.div
                key="checkout-form"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-10"
              >
                {/* Left Column: Form Blocks */}
                <div className="lg:col-span-7 space-y-8">
                  <div className="border-b border-border pb-4 flex items-center space-x-3">
                    <Link href="/shop" className="text-muted-foreground hover:text-primary transition-colors">
                      <ArrowLeft size={18} />
                    </Link>
                    <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-foreground">Secure Checkout</h1>
                  </div>

                  {errorMessage && (
                    <div className="flex items-center space-x-2 bg-red-50 border border-red-200 text-red-600 rounded-md p-4 text-xs font-semibold">
                      <AlertCircle size={16} className="flex-shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <form onSubmit={handleCheckoutSubmit} className="space-y-8">
                    {/* Step 1: Customer Contact Info */}
                    <div className="bg-card border border-border p-6 rounded-lg shadow-sm notched-card space-y-4">
                      <h2 className="text-sm font-bold tracking-widest uppercase text-primary flex items-center space-x-2">
                        <span className="h-5 w-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-[10px]">1</span>
                        <span>Customer Contact</span>
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-1">Full Name</label>
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            disabled={!!user}
                            placeholder="e.g. Chioma Bello"
                            className="w-full bg-background border border-border rounded-md px-3.5 py-2.5 text-xs text-foreground outline-none focus:border-primary disabled:opacity-60"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-1">Email Address</label>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={!!user}
                            placeholder="customer@prettythreads.com"
                            className="w-full bg-background border border-border rounded-md px-3.5 py-2.5 text-xs text-foreground outline-none focus:border-primary disabled:opacity-60"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Step 2: Shipping Address */}
                    <div className="bg-card border border-border p-6 rounded-lg shadow-sm notched-card space-y-4">
                      <h2 className="text-sm font-bold tracking-widest uppercase text-primary flex items-center space-x-2">
                        <span className="h-5 w-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-[10px]">2</span>
                        <span>Shipping Address</span>
                      </h2>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-1">Street Address</label>
                          <input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            required
                            placeholder="e.g. 15 Ikoyi Road, Flat 3B"
                            className="w-full bg-background border border-border rounded-md px-3.5 py-2.5 text-xs text-foreground outline-none focus:border-primary"
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="sm:col-span-2">
                            <label className="block text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-1">City / Region</label>
                            <input
                              type="text"
                              value={city}
                              onChange={(e) => setCity(e.target.value)}
                              required
                              placeholder="e.g. Lagos"
                              className="w-full bg-background border border-border rounded-md px-3.5 py-2.5 text-xs text-foreground outline-none focus:border-primary"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-1">Postal Code</label>
                            <input
                              type="text"
                              value={postalCode}
                              onChange={(e) => setPostalCode(e.target.value)}
                              required
                              placeholder="e.g. 101233"
                              className="w-full bg-background border border-border rounded-md px-3.5 py-2.5 text-xs text-foreground outline-none focus:border-primary"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-1">Country</label>
                          <select
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            className="w-full bg-background border border-border rounded-md px-3 py-2.5 text-xs text-foreground outline-none"
                          >
                            <option value="Nigeria">Nigeria</option>
                            <option value="United Kingdom">United Kingdom</option>
                            <option value="United States">United States</option>
                            <option value="Canada">Canada</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Step 3: Payment Card (Simulated Stripe) */}
                    <div className="bg-card border border-border p-6 rounded-lg shadow-sm notched-card space-y-4">
                      <h2 className="text-sm font-bold tracking-widest uppercase text-primary flex items-center space-x-2">
                        <span className="h-5 w-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-[10px]">3</span>
                        <span>Stripe Mock Payment Gateway</span>
                      </h2>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2 bg-muted/60 p-3 rounded border border-border text-[11px] text-muted-foreground leading-relaxed">
                          <ShieldCheck size={18} className="text-primary flex-shrink-0" />
                          <span>Demo Environment: You can enter any mock credit card credentials to approve the order checkout (e.g. 16 digits).</span>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-1">Credit Card Number</label>
                          <div className="relative">
                            <input
                              type="text"
                              placeholder="4242 4242 4242 4242"
                              maxLength={16}
                              value={cardNumber}
                              onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))}
                              required
                              className="w-full bg-background border border-border rounded-md pl-10 pr-3.5 py-2.5 text-xs text-foreground outline-none focus:border-primary"
                            />
                            <CreditCard size={16} className="absolute left-3.5 top-[13px] text-muted-foreground" />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-1">Expiration Date (MMYY)</label>
                            <input
                              type="text"
                              placeholder="MM/YY"
                              maxLength={4}
                              value={cardExpiry}
                              onChange={(e) => setCardExpiry(e.target.value.replace(/\D/g, ''))}
                              required
                              className="w-full bg-background border border-border rounded-md px-3.5 py-2.5 text-xs text-foreground outline-none focus:border-primary text-center"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-1">CVC Code</label>
                            <input
                              type="text"
                              placeholder="123"
                              maxLength={3}
                              value={cardCvc}
                              onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, ''))}
                              required
                              className="w-full bg-background border border-border rounded-md px-3.5 py-2.5 text-xs text-foreground outline-none focus:border-primary text-center"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-primary hover:bg-primary/95 disabled:bg-muted text-primary-foreground font-semibold py-4 text-sm transition-all shadow-md"
                    >
                      {isSubmitting ? (
                        <span>Processing simulated transaction...</span>
                      ) : (
                        <>
                          <ShieldCheck size={18} />
                          <span>Place Secure Payment Order (${grandTotal.toFixed(2)})</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>

                {/* Right Column: Order Items Summary */}
                <div className="lg:col-span-5 space-y-6">
                  <div className="bg-card border border-border rounded-lg p-6 shadow-sm notched-card space-y-6">
                    <h3 className="font-serif text-lg font-bold text-foreground border-b border-border/80 pb-3 flex items-center space-x-2">
                      <ShoppingBag className="text-primary" size={20} />
                      <span>Order Summary</span>
                    </h3>

                    {/* Cart Items List */}
                    {cart.length === 0 ? (
                      <p className="text-sm text-muted-foreground italic">Your cart is empty.</p>
                    ) : (
                      <div className="divide-y divide-border/40 max-h-80 overflow-y-auto pr-2 space-y-3.5">
                        {cart.map((item) => (
                          <div key={item.id} className="flex items-center space-x-3 pt-3.5 first:pt-0">
                            <div className="h-16 w-12 flex-shrink-0 overflow-hidden rounded border border-border bg-muted">
                              <img src={`/images/${item.image}`} alt={item.name} className="h-full w-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-xs font-bold text-foreground truncate">{item.name}</h4>
                              <p className="text-[10px] text-muted-foreground mt-0.5">Size: {item.size} | Color: {item.color}</p>
                              <p className="text-[10px] text-muted-foreground">Qty: {item.quantity}</p>
                            </div>
                            <span className="text-xs font-semibold text-primary">${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Promo Coupon Form */}
                    <form onSubmit={handleApplyPromo} className="flex space-x-2 border-t border-border/40 pt-6">
                      <input
                        type="text"
                        placeholder="Coupon (e.g. PRETTY10)"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        className="w-full bg-background border border-border rounded-md px-3.5 py-2 text-xs text-foreground outline-none focus:border-primary"
                      />
                      <button
                        type="submit"
                        className="bg-secondary text-secondary-foreground font-semibold px-4 rounded-md text-xs hover:bg-secondary/90 transition-colors"
                      >
                        Apply
                      </button>
                    </form>
                    {promoAppliedMsg && (
                      <p className="text-[10px] text-green-600 font-bold flex items-center space-x-1">
                        <Sparkles size={12} />
                        <span>{promoAppliedMsg}</span>
                      </p>
                    )}

                    {/* Pricing calculations details */}
                    <div className="border-t border-border/50 pt-6 space-y-3.5 text-xs text-muted-foreground">
                      <div className="flex justify-between">
                        <span>Cart Subtotal</span>
                        <span className="font-medium text-foreground">${subtotal.toFixed(2)}</span>
                      </div>
                      
                      {discountPercent > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Discount ({discountPercent}%)</span>
                          <span>-${discountAmount.toFixed(2)}</span>
                        </div>
                      )}

                      <div className="flex justify-between">
                        <span>Atelier Shipping</span>
                        <span className="font-medium text-foreground">
                          {shippingCost === 0 ? 'Free Shipping' : `$${shippingCost.toFixed(2)}`}
                        </span>
                      </div>

                      <div className="border-t border-border pt-4 flex justify-between text-sm font-bold text-foreground">
                        <span>Total Checkout Payment</span>
                        <span className="text-primary text-md">${grandTotal.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              /* ORDER CONFIRMATION VIEW SCREEN */
              <motion.div
                key="confirmation"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-2xl mx-auto text-center py-16 px-6 bg-card border border-border rounded-lg shadow-lg notched-card space-y-6"
              >
                <div className="inline-flex p-3 bg-green-50 rounded-full border border-green-200 text-green-600 mb-2">
                  <CheckCircle size={48} className="animate-bounce" />
                </div>
                <h1 className="font-serif text-3xl font-bold text-foreground">Order Successfully Logged!</h1>
                <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                  Thank you for shopping at **Pretty Threads**. Your payment transaction was simulated successfully, and your inventory stock has been held.
                </p>

                {/* Details Log */}
                <div className="bg-background border border-border rounded-lg p-5 text-left text-xs max-w-md mx-auto space-y-3 font-semibold text-muted-foreground">
                  <div className="flex justify-between text-foreground">
                    <span>Order ID Reference:</span>
                    <span className="font-bold text-primary">{successOrder.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment status:</span>
                    <span className="text-green-600 font-bold">{successOrder.paymentStatus}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping Address:</span>
                    <span className="text-right truncate max-w-xs">{successOrder.shippingAddress}</span>
                  </div>
                  <div className="flex justify-between text-foreground border-t border-border/80 pt-3">
                    <span>Grand Total Billed:</span>
                    <span className="font-bold text-primary text-sm">${successOrder.total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                  <Link
                    href="/account"
                    className="inline-flex items-center justify-center gap-2 rounded-md bg-primary hover:bg-primary/95 text-primary-foreground font-semibold px-6 py-3 text-sm transition-all shadow-md"
                  >
                    <span>Go Track Order</span>
                    <ArrowRight size={16} />
                  </Link>
                  <Link
                    href="/shop"
                    className="inline-flex items-center justify-center gap-2 rounded-md bg-transparent border border-border hover:bg-muted text-foreground font-semibold px-6 py-3 text-sm transition-all"
                  >
                    <span>Continue Window Shopping</span>
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </main>

      <Footer />
    </div>
  );
}
