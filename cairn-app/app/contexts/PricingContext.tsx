// app/contexts/PricingContext.tsx
import React, { createContext, useContext } from "react";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { PricingResponse, PricingContextType, PriceData } from "~/types/pricing";
import { clientEnv } from "~/utils/env.client";

// Create QueryClient specifically for pricing data with 1-minute refetch
const pricingQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000, // 30 seconds - data is fresh for 30s
      gcTime: 5 * 60 * 1000, // 5 minutes - keep in cache for 5 minutes
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false, // Don't refetch on window focus
      refetchInterval: 60 * 1000, // Auto-refetch every 1 minute
    },
  },
});

// Fetch pricing data from backend
async function fetchPricingData(): Promise<PricingResponse> {
  const response = await axios.get<PricingResponse>(`${clientEnv.COMPX_GENERAL_BACKEND_URL}/prices`);
  return response.data;
}

const PricingContext = createContext<PricingContextType | undefined>(undefined);

interface PricingProviderProps {
  children: React.ReactNode;
}

// Inner provider that uses React Query hooks
function PricingProviderInner({ children }: PricingProviderProps) {
  const {
    data: priceData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["pricing-data"],
    queryFn: fetchPricingData,
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 60 * 1000, // 1 minute
  });

  // Helper function to get price data for a specific asset ID
  const getPrice = (assetId: string): PriceData | undefined => {
    if (!priceData) return undefined;
    return priceData[assetId];
  };

  // Helper function to get current price (using max as current price)
  const getCurrentPrice = (assetId: string): number | undefined => {
    const price = getPrice(assetId);
    return price?.max;
  };

  const contextValue: PricingContextType = {
    priceData,
    isLoading,
    error: error as Error | null,
    getPrice,
    getCurrentPrice,
  };

  return (
    <PricingContext.Provider value={contextValue}>
      {children}
    </PricingContext.Provider>
  );
}

// Main provider that wraps with QueryClientProvider
export function PricingProvider({ children }: PricingProviderProps) {
  return (
    <QueryClientProvider client={pricingQueryClient}>
      <PricingProviderInner>{children}</PricingProviderInner>
    </QueryClientProvider>
  );
}

export function usePricing(): PricingContextType {
  const context = useContext(PricingContext);
  if (context === undefined) {
    throw new Error("usePricing must be used within a PricingProvider");
  }
  return context;
}
