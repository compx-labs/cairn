// app/types/aptos.ts

export interface AptosBalance {
  symbol: string;
  decimals: number;
  amountRaw: string; // BigInt as string for JSON serialization
  amount: number; // Human readable amount
  assetType: string;
  standard?: string; // "v2" for FA v2, "v1" for legacy coins
  usdValue?: number; // USD value from pricing API
}

export interface AptosBalanceResponse {
  address: string;
  balances: AptosBalance[];
}

// GraphQL response types from Aptos indexer
export interface AptosGraphQLBalance {
  amount: string;
  asset_type: string;
  metadata: {
    symbol?: string;
    decimals?: number;
  } | null;
}

export interface AptosGraphQLResponse {
  data: {
    current_fungible_asset_balances: AptosGraphQLBalance[];
  };
}

// Extended wallet data to support multiple networks
export interface MultiNetworkWalletData {
  address: string;
  network: string;
  label: string;
  balances: Array<{
    symbol: string;
    decimals: number;
    amount: number;
    assetId?: number; // For Algorand compatibility
    assetType?: string; // For Aptos
    usd?: number;
    displayName?: string;
  }>;
  lastUpdated: string;
  totalUsd?: number;
}
