// app/types/treasury.ts
export type Asset = { id: number; symbol: string; decimals: number };
export type Wallet = { label: string; address: string };

export type Balance = { assetId: number; amount: bigint };

export type NormalizedBalance = {
  symbol: string;
  amount: number;        // humanized (decimals applied)
  usd?: number;          // optional fiat estimate
};

export type Tx = {
  hash: string;
  ts: string;            // ISO
  walletAddress: string; // the configured wallet involved
  walletLabel?: string;
  direction: "in" | "out";
  assetId: number;
  amount: bigint;
  sender: string;
  receiver: string;
  explorerUrl: string;
};

// Serializable version for JSON responses
export type SerializableTx = Omit<Tx, 'amount'> & {
  amount: string; // BigInt as string for JSON serialization
};

export type TreasurySnapshot = {
  totals: Record<string, number>; // e.g., { ALGO: 123.45, xUSD: 5000 }
  fiatTotals?: { USD: number };
  wallets: Array<{
    label: string;
    address: string;
    balances: NormalizedBalance[];
    lastUpdated: string;
  }>;
  latestTxs: SerializableTx[];
  lastUpdated: string;
};
