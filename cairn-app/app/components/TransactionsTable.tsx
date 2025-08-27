// app/components/TransactionsTable.tsx
import type { SerializableTx } from "~/types/treasury";
import { project } from "~/data/project";
import { ExplorerButton } from "./ExplorerButton";

interface TransactionsTableProps {
  transactions: SerializableTx[];
}

export function TransactionsTable({ transactions }: TransactionsTableProps) {
  const getAssetSymbol = (assetId: number) => {
    const asset = project.assets.find(a => a.id === assetId);
    return asset?.symbol || `Asset ${assetId}`;
  };

  const formatAmount = (amount: string, assetId: number) => {
    const asset = project.assets.find(a => a.id === assetId);
    const decimals = asset?.decimals || 6;
    const humanAmount = Number(BigInt(amount)) / (10 ** decimals);
    return humanAmount.toLocaleString(undefined, { 
      maximumFractionDigits: asset?.symbol === 'COMPX' ? 0 : 2 
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

  if (transactions.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-line p-8 text-center">
        <div className="text-ink-400">No recent transactions</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-line overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-ink-50 border-b border-line">
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
          <tbody className="divide-y divide-line dark:divide-dark-border transition-colors duration-200">
            {transactions.map((tx, idx) => (
              <tr key={`${tx.hash}-${idx}`} className="hover:bg-ink-50 dark:hover:bg-dark-border transition-colors duration-200">
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
                <td className="px-6 py-4 whitespace-nowrap text-sm text-ink-600 dark:text-dark-text-muted transition-colors duration-200">
                  {getAssetSymbol(tx.assetId)}
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
