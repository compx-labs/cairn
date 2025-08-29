// app/contexts/WalletContext.tsx
import React, { createContext, useContext } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { project } from "~/data/project";
import { useMultiNetworkWalletData, useAggregatedTransactions } from "~/hooks/useWalletQueries";
import type { WalletData } from "~/types/wallet";
import type { SerializableTx } from "~/types/treasury";
import type { MultiNetworkWalletData } from "~/types/aptos";

// Create QueryClient with global cache configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000, // 30 seconds - data is fresh for 30s
      gcTime: 5 * 60 * 1000, // 5 minutes - keep in cache for 5 minutes
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false, // Don't refetch on window focus
      refetchInterval: 60 * 1000, // Auto-refetch every minute
    },
  },
});

interface WalletContextType {
  wallets: Array<{
    label: string;
    address: string;
    network: string;
    data?: MultiNetworkWalletData;
    isLoading: boolean;
    error: Error | null;
  }>;
  isAnyLoading: boolean;
  hasErrors: boolean;
  totalUsdValue: number;
  totalAlgoValue: number;
  latestTransactions: SerializableTx[];
  isTransactionsLoading: boolean;
  transactionsError: Error | null;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

interface WalletProviderProps {
  children: React.ReactNode;
}

// Inner provider that uses React Query hooks
function WalletProviderInner({ children }: WalletProviderProps) {
  // Use React Query hooks
  const walletQueries = useMultiNetworkWalletData();
  const { latestTransactions, isLoading: isTransactionsLoading, error: transactionsError } = useAggregatedTransactions();

  // Transform query results to match our interface
  const wallets = project.wallets.map((wallet, index) => {
    const query = walletQueries[index];
    return {
      label: wallet.label,
      address: wallet.address,
      network: wallet.network,
      data: query.data,
      isLoading: query.isLoading,
      error: query.error as Error | null,
    };
  });

  // Calculate aggregate values
  const isAnyLoading = wallets.some(wallet => wallet.isLoading);
  const hasErrors = wallets.some(wallet => wallet.error !== null);
  
  const totalUsdValue = wallets.reduce((sum, wallet) => {
    return sum + (wallet.data?.totalUsd || 0);
  }, 0);
  
  const totalAlgoValue = wallets.reduce((sum, wallet) => {
    // Only count ALGO from Algorand wallets
    if (wallet.network === "algorand" && wallet.data) {
      const algoBalance = wallet.data.balances.find(b => b.assetId === 0);
      return sum + (algoBalance?.amount || 0);
    }
    return sum;
  }, 0);

  const contextValue: WalletContextType = {
    wallets,
    isAnyLoading,
    hasErrors,
    totalUsdValue,
    totalAlgoValue,
    latestTransactions,
    isTransactionsLoading,
    transactionsError,
  };

  return (
    <WalletContext.Provider value={contextValue}>
      {children}
    </WalletContext.Provider>
  );
}

// Main provider that wraps with QueryClientProvider
export function WalletProvider({ children }: WalletProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <WalletProviderInner>{children}</WalletProviderInner>
    </QueryClientProvider>
  );
}

export function useWallets(): WalletContextType {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallets must be used within a WalletProvider");
  }
  return context;
}