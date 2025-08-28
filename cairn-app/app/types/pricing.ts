// app/types/pricing.ts
export interface PriceData {
  assetId: string;
  max: number;
  min: number;
  tvl_change_24hr: number;
  price_change_24hr: number;
}

export interface PricingResponse {
  [assetId: string]: PriceData;
}

export interface PricingContextType {
  priceData: PricingResponse | undefined;
  isLoading: boolean;
  error: Error | null;
  getPrice: (assetId: string) => PriceData | undefined;
  getCurrentPrice: (assetId: string) => number | undefined;
}
