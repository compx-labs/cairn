// app/hooks/useWalletQueries.ts
import { useQuery, useQueries } from "@tanstack/react-query";
import axios from "axios";
import { project } from "~/data/project";
import { clientConfig } from "~/config/client";
import type { WalletResponse, WalletData, TransactionsResponse, AlgorandTransaction } from "~/types/wallet";
import type { SerializableTx } from "~/types/treasury";

// API function to fetch wallet info
async function fetchWalletInfo(address: string): Promise<WalletData> {
  const response = await axios.get<WalletResponse>(`${clientConfig.COMPX_GENERAL_BACKEND_URL}/account/${address}`);
  
  // Parse the JSON data string
  const walletData: WalletData = JSON.parse(response.data.data);
  
  return walletData;
}

// API function to fetch wallet transactions
async function fetchWalletTransactions(address: string): Promise<AlgorandTransaction[]> {
  const response = await axios.get<TransactionsResponse>(
    `https://mainnet-idx.4160.nodely.dev/v2/accounts/${address}/transactions?limit=20`
  );
  
  return response.data.transactions;
}

// Transform Algorand transactions to SerializableTx format
function transformTransaction(tx: AlgorandTransaction, walletAddress: string, walletLabel: string): SerializableTx | null {
  // Only process payment and asset transfer transactions for now
  if (tx["tx-type"] !== "pay" && tx["tx-type"] !== "axfer") {
    return null;
  }

  let amount: number;
  let assetId: number;
  let receiver: string;
  let direction: "in" | "out";

  if (tx["tx-type"] === "pay" && tx["payment-transaction"]) {
    amount = tx["payment-transaction"].amount;
    assetId = 0; // ALGO
    receiver = tx["payment-transaction"].receiver;
  } else if (tx["tx-type"] === "axfer" && tx["asset-transfer-transaction"]) {
    amount = tx["asset-transfer-transaction"].amount;
    assetId = tx["asset-transfer-transaction"]["asset-id"];
    receiver = tx["asset-transfer-transaction"].receiver;
  } else {
    return null;
  }

  // Determine direction based on wallet address
  direction = receiver === walletAddress ? "in" : "out";

  return {
    hash: tx.id,
    ts: new Date(tx["round-time"] * 1000).toISOString(),
    walletAddress,
    walletLabel,
    direction,
    assetId,
    amount: amount.toString(),
    sender: tx.sender,
    receiver,
    explorerUrl: `https://allo.info/tx/${tx.id}`,
  };
}

// Hook to fetch wallet data for all project wallets
export function useWalletData() {
  return useQueries({
    queries: project.wallets.map((wallet) => ({
      queryKey: ["wallet", wallet.address],
      queryFn: () => fetchWalletInfo(wallet.address),
      staleTime: 30 * 1000, // 30 seconds
      gcTime: 5 * 60 * 1000, // 5 minutes (formerly cacheTime)
    })),
  });
}

// Hook to fetch transactions for all project wallets
export function useWalletTransactions() {
  return useQueries({
    queries: project.wallets.map((wallet) => ({
      queryKey: ["transactions", wallet.address],
      queryFn: () => fetchWalletTransactions(wallet.address),
      staleTime: 30 * 1000, // 30 seconds
      gcTime: 5 * 60 * 1000, // 5 minutes
    })),
  });
}

// Hook to get aggregated and transformed transactions
export function useAggregatedTransactions() {
  const transactionQueries = useWalletTransactions();
  
  // Check if all queries are loaded
  const isLoading = transactionQueries.some(query => query.isLoading);
  const hasError = transactionQueries.some(query => query.error);
  const error = transactionQueries.find(query => query.error)?.error;

  // Aggregate and transform transactions
  const latestTransactions: SerializableTx[] = [];
  
  if (!isLoading && !hasError) {
    const allTransactions: SerializableTx[] = [];
    
    transactionQueries.forEach((query, index) => {
      if (query.data) {
        const wallet = project.wallets[index];
        const transformedTxs = query.data
          .map(tx => transformTransaction(tx, wallet.address, wallet.label))
          .filter((tx): tx is SerializableTx => tx !== null);
        
        allTransactions.push(...transformedTxs);
      }
    });

    // Sort by timestamp (newest first) and take top 20
    latestTransactions.push(
      ...allTransactions
        .sort((a, b) => new Date(b.ts).getTime() - new Date(a.ts).getTime())
        .slice(0, 20)
    );
  }

  return {
    latestTransactions,
    isLoading,
    error: error as Error | null,
  };
}
