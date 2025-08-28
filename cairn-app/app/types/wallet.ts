// app/types/wallet.ts

export interface Asset {
  amount: number;
  "asset-id": number;
  deleted: boolean;
  "is-frozen": boolean;
  decimals: number;
  "unit-name": string;
  name: string;
  balance: number;
  price: number;
  value: number;
  tvl_change_24h: number;
  price_change_24h: number;
  "opted-in-at-round"?: number;
  "opted-out-at-round"?: number;
  params?: {
    clawback?: string;
    creator?: string;
    decimals?: number;
    "default-frozen"?: boolean;
    freeze?: string;
    manager?: string;
    "metadata-hash"?: string;
    name?: string;
    "name-b64"?: string;
    reserve?: string;
    total?: number;
    "unit-name"?: string;
    "unit-name-b64"?: string;
    url?: string;
    "url-b64"?: string;
  };
}

export interface WalletData {
  address: string;
  assets: Asset[];
  lofty: any[];
  pactfi: Asset[];
  ultrade: any[];
  tinyman: any[];
  localState: any[];
  stats: {
    usd: number;
    algo: number;
  };
}

export interface WalletResponse {
  address: string;
  nfd?: string;
  nfd_props?: any;
  value: number;
  data: string; // JSON string that needs to be parsed
  createdAt: string;
  updatedAt: string;
}
