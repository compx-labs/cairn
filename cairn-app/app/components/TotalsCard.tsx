// app/components/TotalsCard.tsx
import type { TreasurySnapshot } from "~/types/treasury";

interface TotalsCardProps {
  snapshot: TreasurySnapshot;
}

export function TotalsCard({ snapshot }: TotalsCardProps) {
  const { totals, fiatTotals, lastUpdated } = snapshot;

  return (
    <div className="bg-white dark:bg-dark-surface rounded-xl border border-line dark:border-dark-border p-6 shadow-sm transition-colors duration-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-ink-700 dark:text-dark-text font-heading transition-colors duration-200">Treasury Totals</h3>
        <span className="text-sm text-ink-400 dark:text-dark-text-subtle transition-colors duration-200">
          Updated {new Date(lastUpdated).toLocaleTimeString()}
        </span>
      </div>
      


      {fiatTotals && (
        <div className="mt-6 pt-4 border-t border-line dark:border-dark-border transition-colors duration-200">
          <div className="text-center">
            <div className="text-3xl font-bold text-brand-600 transition-colors duration-200">
              ${fiatTotals.USD.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </div>
            <div className="text-sm text-ink-500 dark:text-dark-text-muted transition-colors duration-200">Total USD Value</div>
          </div>
        </div>
      )}
    </div>
  );
}
