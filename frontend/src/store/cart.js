import { create } from 'zustand';

export const useCart = create((set, get) => ({
  items: [],
  addItem: (product, quantity = 1) => {
    const current = [...get().items];
    const index = current.findIndex((i) => i.product._id === product._id);
    if (index >= 0) {
      current[index] = { ...current[index], quantity: current[index].quantity + quantity };
    } else {
      current.push({ product, quantity });
    }
    set({ items: current });
  },
  removeItem: (productId) => set({ items: get().items.filter((i) => i.product._id !== productId) }),
  clear: () => set({ items: [] })
}));


