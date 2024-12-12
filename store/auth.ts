import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useEffect } from 'react';
import { AppState, AppStateStatus } from 'react-native';

// Define types for the user and the store state
interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string
  state: string;
  lga: string;
  picture: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  login: (user: User, token: string, refreshToken: string) => void;
  logout: () => void;
}

// Custom storage adapter for SecureStore
const secureStorage = {
  getItem: async (name: string) => {
    const value = await SecureStore.getItemAsync(name);
    return value ? JSON.parse(value) : null;
  },
  setItem: async (name: string, value: any) => {
    await SecureStore.setItemAsync(name, JSON.stringify(value));
  },
  removeItem: async (name: string) => {
    await SecureStore.deleteItemAsync(name);
  },
};

// Create the Zustand store with persistence
export const useAuthStore = create(
  persist<AuthState>(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,
      login: (user: User, token: string, refreshToken: string) => set({ user, token, refreshToken }),
      logout: () => set({ user: null, token: null, refreshToken: null }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => secureStorage),
    }
  )
);

// Hook to sync storage when app state changes
export const useSyncStorage = () => {
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        useAuthStore.persist.rehydrate();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);
};