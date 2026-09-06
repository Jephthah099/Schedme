import Constants from "expo-constants";
import { Platform } from "react-native";

// Requests are routed through Metro's own dev server (see metro.config.js, which
// proxies /api/* to the Express server on port 4000) so the API is reachable over
// whatever connection Expo Go used to load the JS bundle in the first place —
// LAN address or tunnel host alike. No separate port or tunnel for the API needed.
// In a standalone build (no Metro/dev server at all), EXPO_PUBLIC_API_URL — baked
// in at build time via eas.json — is the only source, since there's no hostUri.
function resolveBaseUrl(): string {
  if (process.env.EXPO_PUBLIC_API_URL) return process.env.EXPO_PUBLIC_API_URL;

  const hostUri: string | undefined =
    Constants.expoConfig?.hostUri ?? (Constants as any).expoGoConfig?.debuggerHost;
  if (hostUri) {
    const isTunnel = hostUri.includes("exp.direct") || hostUri.includes("ngrok");
    return isTunnel ? `https://${hostUri}` : `http://${hostUri}`;
  }
  return Platform.OS === "android" ? "http://10.0.2.2:8081" : "http://localhost:8081";
}

const BASE_URL = resolveBaseUrl();

let authToken: string | null = null;
let onUnauthorized: (() => void) | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
}

export function setUnauthorizedHandler(handler: () => void) {
  onUnauthorized = handler;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      ...(init?.headers ?? {}),
    },
  });
  if (res.status === 401) {
    onUnauthorized?.();
    throw new Error(`Unauthorized ${path}`);
  }
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Request failed ${res.status} ${path}: ${body}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "POST", body: body !== undefined ? JSON.stringify(body) : undefined }),
  patch: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "PATCH", body: JSON.stringify(body) }),
  del: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};

export { BASE_URL };
