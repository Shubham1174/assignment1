import { create } from 'zustand';
import api from '../api/client.js';

export const useAuth = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: async () => {
    try { await api.post('/auth/logout'); } catch (e) {}
    set({ user: null });
  },
  login: async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    set({ user: data.user });
  },
  register: async (payload) => {
    const { data } = await api.post('/auth/register', payload);
    set({ user: data.user });
  },
  fetchMe: async () => {
    try {
      const { data } = await api.get('/auth/me');
      set({ user: data.user });
    } catch (e) {
      // ignore
    }
  }
}));


