// app/contexts/AsaContext.tsx
import React, { createContext, useContext } from "react";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import axios from "axios";
import type {
  AsaMetadataResponse,
  AsaContextType,
  AsaMetadata,
  AsaLogo,
} from "~/types/asa";

// Create QueryClient specifically for ASA data with longer cache times
const asaQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 60 * 1000, // 30 minutes - data is fresh for 30 minutes
      gcTime: 60 * 60 * 1000, // 1 hour - keep in cache for 1 hour
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false, // Don't refetch on window focus
      refetchInterval: 30 * 60 * 1000, // Auto-refetch every 30 minutes
    },
  },
});

const ASA_METADATA_URL = "https://asa-list.tinyman.org/assets.json";

// Fetch ASA metadata from Tinyman
async function fetchAsaMetadata(): Promise<AsaMetadataResponse> {
  const response = await axios.get<AsaMetadataResponse>(ASA_METADATA_URL);
  return response.data;
}

const AsaContext = createContext<AsaContextType | undefined>(undefined);

interface AsaProviderProps {
  children: React.ReactNode;
}

// Inner provider that uses React Query hooks
function AsaProviderInner({ children }: AsaProviderProps) {
  const {
    data: asaMetadata,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["asa-metadata"],
    queryFn: fetchAsaMetadata,
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
    refetchInterval: 30 * 60 * 1000, // 30 minutes
  });

  // Helper function to get metadata for a specific ASA ID
  const getAsaMetadata = (asaId: string): AsaMetadata | undefined => {
    if (!asaMetadata) return undefined;
    return asaMetadata[asaId];
  };

  // Helper function to get logo for a specific ASA ID
  const getAsaLogo = (asaId: string): AsaLogo | undefined => {
    const metadata = getAsaMetadata(asaId);

    return metadata?.logo;
  };

  const contextValue: AsaContextType = {
    asaMetadata,
    isLoading,
    error: error as Error | null,
    getAsaMetadata,
    getAsaLogo,
  };

  return (
    <AsaContext.Provider value={contextValue}>{children}</AsaContext.Provider>
  );
}

// Main provider that wraps with QueryClientProvider
export function AsaProvider({ children }: AsaProviderProps) {
  return (
    <QueryClientProvider client={asaQueryClient}>
      <AsaProviderInner>{children}</AsaProviderInner>
    </QueryClientProvider>
  );
}

export function useAsa(): AsaContextType {
  const context = useContext(AsaContext);
  if (context === undefined) {
    throw new Error("useAsa must be used within an AsaProvider");
  }
  return context;
}
