// app/contexts/WalletContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { project } from "~/data/project";
import { clientConfig } from "~/config/client";
import type { WalletResponse, WalletData } from "~/types/wallet";

// API function to fetch wallet info
async function fetchWalletInfo(address: string): Promise<WalletData> {
  const response = await axios.get<WalletResponse>(`${clientConfig.COMPX_GENERAL_BACKEND_URL}/account/${address}`);
  
  // Parse the JSON data string
  const walletData: WalletData = JSON.parse(response.data.data);
  
  return walletData;
}

interface WalletContextType {
  wallets: Array<{
    label: string;
    address: string;
    data?: WalletData;
    isLoading: boolean;
    error: Error | null;
  }>;
  isAnyLoading: boolean;
  hasErrors: boolean;
  totalUsdValue: number;
  totalAlgoValue: number;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

interface WalletProviderProps {
  children: React.ReactNode;
}

export function WalletProvider({ children }: WalletProviderProps) {
  const [wallets, setWallets] = useState<Array<{
    label: string;
    address: string;
    data?: WalletData;
    isLoading: boolean;
    error: Error | null;
  }>>(() => 
    project.wallets.map(wallet => ({
      label: wallet.label,
      address: wallet.address,
      data: undefined,
      isLoading: true,
      error: null,
    }))
  );

  useEffect(() => {
    // Fetch all wallet data
    const fetchAllWallets = async () => {
      const promises = project.wallets.map(async (wallet, index) => {
        try {
          const data = await fetchWalletInfo(wallet.address);
          setWallets(prev => prev.map((w, i) => 
            i === index 
              ? { ...w, data, isLoading: false, error: null }
              : w
          ));
        } catch (error) {
          setWallets(prev => prev.map((w, i) => 
            i === index 
              ? { ...w, isLoading: false, error: error as Error }
              : w
          ));
        }
      });

      await Promise.allSettled(promises);
    };

    fetchAllWallets();

    // Set up interval for refetching
    const interval = setInterval(fetchAllWallets, 60 * 1000); // 1 minute

    return () => clearInterval(interval);
  }, []);

  // Calculate aggregate values
  const isAnyLoading = wallets.some(wallet => wallet.isLoading);
  const hasErrors = wallets.some(wallet => wallet.error !== null);
  
  const totalUsdValue = wallets.reduce((sum, wallet) => {
    return sum + (wallet.data?.stats.usd || 0);
  }, 0);
  
  const totalAlgoValue = wallets.reduce((sum, wallet) => {
    return sum + (wallet.data?.stats.algo || 0);
  }, 0);

  const contextValue: WalletContextType = {
    wallets,
    isAnyLoading,
    hasErrors,
    totalUsdValue,
    totalAlgoValue,
  };

  return (
    <WalletContext.Provider value={contextValue}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallets(): WalletContextType {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallets must be used within a WalletProvider");
  }
  return context;
}