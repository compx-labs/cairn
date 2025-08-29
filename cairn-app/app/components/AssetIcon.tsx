// app/components/AssetIcon.tsx
import { useState } from "react";
import { useAsa } from "~/contexts/AsaContext";
import { useWallets } from "~/contexts/WalletContext";

interface AssetIconProps {
  assetId: number | string;
  symbol: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

interface LPTokenPair {
  token1: string;
  token2: string;
}

export function AssetIcon({
  assetId,
  symbol,
  size = "md",
  className = "",
}: AssetIconProps) {
  const { getAsaLogo, getAsaMetadata } = useAsa();
  const { wallets } = useWallets();
  const [imageError, setImageError] = useState(false);

  // Check if this is an LP token and try to parse the underlying tokens
  const isLpToken =
    symbol === "PLP" ||
    symbol === "TMPOOL2" ||
    symbol.toLowerCase().includes("tinyman") ||
    symbol.toLowerCase().includes("pact")

  if (isLpToken) {
    // Get LP token info from wallet balances data (LP tokens won't be in ASA metadata)
    let lpTokenBalance = null;
    for (const wallet of wallets) {
      if (wallet.data?.balances) {
        lpTokenBalance = wallet.data.balances.find(
          (balance) =>
            balance.assetId === Number(assetId) || balance.symbol === symbol
        );
        if (lpTokenBalance) break;
      }
    }

    // Try to parse from displayName first, then symbol, then the symbol parameter itself
    const nameToparse =
      lpTokenBalance?.displayName || lpTokenBalance?.symbol || symbol;
    console.log(
      `Parsing LP token: ${symbol}, displayName: ${lpTokenBalance?.displayName}, parsing: ${nameToparse}`
    );

    const lpTokenPair = parseLPTokenName(nameToparse);
    console.log(`LP token pair result:`, lpTokenPair);

    if (lpTokenPair) {
      return (
        <LPTokenIcon pair={lpTokenPair} size={size} className={className} />
      );
    }

    // Fallback to text representation if we can't parse the LP token
    return (
      <div
        className={`flex items-center justify-center bg-ink-100 dark:bg-dark-border rounded-full text-ink-600 dark:text-dark-text-muted font-medium ${getSizeClasses(size)} ${className}`}
      >
        {symbol.slice(0, 2)}
      </div>
    );
  }

  const logo = getAsaLogo(assetId.toString());

  // If we have a logo and no image error, try to display the image
  if (logo?.png && !imageError) {
    return (
      <img
        src={logo.png}
        alt={symbol}
        className={`rounded-full object-cover ${getSizeClasses(size)} ${className}`}
        onError={() => {
          console.log(
            `Failed to load image for ${symbol} (${assetId}):`,
            logo.png
          );
          setImageError(true);
        }}
        onLoad={() => {
          console.log(`Successfully loaded image for ${symbol} (${assetId})`);
        }}
      />
    );
  }

  // Fallback to text representation
  return (
    <div
      className={`flex items-center justify-center bg-ink-100 dark:bg-dark-border rounded-full text-ink-600 dark:text-dark-text-muted font-medium ${getSizeClasses(size)} ${className}`}
    >
      {getSymbolInitials(symbol)}
    </div>
  );
}

function getSizeClasses(size: "sm" | "md" | "lg"): string {
  switch (size) {
    case "sm":
      return "w-4 h-4 text-xs";
    case "md":
      return "w-6 h-6 text-sm";
    case "lg":
      return "w-8 h-8 text-base";
    default:
      return "w-6 h-6 text-sm";
  }
}

function getSymbolInitials(symbol: string): string {
  if (symbol === "ALGO") return "A";
  if (symbol.length <= 2) return symbol;

  // For longer symbols, take first 2 characters
  return symbol.slice(0, 2);
}

// Parse LP token names to extract underlying token symbols
function parseLPTokenName(name: string): LPTokenPair | null {
  // Common LP token patterns:
  // PACT: "USDC/xUSD [SI] PACT LP TKN"
  // Tinyman: "TinymanPool2.0 USDC-ALGO"
  // Generic: "ALGO/USDC Tinyman LP" or "TOKEN1/TOKEN2 LP"

  // Try Tinyman format first: "TinymanPool2.0 TOKEN1-TOKEN2"
  const tinymanPattern = /TinymanPool2\.0\s+([A-Z0-9]+)-([A-Z0-9]+)/i;
  const tinymanMatch = name.match(tinymanPattern);

  if (tinymanMatch) {
    return {
      token1: tinymanMatch[1].toUpperCase(),
      token2: tinymanMatch[2].toUpperCase(),
    };
  }

  // Try PACT/generic format: "TOKEN1/TOKEN2"
  const slashPattern = /([A-Z0-9]+)\/([A-Z0-9]+)/i;
  const slashMatch = name.match(slashPattern);

  if (slashMatch) {
    return {
      token1: slashMatch[1].toUpperCase(),
      token2: slashMatch[2].toUpperCase(),
    };
  }

  // Try dash format: "TOKEN1-TOKEN2" (fallback for other cases)
  const dashPattern = /([A-Z0-9]+)-([A-Z0-9]+)/i;
  const dashMatch = name.match(dashPattern);

  if (dashMatch) {
    return {
      token1: dashMatch[1].toUpperCase(),
      token2: dashMatch[2].toUpperCase(),
    };
  }

  return null;
}

// Component to render LP token with dual icons
function LPTokenIcon({
  pair,
  size,
  className,
}: {
  pair: LPTokenPair;
  size: "sm" | "md" | "lg";
  className: string;
}) {
  const { getAsaLogo, asaMetadata } = useAsa();

  // Find asset IDs for the token symbols
  const findAssetIdBySymbol = (symbol: string): string | null => {
    if (!asaMetadata) {
      console.log(`No ASA metadata available for symbol: ${symbol}`);
      return null;
    }

    // Handle special cases first
    if (symbol.toUpperCase() === "ALGO") {
      return "0"; // ALGO has asset ID 0
    }

    for (const [assetId, metadata] of Object.entries(asaMetadata)) {
      if (metadata.unit_name?.toUpperCase() === symbol.toUpperCase()) {
        console.log(`Found asset ID ${assetId} for symbol ${symbol}`);
        return assetId;
      }
    }

    console.log(`No asset ID found for symbol: ${symbol}`);
    return null;
  };

  const token1AssetId = findAssetIdBySymbol(pair.token1);
  const token2AssetId = findAssetIdBySymbol(pair.token2);

  console.log(
    `LP Token pair: ${pair.token1}/${pair.token2}, Asset IDs: ${token1AssetId}/${token2AssetId}`
  );

  const token1Logo = token1AssetId ? getAsaLogo(token1AssetId) : null;
  const token2Logo = token2AssetId ? getAsaLogo(token2AssetId) : null;

  console.log(
    `LP Token logos: ${token1Logo?.png ? "found" : "missing"}/${token2Logo?.png ? "found" : "missing"}`
  );

  // Larger icons and better spacing for LP tokens
  const containerSize =
    size === "sm" ? "w-7 h-4" : size === "md" ? "w-9 h-6" : "w-11 h-8";
  const iconSize =
    size === "sm" ? "w-4 h-4" : size === "md" ? "w-6 h-6" : "w-8 h-8";
  const textSize =
    size === "sm" ? "text-xs" : size === "md" ? "text-sm" : "text-base";
  const overlap =
    size === "sm" ? "right-0" : size === "md" ? "right-0" : "right-0";

  return (
    <div className={`relative ${containerSize} ${className}`}>
      {/* First token icon */}
      <div className="absolute left-0 top-0 z-10">
        {token1Logo?.png ? (
          <img
            src={token1Logo.png}
            alt={pair.token1}
            className={`rounded-full object-cover ${iconSize} border-2 border-white dark:border-dark-surface shadow-sm`}
          />
        ) : (
          <div
            className={`flex items-center justify-center bg-ink-100 dark:bg-dark-border rounded-full text-ink-600 dark:text-dark-text-muted font-medium ${iconSize} ${textSize} border-2 border-white dark:border-dark-surface shadow-sm`}
          >
            {getSymbolInitials(pair.token1)}
          </div>
        )}
      </div>

      {/* Second token icon (overlapping) */}
      <div className={`absolute ${overlap} top-0`}>
        {token2Logo?.png ? (
          <img
            src={token2Logo.png}
            alt={pair.token2}
            className={`rounded-full object-cover ${iconSize} border-2 border-white dark:border-dark-surface shadow-sm`}
          />
        ) : (
          <div
            className={`flex items-center justify-center bg-ink-100 dark:bg-dark-border rounded-full text-ink-600 dark:text-dark-text-muted font-medium ${iconSize} ${textSize} border-2 border-white dark:border-dark-surface shadow-sm`}
          >
            {getSymbolInitials(pair.token2)}
          </div>
        )}
      </div>
    </div>
  );
}
