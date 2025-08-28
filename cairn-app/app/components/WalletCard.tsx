// app/components/WalletCard.tsx
import type { TreasurySnapshot } from "~/types/treasury";
import { CopyButton } from "./CopyButton";
import { ExplorerButton } from "./ExplorerButton";
import { SkeletonCard, SkeletonTitle, SkeletonText } from "./Skeleton";
import { AssetIcon } from "./AssetIcon";

interface WalletCardProps {
  wallet?: TreasurySnapshot["wallets"][0];
  isLoading?: boolean;
  label?: string;
  address?: string;
}

export function WalletCard({ wallet, isLoading = false, label: fallbackLabel, address: fallbackAddress }: WalletCardProps) {
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

  const { label, address, balances, lastUpdated } = wallet;
  
  // Calculate total USD value for this wallet
  const totalUSD = balances.reduce((sum, balance) => sum + (balance.usd || 0), 0);

  return (
    <div className="bg-white dark:bg-dark-surface rounded-xl border border-line dark:border-dark-border p-6 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-ink-700 dark:text-dark-text font-heading transition-colors duration-200">{label}</h3>
        <span className="text-sm text-ink-400 dark:text-dark-text-subtle transition-colors duration-200">
          Updated {new Date(lastUpdated).toLocaleTimeString()}
        </span>
      </div>

      <div className="mb-4">
        <div className="flex items-center gap-2 text-sm text-ink-500 dark:text-dark-text-muted mb-2 transition-colors duration-200">
          <span className="font-mono">{address.slice(0, 8)}...{address.slice(-8)}</span>
          <CopyButton text={address} />
          <ExplorerButton address={address} />
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
