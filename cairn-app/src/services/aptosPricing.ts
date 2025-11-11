// app/services/aptosPricing.ts
import axios from "axios";

export interface AptosPriceData {
  [tokenId: string]: {
    usd: number;
  };
}

// Map common Aptos token symbols to CoinGecko IDs
const SYMBOL_TO_COINGECKO_ID: Record<string, string> = {
  "APT": "aptos",
  "EMOJICOIN": "emojicoin", 
  "HYPERION": "hyperion",
  // Add more mappings as needed
  "USDC": "usd-coin",
  "USDT": "tether",
  "WETH": "weth",
  "BTC": "bitcoin",
};

// Cache for price data
let priceCache: { data: AptosPriceData; timestamp: number } | null = null;
const CACHE_DURATION = 60 * 1000; // 1 minute cache

export async function fetchAptosPrices(tokenSymbols: string[]): Promise<AptosPriceData> {
  // Check cache first
  if (priceCache && Date.now() - priceCache.timestamp < CACHE_DURATION) {
    return priceCache.data;
  }

  try {
    // Map symbols to CoinGecko IDs
    const coinGeckoIds = tokenSymbols
      .map(symbol => SYMBOL_TO_COINGECKO_ID[symbol.toUpperCase()])
      .filter(Boolean); // Remove undefined values

    if (coinGeckoIds.length === 0) {
      return {};
    }

    // Remove duplicates
    const uniqueIds = [...new Set(coinGeckoIds)];
    
    const response = await axios.get<AptosPriceData>(
      `https://api.coingecko.com/api/v3/simple/price`,
      {
        params: {
          ids: uniqueIds.join(','),
          vs_currencies: 'usd'
        },
        timeout: 5000, // 5 second timeout
      }
    );

    // Cache the result
    priceCache = {
      data: response.data,
      timestamp: Date.now()
    };

    return response.data;
  } catch (error) {
    console.warn('Failed to fetch Aptos token prices from CoinGecko:', error);
    return {};
  }
}

// Get price for a specific token symbol
export function getTokenPrice(symbol: string, priceData: AptosPriceData): number | undefined {
  const coinGeckoId = SYMBOL_TO_COINGECKO_ID[symbol.toUpperCase()];
  if (!coinGeckoId || !priceData[coinGeckoId]) {
    return undefined;
  }
  return priceData[coinGeckoId].usd;
}

// Calculate USD value for a token balance
export function calculateUsdValue(
  symbol: string, 
  amount: number, 
  priceData: AptosPriceData
): number | undefined {
  const price = getTokenPrice(symbol, priceData);
  if (price === undefined) {
    return undefined;
  }
  return amount * price;
}
