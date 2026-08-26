'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { ShoppingBag, Heart, User, Search, X, Plus, Minus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const {
    cart,
    wishlist,
    isCartOpen,
    setCartOpen,
    toggleCart,
    updateQuantity,
    removeFromCart,
    user,
    setSearchQuery
  } = useStore();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const cartItemsCount = isMounted ? cart.reduce((sum, item) => sum + item.quantity, 0) : 0;
  const wishlistCount = isMounted ? wishlist.length : 0;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchValue);
    router.push(`/shop?search=${encodeURIComponent(searchValue)}`);
    setIsSearchOpen(false);
  };

  const handleCheckoutRedirect = () => {
    setCartOpen(false);
    router.push('/checkout');
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/shop', label: 'Shop' },
    { href: '/account', label: 'My Account' },
    { href: '/admin', label: 'Admin Portal' }
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            {/* Logo */}
            <div className="flex-1 lg:flex-none">
              <Link href="/" className="font-serif text-2xl font-bold tracking-tight text-foreground sm:text-3xl hover:text-primary transition-colors">
                Pretty Threads<span className="text-primary">.</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex lg:space-x-8">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-sm font-medium tracking-wide transition-colors duration-200 hover:text-primary ${
                      isActive ? 'text-primary border-b-2 border-primary pb-1' : 'text-muted-foreground'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Actions */}
            <div className="flex flex-1 items-center justify-end space-x-6">
              {/* Search Toggle */}
              <div className="relative">
                <button
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="p-2 text-foreground hover:text-primary transition-colors"
                  aria-label="Toggle Search"
                >
                  <Search size={22} />
                </button>
              </div>

              {/* Wishlist Link */}
              <Link href="/account" className="relative p-2 text-foreground hover:text-primary transition-colors" aria-label="Wishlist">
                <Heart size={22} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Account Link */}
              <Link href="/account" className="p-2 text-foreground hover:text-primary transition-colors" aria-label="Account">
                <User size={22} />
              </Link>

              {/* Cart Button */}
              <button
                onClick={toggleCart}
                className="relative p-2 text-foreground hover:text-primary transition-colors"
                aria-label="Shopping Cart"
              >
                <ShoppingBag size={22} />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                    {cartItemsCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Floating Search Bar dropdown */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute left-0 right-0 top-full border-b border-border bg-background p-4 shadow-md"
            >
              <form onSubmit={handleSearchSubmit} className="mx-auto max-w-3xl flex items-center space-x-2">
                <Search size={20} className="text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search collections, fabrics, sizes..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="w-full bg-transparent py-2 text-foreground outline-none placeholder:text-muted-foreground"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  className="p-2 text-muted-foreground hover:text-foreground"
                >
                  <X size={20} />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setCartOpen(false)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            />

            {/* Sliding Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed bottom-0 right-0 top-0 z-50 flex h-full w-full flex-col bg-background shadow-2xl sm:max-w-md"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border px-6 py-5">
                <div className="flex items-center space-x-2">
                  <ShoppingBag className="text-primary" size={22} />
                  <h2 className="text-lg font-semibold text-foreground">Your Shopping Bag ({cartItemsCount})</h2>
                </div>
                <button
                  onClick={() => setCartOpen(false)}
                  className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {!isMounted || cart.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center text-center space-y-4">
                    <ShoppingBag size={48} className="text-muted-foreground/40" />
                    <p className="text-muted-foreground">Your shopping cart is currently empty.</p>
                    <Link
                      href="/shop"
                      onClick={() => setCartOpen(false)}
                      className="rounded-md bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/95 transition-colors"
                    >
                      Shop New Arrivals
                    </Link>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div key={item.id} className="flex space-x-4 border-b border-border/50 pb-6">
                      <div className="h-24 w-20 flex-shrink-0 overflow-hidden rounded-md border border-border bg-muted">
                        <img
                          src={`/images/${item.image}`}
                          alt={item.name}
                          className="h-full w-full object-cover object-center"
                        />
                      </div>
                      <div className="flex flex-1 flex-col">
                        <div className="flex justify-between text-base font-medium text-foreground">
                          <h3 className="line-clamp-1 font-serif text-md">{item.name}</h3>
                          <p className="ml-4 font-semibold text-primary">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Size: {item.size} | Color: {item.color}
                        </p>
                        <div className="flex flex-1 items-end justify-between text-sm">
                          {/* Quantity selector */}
                          <div className="flex items-center border border-border rounded-md bg-muted/30">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-1.5 text-muted-foreground hover:text-foreground"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="px-2.5 font-medium text-foreground text-xs">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1.5 text-muted-foreground hover:text-foreground"
                            >
                              <Plus size={14} />
                            </button>
                          </div>

                          {/* Remove button */}
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="flex items-center space-x-1 text-red-500 hover:text-red-700 transition-colors py-1 px-2 rounded-md hover:bg-red-50/50"
                          >
                            <Trash2 size={15} />
                            <span className="text-xs font-medium">Remove</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer Summary */}
              {isMounted && cart.length > 0 && (
                <div className="border-t border-border bg-muted/10 p-6 space-y-4">
                  <div className="flex justify-between text-base font-semibold text-foreground">
                    <p>Estimated Subtotal</p>
                    <p className="text-lg font-bold text-primary">${subtotal.toFixed(2)}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Shipping costs and taxes are calculated at checkout.
                  </p>
                  <div className="space-y-3">
                    <button
                      onClick={handleCheckoutRedirect}
                      className="w-full flex justify-center items-center rounded-md bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-md hover:bg-primary/95 transition-all"
                    >
                      Proceed to Checkout
                    </button>
                    <button
                      onClick={() => setCartOpen(false)}
                      className="w-full text-center text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors py-1.5"
                    >
                      Or Continue Window Shopping
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
