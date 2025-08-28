// app/components/TransactionsTable.tsx
import type { SerializableTx } from "~/types/treasury";
import { project } from "~/data/project";
import { ExplorerButton } from "./ExplorerButton";
import { SkeletonText } from "./Skeleton";
import { AssetIcon } from "./AssetIcon";
import { useWallets } from "~/contexts/WalletContext";
import { useAsa } from "~/contexts/AsaContext";

interface TransactionsTableProps {
  transactions?: SerializableTx[];
  isLoading?: boolean;
}

export function TransactionsTable({ transactions = [], isLoading = false }: TransactionsTableProps) {
  const { wallets } = useWallets();
  const { getAsaMetadata } = useAsa();

  const getAssetSymbol = (assetId: number) => {
    // First, try to get from project configuration
    const projectAsset = project.assets.find(a => a.id === assetId);
    if (projectAsset) {
      return projectAsset.symbol;
    }

    // Then, try to get from wallet data (which has the most up-to-date unit names)
    for (const wallet of wallets) {
      if (wallet.data?.assets) {
        const walletAsset = wallet.data.assets.find(asset => asset["asset-id"] === assetId);
        if (walletAsset?.["unit-name"]) {
          return walletAsset["unit-name"];
        }
      }
    }

    // Finally, try ASA metadata from Tinyman
    const asaMetadata = getAsaMetadata(assetId.toString());
    if (asaMetadata?.unit_name) {
      return asaMetadata.unit_name;
    }

    // Fallback to generic name
    return `Asset ${assetId}`;
  };

  const getAssetDecimals = (assetId: number) => {
    // First, try project configuration
    const projectAsset = project.assets.find(a => a.id === assetId);
    if (projectAsset) {
      return projectAsset.decimals;
    }

    // Then, try wallet data
    for (const wallet of wallets) {
      if (wallet.data?.assets) {
        const walletAsset = wallet.data.assets.find(asset => asset["asset-id"] === assetId);
        if (walletAsset?.decimals !== undefined) {
          return walletAsset.decimals;
        }
      }
    }

    // Finally, try ASA metadata
    const asaMetadata = getAsaMetadata(assetId.toString());
    if (asaMetadata?.decimals !== undefined) {
      return asaMetadata.decimals;
    }

    // Default to 6 decimals (ALGO standard)
    return 6;
  };

  const formatAmount = (amount: string, assetId: number) => {
    const decimals = getAssetDecimals(assetId);
    const symbol = getAssetSymbol(assetId);
    const humanAmount = Number(BigInt(amount)) / (10 ** decimals);
    return humanAmount.toLocaleString(undefined, { 
      maximumFractionDigits: symbol === 'COMPX' ? 0 : 2 
    });
  };

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-dark-surface rounded-xl border border-line dark:border-dark-border overflow-hidden shadow-sm transition-colors duration-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-ink-50 dark:bg-dark-border border-b border-line dark:border-dark-border transition-colors duration-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-ink-500 dark:text-dark-text-muted uppercase tracking-wider font-heading transition-colors duration-200">
                  Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-ink-500 dark:text-dark-text-muted uppercase tracking-wider font-heading transition-colors duration-200">
                  Wallet
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-ink-500 dark:text-dark-text-muted uppercase tracking-wider font-heading transition-colors duration-200">
                  Direction
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-ink-500 dark:text-dark-text-muted uppercase tracking-wider font-heading transition-colors duration-200">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-ink-500 dark:text-dark-text-muted uppercase tracking-wider font-heading transition-colors duration-200">
                  Asset
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-ink-500 dark:text-dark-text-muted uppercase tracking-wider font-heading transition-colors duration-200">
                  Explorer
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line dark:divide-dark-border bg-white dark:bg-dark-surface transition-colors duration-200">
              {[1, 2, 3, 4, 5].map((i) => (
                <tr key={i}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <SkeletonText className="w-16" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <SkeletonText className="w-20 mb-1" />
                    <SkeletonText className="w-24 h-3" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <SkeletonText className="w-12 h-6 rounded-full" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <SkeletonText className="w-16" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <SkeletonText className="w-12" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-4 h-4 bg-ink-200 dark:bg-dark-border rounded" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="bg-white dark:bg-dark-surface rounded-xl border border-line dark:border-dark-border p-8 text-center transition-colors duration-200">
        <div className="text-ink-400 dark:text-dark-text-muted transition-colors duration-200">No recent transactions</div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-dark-surface rounded-xl border border-line dark:border-dark-border overflow-hidden shadow-sm transition-colors duration-200">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-ink-50 dark:bg-dark-border border-b border-line dark:border-dark-border transition-colors duration-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-ink-500 dark:text-dark-text-muted uppercase tracking-wider font-heading transition-colors duration-200">
                Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-ink-500 dark:text-dark-text-muted uppercase tracking-wider font-heading transition-colors duration-200">
                Wallet
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-ink-500 dark:text-dark-text-muted uppercase tracking-wider font-heading transition-colors duration-200">
                Direction
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-ink-500 dark:text-dark-text-muted uppercase tracking-wider font-heading transition-colors duration-200">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-ink-500 dark:text-dark-text-muted uppercase tracking-wider font-heading transition-colors duration-200">
                Asset
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-ink-500 dark:text-dark-text-muted uppercase tracking-wider font-heading transition-colors duration-200">
                Explorer
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line dark:divide-dark-border bg-white dark:bg-dark-surface transition-colors duration-200">
            {transactions.map((tx, idx) => (
              <tr key={`${tx.hash}-${idx}`} className="hover:bg-ink-50 dark:hover:bg-dark-border/50 transition-colors duration-200">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-ink-600 dark:text-dark-text-muted transition-colors duration-200">
                  {formatTime(tx.ts)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-ink-700 dark:text-dark-text transition-colors duration-200">{tx.walletLabel}</div>
                  <div className="text-xs text-ink-400 dark:text-dark-text-subtle font-mono transition-colors duration-200">
                    {tx.walletAddress.slice(0, 8)}...{tx.walletAddress.slice(-8)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full transition-colors duration-200 ${
                    tx.direction === 'in' 
                      ? 'bg-brand-100 text-brand-800 dark:bg-brand-900 dark:text-brand-300' 
                      : 'bg-ink-100 text-ink-600 dark:bg-dark-border dark:text-dark-text-muted'
                  }`}>
                    {tx.direction === 'in' ? '↓ In' : '↑ Out'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-ink-700 dark:text-dark-text transition-colors duration-200">
                  {formatAmount(tx.amount, tx.assetId)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <AssetIcon 
                      assetId={tx.assetId} 
                      symbol={getAssetSymbol(tx.assetId)} 
                      size="sm" 
                    />
                    <span className="text-sm text-ink-600 dark:text-dark-text-muted transition-colors duration-200">
                      {getAssetSymbol(tx.assetId)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <ExplorerButton txHash={tx.hash} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
