import { create } from 'zustand';
import api from '../services/api';

const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  business: null,
  isAuthenticated: !!localStorage.getItem('token'),
  loading: true,

  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setToken: (token) => {
    if (token) localStorage.setItem('token', token);
    else localStorage.removeItem('token');
    set({ token, isAuthenticated: !!token });
  },
  setBusiness: (business) => set({ business }),

  login: async (email, password) => {
    try {
      set({ loading: true });
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      set({ 
        user: data.user, 
        token: data.token, 
        business: data.business, 
        isAuthenticated: true,
        loading: false 
      });
      return { success: true };
    } catch (error) {
      set({ loading: false });
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  },

  register: async (userData) => {
    try {
      set({ loading: true });
      const { data } = await api.post('/auth/register', userData);
      localStorage.setItem('token', data.token);
      set({ 
        user: data.user, 
        token: data.token, 
        business: data.business, 
        isAuthenticated: true,
        loading: false 
      });
      return { success: true };
    } catch (error) {
      set({ loading: false });
      return { success: false, message: error.response?.data?.message || 'Registration failed' };
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, business: null, isAuthenticated: false });
  },

  checkAuth: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      set({ loading: false, isAuthenticated: false });
      return;
    }
    try {
      const { data } = await api.get('/auth/me');
      set({ user: data, business: data.businessId, isAuthenticated: true, loading: false });
    } catch (error) {
      localStorage.removeItem('token');
      set({ user: null, token: null, business: null, isAuthenticated: false, loading: false });
    }
  }
}));

export default useAuthStore;
