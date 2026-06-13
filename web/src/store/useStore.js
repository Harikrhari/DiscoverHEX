import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(
  persist(
    (set, get) => ({
      // ── Cart ──────────────────────────────────────────────
      cart: [],

      addToCart: (product, quantity = 1) => {
        const { cart } = get();
        const existing = cart.find((item) => item.id === product.id);
        if (existing) {
          set({
            cart: cart.map((item) =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          });
        } else {
          set({ cart: [...cart, { ...product, quantity }] });
        }
      },

      removeFromCart: (productId) =>
        set({ cart: get().cart.filter((item) => item.id !== productId) }),

      updateQuantity: (productId, quantity) => {
        if (quantity < 1) {
          get().removeFromCart(productId);
          return;
        }
        set({
          cart: get().cart.map((item) =>
            item.id === productId ? { ...item, quantity } : item
          ),
        });
      },

      clearCart: () => set({ cart: [] }),

      cartTotal: () =>
        get().cart.reduce((sum, item) => sum + item.price * item.quantity, 0),

      cartCount: () =>
        get().cart.reduce((sum, item) => sum + item.quantity, 0),

      cartCharityAmount: () => {
        const items = get().cart;
        return items.reduce(
          (sum, item) => sum + item.price * item.quantity * ((item.charityPercent || 5) / 100),
          0
        );
      },

      // ── User ──────────────────────────────────────────────
      user: null,
      setUser: (user) => set({ user }),
      logout: () => set({ user: null }),

      // ── UI ────────────────────────────────────────────────
      isCartOpen: false,
      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),

      activeCategory: 'all',
      setActiveCategory: (category) => set({ activeCategory: category }),

      // ── Checkout ──────────────────────────────────────────
      checkoutData: {
        shippingAddress: null,
        taxAmount: 0,
        shippingAmount: 0,
      },
      setShippingAddress: (address) =>
        set({ checkoutData: { ...get().checkoutData, shippingAddress: address } }),
      setTaxAmount: (taxAmount) =>
        set({ checkoutData: { ...get().checkoutData, taxAmount } }),
    }),
    {
      name: 'discoverhex-store',
      partialize: (state) => ({ cart: state.cart, user: state.user }),
    }
  )
);

export default useStore;
