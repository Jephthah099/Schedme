import { create } from "zustand";
import * as SecureStore from "expo-secure-store";
import { api, setAuthToken, setUnauthorizedHandler } from "../api/client";
import { useAppStore } from "./useAppStore";

const TOKEN_KEY = "schedme_auth_token";

interface AuthUser {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  status: "loading" | "authenticated" | "unauthenticated";
  token: string | null;
  user: AuthUser | null;
  error: string | null;

  bootstrap: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => {
  setUnauthorizedHandler(() => {
    get().logout();
  });

  async function applySession(token: string, user: AuthUser) {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
    setAuthToken(token);
    set({ status: "authenticated", token, user, error: null });
  }

  return {
    status: "loading",
    token: null,
    user: null,
    error: null,

    bootstrap: async () => {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      if (!token) {
        set({ status: "unauthenticated" });
        return;
      }
      // We don't have a "whoami" endpoint; trust the stored token and let the
      // first real API call 401 (triggering logout) if it's expired/invalid.
      setAuthToken(token);
      set({ status: "authenticated", token });
    },

    login: async (email, password) => {
      set({ error: null });
      try {
        const res = await api.post<{ token: string; user: AuthUser }>("/api/auth/login", {
          email,
          password,
        });
        await applySession(res.token, res.user);
      } catch (e: any) {
        set({ error: "Incorrect email or password." });
        throw e;
      }
    },

    signup: async (email, password, name) => {
      set({ error: null });
      try {
        const res = await api.post<{ token: string; user: AuthUser }>("/api/auth/signup", {
          email,
          password,
          name,
        });
        await applySession(res.token, res.user);
      } catch (e: any) {
        set({ error: "Couldn't create that account — try a different email." });
        throw e;
      }
    },

    logout: async () => {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      setAuthToken(null);
      useAppStore.getState().reset();
      set({ status: "unauthenticated", token: null, user: null });
    },
  };
});
