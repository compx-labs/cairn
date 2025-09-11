// app/routes/wallet.$address.tsx
import { useParams, useNavigate } from "react-router";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useWallets } from "~/contexts/WalletContext";
import { AssetIcon } from "~/components/AssetIcon";
import { CopyButton } from "~/components/CopyButton";
import { ExplorerButton } from "~/components/ExplorerButton";
import { SkeletonCard, SkeletonTitle, SkeletonText } from "~/components/Skeleton";
import type { NormalizedBalance } from "~/types/treasury";

// Helper function to format LP token names (same as in demo.tsx)
function formatLPTokenName(unitName: string, fullName: string): string {
  // Check if it's an LP token
  const isLpToken = unitName === "PLP" || unitName === "TMPOOL2" || unitName.toLowerCase().includes("tinyman");
  
  if (!isLpToken) {
    return unitName;
  }

  // Parse the full name to extract token pairs
  let tokenPair = null;
  let dexName = "";

  // Try Tinyman format: "TinymanPool2.0 USDC-ALGO"
  const tinymanMatch = fullName.match(/TinymanPool2\.0\s+([A-Z0-9]+)-([A-Z0-9]+)/i);
  if (tinymanMatch) {
    tokenPair = { token1: tinymanMatch[1], token2: tinymanMatch[2] };
    dexName = "Tinyman LP";
  }

  // Try PACT format: "USDC/xUSD [SI] PACT LP TKN"
  if (!tokenPair) {
    const pactMatch = fullName.match(/([A-Z0-9]+)\/([A-Z0-9]+)/i);
    if (pactMatch) {
      tokenPair = { token1: pactMatch[1], token2: pactMatch[2] };
      dexName = "Pact LP";
    }
  }

  // Try generic dash format
  if (!tokenPair) {
    const dashMatch = fullName.match(/([A-Z0-9]+)-([A-Z0-9]+)/i);
    if (dashMatch) {
      tokenPair = { token1: dashMatch[1], token2: dashMatch[2] };
      dexName = "LP";
    }
  }

  // Return formatted name or fallback to unit name
  if (tokenPair) {
    return `${tokenPair.token1}/${tokenPair.token2} ${dexName}`;
  }

  return unitName;
}

// Helper function to get network display info
function getNetworkInfo(network?: string) {
  switch (network) {
    case "algorand":
      return { 
        name: "Algorand", 
        color: "bg-blue-50 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800", 
        logoPath: "/algorand-logomark-black-RGB.jpg",
        logoAlt: "Algorand"
      };
    case "aptos":
      return { 
        name: "Aptos", 
        color: "bg-black text-white dark:bg-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-600", 
        logoPath: "/Aptos_mark_WHT.png",
        logoAlt: "Aptos"
      };
    default:
      return { 
        name: network || "Unknown", 
        color: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300", 
        logoPath: null,
        logoAlt: "Unknown Network"
      };
  }
}

export default function WalletDetails() {
  const { address } = useParams();
  const navigate = useNavigate();
  const { wallets, isAnyLoading } = useWallets();

  // Find the wallet by address
  const wallet = wallets.find(w => w.address === address);

  if (isAnyLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-bg transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <SkeletonCard>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-8 h-8 bg-ink-200 dark:bg-dark-border rounded" />
              <SkeletonTitle className="w-48" />
            </div>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-ink-200 dark:bg-dark-border rounded-full" />
                    <SkeletonText className="w-24" />
                  </div>
                  <div className="text-right">
                    <SkeletonText className="w-20 mb-1" />
                    <SkeletonText className="w-16 h-3" />
                  </div>
                </div>
              ))}
            </div>
          </SkeletonCard>
        </div>
      </div>
    );
  }

  if (!wallet) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-bg transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white dark:bg-dark-surface rounded-xl border border-line dark:border-dark-border p-8 text-center">
            <h1 className="text-2xl font-bold text-ink-700 dark:text-dark-text mb-4">
              Wallet Not Found
            </h1>
            <p className="text-ink-500 dark:text-dark-text-muted mb-6">
              The wallet address "{address}" was not found.
            </p>
            <button
              onClick={() => navigate("/demo")}
              className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Transform wallet data similar to demo.tsx
  const transformedWallet = (() => {
    if (!wallet.data) {
      return {
        label: wallet.label,
        address: wallet.address,
        network: wallet.network,
        balances: [] as NormalizedBalance[],
        lastUpdated: new Date().toISOString(),
        totalUsd: 0,
      };
    }

    // Transform balances to normalized format
    const balances: NormalizedBalance[] = wallet.data.balances
      .map(balance => {
        // For Algorand assets, format LP token names
        let displayName = balance.displayName;
        if (wallet.network === "algorand" && balance.symbol) {
          const formattedName = formatLPTokenName(balance.symbol, balance.displayName || "");
          displayName = formattedName !== balance.symbol ? formattedName : undefined;
        }
        
        return {
          symbol: balance.symbol,
          displayName,
          amount: balance.amount,
          usd: balance.usd,
          assetId: balance.assetId, // For Algorand ASA logos
        };
      })
      .sort((a, b) => (b.usd || b.amount) - (a.usd || a.amount)); // Sort by USD value, then amount

    return {
      label: wallet.label,
      address: wallet.address,
      network: wallet.network,
      balances,
      lastUpdated: wallet.data.lastUpdated,
      totalUsd: wallet.data.totalUsd || 0,
    };
  })();

  const networkInfo = getNetworkInfo(transformedWallet.network);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/demo")}
            className="inline-flex items-center gap-2 text-ink-600 dark:text-dark-text-muted hover:text-ink-700 dark:hover:text-dark-text transition-colors mb-4"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back to Dashboard
          </button>
          
          <div className="bg-white dark:bg-dark-surface rounded-xl border border-line dark:border-dark-border p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-ink-700 dark:text-dark-text font-heading">
                {transformedWallet.label}
              </h1>
              <span className="text-sm text-ink-400 dark:text-dark-text-subtle">
                Updated {new Date(transformedWallet.lastUpdated).toLocaleString()}
              </span>
            </div>
            
            <div className="flex items-center gap-4 mb-4">
              <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${networkInfo.color}`}>
                {networkInfo.logoPath ? (
                  <img 
                    src={networkInfo.logoPath} 
                    alt={networkInfo.logoAlt}
                    className="w-5 h-5 object-contain rounded-sm"
                  />
                ) : (
                  <span>❓</span>
                )}
                {networkInfo.name}
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm text-ink-500 dark:text-dark-text-muted mb-4">
              <span className="font-mono">{transformedWallet.address.slice(0, 12)}...{transformedWallet.address.slice(-12)}</span>
              <CopyButton text={transformedWallet.address} />
              <ExplorerButton address={transformedWallet.address} network={transformedWallet.network} />
            </div>

            {transformedWallet.totalUsd > 0 && (
              <div className="text-2xl font-bold text-brand-600">
                ${transformedWallet.totalUsd.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </div>
            )}
          </div>
        </div>

        {/* Assets List */}
        <div className="bg-white dark:bg-dark-surface rounded-xl border border-line dark:border-dark-border shadow-sm">
          <div className="p-6 border-b border-line dark:border-dark-border">
            <h2 className="text-xl font-semibold text-ink-700 dark:text-dark-text font-heading">
              Assets ({transformedWallet.balances.length})
            </h2>
          </div>
          
          {transformedWallet.balances.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-ink-500 dark:text-dark-text-muted">
                No assets found in this wallet.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-line dark:divide-dark-border">
              {transformedWallet.balances.map((balance, idx) => (
                <div key={`${balance.assetId}-${balance.symbol}-${idx}`} className="p-4 hover:bg-gray-50 dark:hover:bg-dark-border/50 transition-colors">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <AssetIcon 
                        assetId={balance.assetId || 0} 
                        symbol={balance.symbol} 
                        size="md" 
                      />
                      <div>
                        <div className="font-medium text-ink-700 dark:text-dark-text">
                          {balance.displayName || balance.symbol}
                        </div>
                        {balance.displayName && balance.displayName !== balance.symbol && (
                          <div className="text-sm text-ink-500 dark:text-dark-text-muted">
                            {balance.symbol}
                          </div>
                        )}
                        {balance.assetId && (
                          <div className="text-xs text-ink-400 dark:text-dark-text-subtle">
                            Asset ID: {balance.assetId}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-ink-700 dark:text-dark-text">
                        {balance.amount.toLocaleString(undefined, { 
                          maximumFractionDigits: balance.symbol === 'COMPX' ? 0 : 6 
                        })}
                      </div>
                      {balance.usd && balance.usd > 0 && (
                        <div className="text-sm text-ink-500 dark:text-dark-text-muted">
                          ${balance.usd.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
