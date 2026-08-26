import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string; // matches variantId
  productId: string;
  name: string;
  image: string;
  size: string;
  color: string;
  price: number;
  quantity: number;
  sku: string;
}

export interface UserState {
  id: string;
  email: string;
  name: string;
  role: 'CUSTOMER' | 'ADMIN';
}

interface StoreState {
  cart: CartItem[];
  wishlist: string[]; // product IDs
  isCartOpen: boolean;
  user: UserState | null;
  searchQuery: string;
  
  // Cart Actions
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  setCartOpen: (open: boolean) => void;
  toggleCart: () => void;
  
  // Wishlist Actions
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  
  // User Actions
  login: (user: UserState) => void;
  logout: () => void;
  
  // Search Actions
  setSearchQuery: (query: string) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      cart: [],
      wishlist: [],
      isCartOpen: false,
      user: {
        id: 'usr_customer',
        email: 'customer@prettythreads.com',
        name: 'Chioma Bello',
        role: 'CUSTOMER'
      }, // Default pre-logged in user for smooth demo
      searchQuery: '',

      // Cart Actions
      addToCart: (item) => {
        const currentCart = get().cart;
        const existingItem = currentCart.find((i) => i.id === item.id);

        if (existingItem) {
          set({
            cart: currentCart.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
            ),
          });
        } else {
          set({ cart: [...currentCart, { ...item, quantity: 1 }] });
        }
        set({ isCartOpen: true }); // Open cart drawer on addition
      },

      removeFromCart: (variantId) => {
        set({
          cart: get().cart.filter((i) => i.id !== variantId),
        });
      },

      updateQuantity: (variantId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(variantId);
          return;
        }
        set({
          cart: get().cart.map((i) =>
            i.id === variantId ? { ...i, quantity } : i
          ),
        });
      },

      clearCart: () => set({ cart: [] }),
      setCartOpen: (open) => set({ isCartOpen: open }),
      toggleCart: () => set({ isCartOpen: !get().isCartOpen }),

      // Wishlist Actions
      toggleWishlist: (productId) => {
        const currentWishlist = get().wishlist;
        if (currentWishlist.includes(productId)) {
          set({ wishlist: currentWishlist.filter((id) => id !== productId) });
        } else {
          set({ wishlist: [...currentWishlist, productId] });
        }
      },

      isInWishlist: (productId) => {
        return get().wishlist.includes(productId);
      },

      // User Actions
      login: (user) => set({ user }),
      logout: () => set({ user: null }),

      // Search Actions
      setSearchQuery: (query) => set({ searchQuery: query }),
    }),
    {
      name: 'pretty-threads-store', // localstorage key
      partialize: (state) => ({
        cart: state.cart,
        wishlist: state.wishlist,
        user: state.user,
      }), // only persist cart, wishlist, and user session
    }
  )
);
