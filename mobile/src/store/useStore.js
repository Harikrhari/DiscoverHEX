import { create } from 'zustand';

const TAX_RATE = 0.085;
const CHARITY_PERCENT = 0.05;

const PROMO_CODES = {
  HEX10: 0.1,
  HEX20: 0.2,
  GIVEBACK: 0.15,
};

const useStore = create((set, get) => ({
  // ─── Cart ────────────────────────────────────────────────────────────────
  cart: {
    items: [],
    promoCode: null,
    promoDiscount: 0,
  },

  addItem: (product, quantity = 1) => {
    set((state) => {
      const existing = state.cart.items.find((i) => i.id === product.id);
      if (existing) {
        return {
          cart: {
            ...state.cart,
            items: state.cart.items.map((i) =>
              i.id === product.id ? { ...i, quantity: i.quantity + quantity } : i
            ),
          },
        };
      }
      return {
        cart: {
          ...state.cart,
          items: [...state.cart.items, { ...product, quantity }],
        },
      };
    });
  },

  removeItem: (productId) => {
    set((state) => ({
      cart: {
        ...state.cart,
        items: state.cart.items.filter((i) => i.id !== productId),
      },
    }));
  },

  updateQty: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(productId);
      return;
    }
    set((state) => ({
      cart: {
        ...state.cart,
        items: state.cart.items.map((i) =>
          i.id === productId ? { ...i, quantity } : i
        ),
      },
    }));
  },

  clearCart: () => {
    set((state) => ({
      cart: { ...state.cart, items: [], promoCode: null, promoDiscount: 0 },
    }));
  },

  applyPromo: (code) => {
    const upperCode = code.toUpperCase().trim();
    const discount = PROMO_CODES[upperCode];
    if (discount) {
      set((state) => ({
        cart: { ...state.cart, promoCode: upperCode, promoDiscount: discount },
      }));
      return { success: true, discount };
    }
    return { success: false, error: 'Invalid promo code' };
  },

  // ─── Computed cart values ─────────────────────────────────────────────────
  get cartItemCount() {
    return get().cart.items.reduce((sum, i) => sum + i.quantity, 0);
  },

  get cartSubtotal() {
    return get().cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  },

  get cartDiscount() {
    return get().cartSubtotal * get().cart.promoDiscount;
  },

  get cartTotal() {
    const sub = get().cartSubtotal - get().cartDiscount;
    const tax = sub * TAX_RATE;
    return sub + tax;
  },

  get charityAmount() {
    const sub = get().cartSubtotal - get().cartDiscount;
    return sub * CHARITY_PERCENT;
  },

  // ─── User ─────────────────────────────────────────────────────────────────
  user: {
    currentUser: null,
    isCreator: false,
    isLoading: false,
    error: null,
    stats: {
      ordersCount: 0,
      totalSpent: 0,
      totalDonated: 0,
    },
    creatorStats: {
      earnings: 0,
      productsListed: 0,
    },
  },

  login: async (email, password) => {
    set((state) => ({ user: { ...state.user, isLoading: true, error: null } }));
    try {
      // In production: await signInWithEmailAndPassword(auth, email, password)
      // Mock login for demo:
      await new Promise((r) => setTimeout(r, 800));
      const mockUser = {
        uid: 'mock-uid-001',
        email,
        displayName: email.split('@')[0],
        photoURL: null,
      };
      set((state) => ({
        user: {
          ...state.user,
          currentUser: mockUser,
          isCreator: email.includes('creator'),
          isLoading: false,
          stats: { ordersCount: 7, totalSpent: 342.5, totalDonated: 17.12 },
          creatorStats: { earnings: 1250.0, productsListed: 4 },
        },
      }));
      return { success: true };
    } catch (error) {
      set((state) => ({
        user: { ...state.user, isLoading: false, error: error.message },
      }));
      return { success: false, error: error.message };
    }
  },

  logout: async () => {
    // In production: await signOut(auth)
    set((state) => ({
      user: {
        ...state.user,
        currentUser: null,
        isCreator: false,
        stats: { ordersCount: 0, totalSpent: 0, totalDonated: 0 },
        creatorStats: { earnings: 0, productsListed: 0 },
      },
    }));
  },

  // ─── Products ─────────────────────────────────────────────────────────────
  products: {
    list: [],
    featured: [],
    loading: false,
    error: null,
    selectedCategory: 'All',
  },

  setProducts: (list) => {
    set((state) => ({
      products: {
        ...state.products,
        list,
        featured: list.filter((p) => p.isFeatured),
        loading: false,
      },
    }));
  },

  setProductsLoading: (loading) => {
    set((state) => ({ products: { ...state.products, loading } }));
  },

  setSelectedCategory: (category) => {
    set((state) => ({
      products: { ...state.products, selectedCategory: category },
    }));
  },

  // ─── Charity ──────────────────────────────────────────────────────────────
  charity: {
    totalDonated: 12847.50,
    monthlyDonated: 3241.75,
    monthlyGoal: 50000,
    campaigns: [],
    transactions: [],
    loading: false,
  },

  setCharityCampaigns: (campaigns) => {
    set((state) => ({
      charity: { ...state.charity, campaigns },
    }));
  },

  setCharityTransactions: (transactions) => {
    set((state) => ({
      charity: { ...state.charity, transactions },
    }));
  },

  addDonation: (amount, campaignId) => {
    set((state) => ({
      charity: {
        ...state.charity,
        totalDonated: state.charity.totalDonated + amount,
        monthlyDonated: state.charity.monthlyDonated + amount,
        transactions: [
          {
            id: `txn-${Date.now()}`,
            amount,
            campaignId,
            date: new Date().toISOString(),
            type: 'purchase',
          },
          ...state.charity.transactions,
        ],
      },
    }));
  },
}));

export default useStore;
