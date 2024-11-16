import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types/auth';

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  
  setAuth: (user: User, token: string) => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setAuth: (user: User, token: string) => {
        set({ user, token, isAuthenticated: true });
      },

      updateProfile: async (data: Partial<User>) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null
        }));
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: 'vmarketing-auth',
    }
  )
);