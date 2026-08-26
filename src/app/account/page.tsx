'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useStore } from '@/store/useStore';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ShoppingBag, Heart, MapPin, Settings, Package, Truck, Check, Eye, Trash2, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AccountPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist' | 'address' | 'settings'>('orders');
  const { user, wishlist, toggleWishlist } = useStore();

  // Orders list state
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Address form states
  const [savedAddresses, setSavedAddresses] = useState([
    { id: 'addr_1', type: 'Primary Home', address: '15 Ikoyi Road, Flat 3B, Lagos, Nigeria' }
  ]);
  const [newAddress, setNewAddress] = useState('');
  const [newAddressType, setNewAddressType] = useState('Home');

  // Fetch orders on mount
  useEffect(() => {
    setIsMounted(true);
    const fetchOrders = async () => {
      if (!user) return;
      try {
        const res = await fetch(`/api/orders?userId=${user.id}`);
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setLoadingOrders(false);
      }
    };
    fetchOrders();
  }, [user]);

  // Wishlist products fetching
  // Pre-seed catalog list to render items
  const [catalogProducts, setCatalogProducts] = useState<any[]>([]);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const data = await res.json();
          setCatalogProducts(data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchProducts();
  }, []);

  if (!isMounted || !user) return null;

  // Filter products in wishlist
  const wishlistItems = catalogProducts.filter(p => wishlist.includes(p.id));

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddress) return;
    setSavedAddresses([
      ...savedAddresses,
      { id: 'addr_' + Date.now(), type: newAddressType, address: newAddress }
    ]);
    setNewAddress('');
  };

  const handleDeleteAddress = (id: string) => {
    setSavedAddresses(savedAddresses.filter(a => a.id !== id));
  };

  // Shipping Status Helper
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'text-amber-500 bg-amber-50 border-amber-200';
      case 'PAID': return 'text-green-600 bg-green-50 border-green-200';
      case 'SHIPPED': return 'text-blue-500 bg-blue-50 border-blue-200';
      case 'DELIVERED': return 'text-gray-600 bg-gray-50 border-gray-200';
      default: return 'text-red-500 bg-red-50 border-red-200';
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />

      <main className="flex-grow py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Layout header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-border pb-8 mb-8 gap-4">
            <div>
              <span className="text-xs font-bold tracking-widest uppercase text-primary">Member Center</span>
              <h1 className="font-serif text-3xl font-extrabold text-foreground">Hello, {user.name}</h1>
              <p className="text-xs text-muted-foreground mt-1">Pretty Perks Tier Level Member | 1,250 loyalty reward points</p>
            </div>
            
            {/* Quick stats cards */}
            <div className="flex space-x-3 text-center text-xs">
              <div className="border border-border bg-card p-3 rounded-md w-24 sm:w-28 shadow-sm">
                <p className="text-muted-foreground">Orders Made</p>
                <p className="font-bold text-lg text-primary mt-0.5">{orders.length}</p>
              </div>
              <div className="border border-border bg-card p-3 rounded-md w-24 sm:w-28 shadow-sm">
                <p className="text-muted-foreground">Wishlist</p>
                <p className="font-bold text-lg text-primary mt-0.5">{wishlistItems.length}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Sidebar Navigation */}
            <aside className="lg:col-span-3">
              <nav className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible border border-border bg-card p-2 rounded-lg gap-1 shadow-sm notched-card">
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`flex items-center space-x-2.5 text-xs font-bold uppercase tracking-wider px-4 py-3 rounded-md transition-all whitespace-nowrap lg:w-full ${
                    activeTab === 'orders'
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <Package size={16} />
                  <span>Order Log ({orders.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('wishlist')}
                  className={`flex items-center space-x-2.5 text-xs font-bold uppercase tracking-wider px-4 py-3 rounded-md transition-all whitespace-nowrap lg:w-full ${
                    activeTab === 'wishlist'
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <Heart size={16} />
                  <span>My Wishlist ({wishlistItems.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('address')}
                  className={`flex items-center space-x-2.5 text-xs font-bold uppercase tracking-wider px-4 py-3 rounded-md transition-all whitespace-nowrap lg:w-full ${
                    activeTab === 'address'
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <MapPin size={16} />
                  <span>Saved Addresses</span>
                </button>

                <button
                  onClick={() => setActiveTab('settings')}
                  className={`flex items-center space-x-2.5 text-xs font-bold uppercase tracking-wider px-4 py-3 rounded-md transition-all whitespace-nowrap lg:w-full ${
                    activeTab === 'settings'
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <Settings size={16} />
                  <span>Profile Settings</span>
                </button>
              </nav>
            </aside>

            {/* Main Tabs Content */}
            <div className="lg:col-span-9">
              <AnimatePresence mode="wait">
                
                {/* 1. ORDERS LOG TAB */}
                {activeTab === 'orders' && (
                  <motion.div
                    key="orders"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    <h2 className="font-serif text-xl font-bold text-foreground flex items-center space-x-2">
                      <Package className="text-primary" size={20} />
                      <span>Order Logs & Shipping Statuses</span>
                    </h2>

                    {loadingOrders ? (
                      <div className="space-y-4">
                        {[...Array(2)].map((_, i) => (
                          <div key={i} className="animate-pulse h-40 bg-card border border-border rounded-lg" />
                        ))}
                      </div>
                    ) : orders.length === 0 ? (
                      <div className="text-center py-16 bg-card border border-border rounded-lg p-6 space-y-4 notched-card max-w-md mx-auto mt-6">
                        <ShoppingBag className="mx-auto text-muted-foreground/35" size={48} />
                        <h3 className="font-serif text-lg font-bold text-foreground">No orders logged yet</h3>
                        <p className="text-xs text-muted-foreground">
                          Once you place a checkout order, it will appear here with delivery updates.
                        </p>
                        <Link href="/shop" className="inline-block bg-primary text-primary-foreground font-semibold px-5 py-2 rounded-md text-xs hover:bg-primary/95 transition-all shadow-sm">
                          Go shopping
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {orders.map((order) => (
                          <div key={order.id} className="bg-card border border-border rounded-lg shadow-sm overflow-hidden notched-card">
                            {/* Order Header Summary */}
                            <div className="border-b border-border bg-muted/20 p-4 sm:px-6 flex flex-wrap items-center justify-between gap-4 text-xs">
                              <div>
                                <p className="text-muted-foreground font-semibold uppercase tracking-wider">Order Reference ID</p>
                                <p className="font-bold text-foreground mt-0.5">{order.id}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground font-semibold uppercase tracking-wider">Date Placed</p>
                                <p className="font-bold text-foreground mt-0.5">{new Date(order.createdAt).toLocaleDateString()}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground font-semibold uppercase tracking-wider">Grand Total</p>
                                <p className="font-bold text-primary mt-0.5">${order.total.toFixed(2)}</p>
                              </div>
                              <div>
                                <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${getStatusColor(order.status)}`}>
                                  {order.status}
                                </span>
                              </div>
                            </div>

                            {/* Order Items */}
                            <div className="p-4 sm:p-6 divide-y divide-border/30">
                              {order.items.map((item: any) => (
                                <div key={item.id} className="flex items-center space-x-4 py-4 first:pt-0 last:pb-0">
                                  <div className="h-16 w-12 flex-shrink-0 overflow-hidden rounded border border-border bg-muted">
                                    <img src={`/images/${item.productImage}`} alt={item.productName} className="h-full w-full object-cover" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h4 className="text-xs font-bold text-foreground truncate">{item.productName}</h4>
                                    <p className="text-[10px] text-muted-foreground mt-0.5">Size: {item.size} | Color: {item.color}</p>
                                    <p className="text-[10px] text-muted-foreground">Qty: {item.quantity}</p>
                                  </div>
                                  <span className="text-xs font-semibold text-primary">${(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                              ))}
                            </div>

                            {/* Shipping info bar */}
                            <div className="border-t border-border/60 bg-muted/10 p-4 sm:px-6 text-[10px] tracking-wide text-muted-foreground flex items-center justify-between">
                              <span className="font-semibold truncate max-w-sm">Shipping Address: {order.shippingAddress}</span>
                              <span className="flex items-center space-x-1.5 font-bold uppercase">
                                <Truck size={14} className="text-primary" />
                                <span>Free Standard Courier Delivery</span>
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}

                {/* 2. WISHLIST TAB */}
                {activeTab === 'wishlist' && (
                  <motion.div
                    key="wishlist"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    <h2 className="font-serif text-xl font-bold text-foreground flex items-center space-x-2">
                      <Heart className="text-primary fill-current" size={20} />
                      <span>My Saved Collections</span>
                    </h2>

                    {wishlistItems.length === 0 ? (
                      <div className="text-center py-16 bg-card border border-border rounded-lg p-6 space-y-4 notched-card max-w-md mx-auto mt-6">
                        <Heart className="mx-auto text-muted-foreground/35" size={48} />
                        <h3 className="font-serif text-lg font-bold text-foreground">Your wishlist is currently empty</h3>
                        <p className="text-xs text-muted-foreground">
                          Tap the heart icon on catalog card details to save favorite streetwear and Kaftans.
                        </p>
                        <Link href="/shop" className="inline-block bg-primary text-primary-foreground font-semibold px-5 py-2 rounded-md text-xs hover:bg-primary/95 transition-all shadow-sm">
                          Browse Catalog
                        </Link>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {wishlistItems.map((item) => (
                          <div key={item.id} className="bg-card border border-border rounded-lg overflow-hidden shadow-sm notched-card relative group">
                            <button
                              onClick={() => toggleWishlist(item.id)}
                              className="absolute top-3 right-3 z-10 p-2 bg-background border border-border hover:bg-red-50 text-red-500 rounded-full shadow transition-colors"
                              aria-label="Remove item"
                            >
                              <Trash2 size={14} />
                            </button>
                            <Link href={`/product/${item.slug}`} className="block">
                              <div className="aspect-[3/4] w-full bg-muted overflow-hidden">
                                <img src={`/images/${item.images}`} alt={item.name} className="h-full w-full object-cover object-center group-hover:scale-102 transition-transform" />
                              </div>
                              <div className="p-4 space-y-1">
                                <span className="text-[9px] font-bold uppercase tracking-widest text-primary">{item.category}</span>
                                <h3 className="font-serif text-sm font-bold text-foreground truncate">{item.name}</h3>
                                <p className="text-xs font-semibold text-primary">${item.price.toFixed(2)}</p>
                              </div>
                            </Link>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}

                {/* 3. ADDRESSES TAB */}
                {activeTab === 'address' && (
                  <motion.div
                    key="address"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    <h2 className="font-serif text-xl font-bold text-foreground flex items-center space-x-2">
                      <MapPin className="text-primary" size={20} />
                      <span>Saved Courier Addresses</span>
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Address list */}
                      <div className="space-y-4">
                        {savedAddresses.map((addr) => (
                          <div key={addr.id} className="bg-card border border-border p-5 rounded-lg shadow-sm notched-card relative flex items-start space-x-3">
                            <MapPin size={18} className="text-primary mt-0.5 flex-shrink-0" />
                            <div className="space-y-1">
                              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">{addr.type}</h4>
                              <p className="text-xs text-muted-foreground leading-relaxed">{addr.address}</p>
                            </div>
                            <button
                              onClick={() => handleDeleteAddress(addr.id)}
                              className="absolute top-4 right-4 text-red-500 hover:text-red-700 p-1"
                              aria-label="Delete Address"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Add new address */}
                      <div className="bg-card border border-border p-6 rounded-lg shadow-sm notched-card">
                        <h3 className="font-serif text-md font-bold text-foreground mb-4">Add Courier Address</h3>
                        <form onSubmit={handleAddAddress} className="space-y-4">
                          <div>
                            <label className="block text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-1">Address Label</label>
                            <input
                              type="text"
                              value={newAddressType}
                              onChange={(e) => setNewAddressType(e.target.value)}
                              placeholder="e.g. Work Office"
                              className="w-full bg-background border border-border rounded-md px-3.5 py-2.5 text-xs text-foreground outline-none focus:border-primary"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-1">Full Delivery Address</label>
                            <textarea
                              value={newAddress}
                              onChange={(e) => setNewAddress(e.target.value)}
                              placeholder="e.g. Apartment, Street, City, Country"
                              className="w-full bg-background border border-border rounded-md px-3.5 py-2.5 text-xs text-foreground outline-none focus:border-primary resize-none"
                              rows={3}
                              required
                            />
                          </div>

                          <button
                            type="submit"
                            className="w-full bg-primary hover:bg-primary/95 text-primary-foreground font-semibold py-2.5 rounded-md text-xs transition-colors shadow-sm"
                          >
                            Save Courier Details
                          </button>
                        </form>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* 4. SETTINGS TAB */}
                {activeTab === 'settings' && (
                  <motion.div
                    key="settings"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="max-w-md bg-card border border-border p-6 rounded-lg shadow-sm notched-card space-y-6"
                  >
                    <h2 className="font-serif text-xl font-bold text-foreground flex items-center space-x-2 border-b border-border pb-3">
                      <Settings className="text-primary" size={20} />
                      <span>Security & Profile Settings</span>
                    </h2>

                    <form onSubmit={(e) => { e.preventDefault(); alert('Profile update simulated successfully.'); }} className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-1">Account Name</label>
                        <input
                          type="text"
                          defaultValue={user.name}
                          className="w-full bg-background border border-border rounded-md px-3.5 py-2.5 text-xs text-foreground outline-none focus:border-primary"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-1">Email Address</label>
                        <input
                          type="email"
                          defaultValue={user.email}
                          className="w-full bg-background border border-border rounded-md px-3.5 py-2.5 text-xs text-foreground outline-none focus:border-primary disabled:opacity-60"
                          disabled
                        />
                      </div>

                      <div className="border-t border-border/60 pt-4 space-y-4">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Change Password</h4>
                        <div>
                          <label className="block text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-1">Current Password</label>
                          <input
                            type="password"
                            className="w-full bg-background border border-border rounded-md px-3.5 py-2.5 text-xs text-foreground outline-none focus:border-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-1">New Password</label>
                          <input
                            type="password"
                            className="w-full bg-background border border-border rounded-md px-3.5 py-2.5 text-xs text-foreground outline-none focus:border-primary"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-primary hover:bg-primary/95 text-primary-foreground font-semibold py-2.5 rounded-md text-xs transition-colors shadow-sm"
                      >
                        Update Account Profile
                      </button>
                    </form>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
