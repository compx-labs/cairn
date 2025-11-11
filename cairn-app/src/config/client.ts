// src/config/client.ts
// Client-side configuration

export const clientConfig = {
  COMPX_GENERAL_BACKEND_URL: 
    typeof window !== "undefined" 
      ? (window as any).__ENV__?.COMPX_GENERAL_BACKEND_URL || "https://api.compx.io"
      : "https://api.compx.io",
  
  // Add other client-side config as needed
  APTOS_GRAPHQL_URL: "https://api.mainnet.aptoslabs.com/v1/graphql",
  APTOS_REST_URL: "https://api.mainnet.aptoslabs.com/v1",
};
