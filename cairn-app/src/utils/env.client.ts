// app/utils/env.client.ts
// Client-side environment configuration
// These should be set as public environment variables (prefixed with VITE_ in Vite)

export const clientEnv = {
  COMPX_GENERAL_BACKEND_URL: 
    typeof window !== "undefined" 
      ? (window as any).__ENV__?.COMPX_GENERAL_BACKEND_URL || "https://api.compx.io"
      : "https://api.compx.io"
};
