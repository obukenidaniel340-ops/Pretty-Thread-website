import fs from 'fs';
import path from 'path';

// Define TypeScript Interfaces for e-commerce models
export interface User {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  role: 'CUSTOMER' | 'ADMIN';
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string; // single fashion image filename from public assets
}

export interface ProductVariant {
  id: string;
  productId: string;
  size: string;
  color: string;
  sku: string;
  stock: number;
  priceOverride?: number;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  text: string;
  createdAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  variantId: string;
  quantity: number;
  price: number;
  // Joined Fields for UX display
  productName?: string;
  productImage?: string;
  size?: string;
  color?: string;
  sku?: string;
}

export interface Order {
  id: string;
  userId?: string | null;
  guestEmail?: string | null;
  guestName?: string | null;
  status: 'PENDING' | 'PAID' | 'FULFILLED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  total: number;
  shippingAddress: string;
  paymentStatus: 'UNPAID' | 'PAID' | 'REFUNDED';
  paymentIntentId?: string | null;
  createdAt: string;
  items: OrderItem[];
}

export interface Wishlist {
  id: string;
  userId: string;
  productId: string;
  createdAt: string;
}

interface DBData {
  users: User[];
  products: Product[];
  variants: ProductVariant[];
  reviews: Review[];
  orders: Order[];
  wishlists: Wishlist[];
}

const dbFilePath = path.join(process.cwd(), 'src/data/db.json');

// Helper to read database
function readDB(): DBData {
  try {
    const rawData = fs.readFileSync(dbFilePath, 'utf-8');
    return JSON.parse(rawData) as DBData;
  } catch (error) {
    console.error('Error reading JSON DB, fallback to empty:', error);
    return { users: [], products: [], variants: [], reviews: [], orders: [], wishlists: [] };
  }
}

// Helper to write database
function writeDB(data: DBData): void {
  try {
    fs.writeFileSync(dbFilePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing to JSON DB:', error);
  }
}

// Export database operations
export const db = {
  // Products
  getProducts: () => {
    const data = readDB();
    return data.products;
  },
  
  getProductBySlug: (slug: string) => {
    const data = readDB();
    const product = data.products.find(p => p.slug === slug);
    if (!product) return null;
    const variants = data.variants.filter(v => v.productId === product.id);
    const reviews = data.reviews.filter(r => r.productId === product.id);
    return { ...product, variants, reviews };
  },

  getProductById: (id: string) => {
    const data = readDB();
    const product = data.products.find(p => p.id === id);
    if (!product) return null;
    const variants = data.variants.filter(v => v.productId === product.id);
    return { ...product, variants };
  },

  updateProductStock: (variantId: string, quantityDecrement: number) => {
    const data = readDB();
    const variantIndex = data.variants.findIndex(v => v.id === variantId);
    if (variantIndex > -1) {
      const v = data.variants[variantIndex];
      v.stock = Math.max(0, v.stock - quantityDecrement);
      writeDB(data);
      return true;
    }
    return false;
  },

  // Users & Auth
  getUserByEmail: (email: string) => {
    const data = readDB();
    return data.users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  createUser: (user: Omit<User, 'id'>) => {
    const data = readDB();
    const newUser: User = {
      ...user,
      id: 'usr_' + Math.random().toString(36).substr(2, 9),
    };
    data.users.push(newUser);
    writeDB(data);
    return newUser;
  },

  // Orders
  getOrders: () => {
    const data = readDB();
    return data.orders;
  },

  getOrdersByUserId: (userId: string) => {
    const data = readDB();
    return data.orders.filter(o => o.userId === userId);
  },

  getOrderById: (orderId: string) => {
    const data = readDB();
    return data.orders.find(o => o.id === orderId) || null;
  },

  createOrder: (orderData: Omit<Order, 'id' | 'createdAt' | 'status' | 'paymentStatus'> & { items: Omit<OrderItem, 'id' | 'orderId'>[] }) => {
    const data = readDB();
    const orderId = 'ord_' + Math.random().toString(36).substr(2, 9);
    
    // Process items and decrement stocks
    const orderItems: OrderItem[] = orderData.items.map(item => {
      const variant = data.variants.find(v => v.id === item.variantId);
      const product = variant ? data.products.find(p => p.id === variant.productId) : null;
      
      // Decrement stock
      if (variant) {
        variant.stock = Math.max(0, variant.stock - item.quantity);
      }
      
      return {
        id: 'item_' + Math.random().toString(36).substr(2, 9),
        orderId,
        variantId: item.variantId,
        quantity: item.quantity,
        price: item.price,
        productName: product?.name || 'Unknown Product',
        productImage: product?.images || '',
        size: variant?.size || '',
        color: variant?.color || '',
        sku: variant?.sku || ''
      };
    });

    const newOrder: Order = {
      id: orderId,
      userId: orderData.userId || null,
      guestEmail: orderData.guestEmail || null,
      guestName: orderData.guestName || null,
      status: 'PAID', // Set to paid automatically for checkout flow
      total: orderData.total,
      shippingAddress: orderData.shippingAddress,
      paymentStatus: 'PAID',
      paymentIntentId: orderData.paymentIntentId || 'ch_' + Math.random().toString(36).substr(2, 12),
      createdAt: new Date().toISOString(),
      items: orderItems,
    };

    data.orders.push(newOrder);
    writeDB(data);
    return newOrder;
  },

  updateOrderStatus: (orderId: string, status: Order['status']) => {
    const data = readDB();
    const order = data.orders.find(o => o.id === orderId);
    if (order) {
      order.status = status;
      writeDB(data);
      return true;
    }
    return false;
  },

  // Reviews
  createReview: (review: Omit<Review, 'id' | 'createdAt'>) => {
    const data = readDB();
    const newReview: Review = {
      ...review,
      id: 'rev_' + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
    };
    data.reviews.push(newReview);
    writeDB(data);
    return newReview;
  },

  // Wishlist
  getWishlistByUserId: (userId: string) => {
    const data = readDB();
    const wishlists = data.wishlists.filter(w => w.userId === userId);
    return wishlists.map(w => {
      const product = data.products.find(p => p.id === w.productId);
      return { id: w.id, product };
    }).filter(w => w.product !== undefined);
  },

  addToWishlist: (userId: string, productId: string) => {
    const data = readDB();
    const exists = data.wishlists.some(w => w.userId === userId && w.productId === productId);
    if (exists) return true;
    const newWishItem: Wishlist = {
      id: 'wish_' + Math.random().toString(36).substr(2, 9),
      userId,
      productId,
      createdAt: new Date().toISOString(),
    };
    data.wishlists.push(newWishItem);
    writeDB(data);
    return true;
  },

  removeFromWishlist: (userId: string, productId: string) => {
    const data = readDB();
    data.wishlists = data.wishlists.filter(w => !(w.userId === userId && w.productId === productId));
    writeDB(data);
    return true;
  }
};
