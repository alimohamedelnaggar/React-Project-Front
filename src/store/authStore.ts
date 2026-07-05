import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthResponse } from '../types';

interface AuthState {
  user: AuthResponse | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  setAuth: (auth: AuthResponse) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isAdmin: false,
      setAuth: (auth) =>
        set({
          user: auth,
          token: auth.token,
          isAuthenticated: true,
          isAdmin: auth.roles.includes('Admin'),
        }),
      logout: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isAdmin: false,
        }),
    }),
    { name: 'auth-storage' },
  ),
);
