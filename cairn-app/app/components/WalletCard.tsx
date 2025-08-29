// app/components/WalletCard.tsx
import type { TreasurySnapshot } from "~/types/treasury";
import type { MultiNetworkWalletData } from "~/types/aptos";
import { CopyButton } from "./CopyButton";
import { ExplorerButton } from "./ExplorerButton";
import { SkeletonCard, SkeletonTitle, SkeletonText } from "./Skeleton";
import { AssetIcon } from "./AssetIcon";

interface WalletCardProps {
  wallet?: TreasurySnapshot["wallets"][0] | MultiNetworkWalletData;
  isLoading?: boolean;
  label?: string;
  address?: string;
  network?: string;
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

export function WalletCard({ wallet, isLoading = false, label: fallbackLabel, address: fallbackAddress, network: fallbackNetwork }: WalletCardProps) {
  if (isLoading || !wallet) {
    return (
      <SkeletonCard>
        <div className="flex items-center justify-between mb-4">
          <SkeletonTitle className="w-24" />
          <SkeletonText className="w-20" />
        </div>

        <div className="mb-4">
          <div className="flex items-center gap-2 text-sm mb-2">
            <SkeletonText className="w-32 h-4" />
            <div className="w-4 h-4 bg-ink-200 dark:bg-dark-border rounded" />
            <div className="w-4 h-4 bg-ink-200 dark:bg-dark-border rounded" />
          </div>
          <SkeletonTitle className="w-20 h-6" />
        </div>

        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex justify-between items-center">
              <SkeletonText className="w-12" />
              <div className="text-right">
                <SkeletonText className="w-16 mb-1" />
                <SkeletonText className="w-12 h-3" />
              </div>
            </div>
          ))}
        </div>
      </SkeletonCard>
    );
  }

  // Handle both legacy TreasurySnapshot wallet and new MultiNetworkWalletData
  const label = wallet.label || fallbackLabel || "Unknown Wallet";
  const address = wallet.address || fallbackAddress || "";
  const network = (wallet as MultiNetworkWalletData).network || fallbackNetwork || "algorand";
  const balances = wallet.balances || [];
  const lastUpdated = wallet.lastUpdated || new Date().toISOString();
  
  // Calculate total USD value for this wallet
  const totalUSD = (wallet as MultiNetworkWalletData).totalUsd || balances.reduce((sum, balance) => sum + (balance.usd || 0), 0);
  
  const networkInfo = getNetworkInfo(network);

  return (
    <div className="bg-white dark:bg-dark-surface rounded-xl border border-line dark:border-dark-border p-6 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-ink-700 dark:text-dark-text font-heading transition-colors duration-200">{label}</h3>
          <span className="text-sm text-ink-400 dark:text-dark-text-subtle transition-colors duration-200">
            Updated {new Date(lastUpdated).toLocaleTimeString()}
          </span>
        </div>
        <div className="flex items-center">
          <span className={`inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium ${networkInfo.color} transition-colors duration-200`}>
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
      </div>

      <div className="mb-4">
        <div className="flex items-center gap-2 text-sm text-ink-500 dark:text-dark-text-muted mb-2 transition-colors duration-200">
          <span className="font-mono">{address.slice(0, 8)}...{address.slice(-8)}</span>
          <CopyButton text={address} />
          <ExplorerButton address={address} network={network} />
        </div>
        {totalUSD > 0 && (
          <div className="text-lg font-semibold text-brand-600 transition-colors duration-200">
            ${totalUSD.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </div>
        )}
      </div>

      <div className="space-y-2">
        {balances.slice(0, 3).map((balance, idx) => (
          <div key={idx} className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              {balance.assetId !== undefined && (
                <AssetIcon 
                  assetId={balance.assetId} 
                  symbol={balance.symbol} 
                  size="sm" 
                />
              )}
              <span className="text-sm font-medium text-ink-600 dark:text-dark-text-muted transition-colors duration-200">
                {balance.displayName || balance.symbol}
              </span>
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold text-ink-700 dark:text-dark-text transition-colors duration-200">
                {balance.amount.toLocaleString(undefined, { 
                  maximumFractionDigits: balance.symbol === 'COMPX' ? 0 : 2 
                })}
              </div>
              {balance.usd && balance.usd > 0 && (
                <div className="text-xs text-ink-400 dark:text-dark-text-subtle transition-colors duration-200">
                  ${balance.usd.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </div>
              )}
            </div>
          </div>
        ))}
        
        {balances.length > 3 && (
          <div className="text-xs text-ink-400 dark:text-dark-text-subtle text-center pt-2 transition-colors duration-200">
            +{balances.length - 3} more assets
          </div>
        )}
      </div>
    </div>
  );
}
