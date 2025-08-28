// app/routes/demo.tsx
import { project } from "~/data/project";
import { Section } from "~/components/Section";
import { TotalsCard } from "~/components/TotalsCard";
import { WalletCard } from "~/components/WalletCard";
import { TeamCard } from "~/components/TeamCard";
import { ThemeToggle } from "~/components/ThemeToggle";
import { useWallets } from "~/contexts/WalletContext";
import type { TreasurySnapshot, NormalizedBalance } from "~/types/treasury";



export function meta() {
  return [
    { title: `${project.name} – Demo Treasury` },
    { name: "description", content: project.description },
  ];
}

export default function Demo() {
  const { wallets, isAnyLoading, hasErrors, totalUsdValue } = useWallets();

  // Transform wallet context data to TreasurySnapshot format
  const transformedWallets = wallets.map(wallet => {
    if (!wallet.data) {
      return {
        label: wallet.label,
        address: wallet.address,
        balances: [] as NormalizedBalance[],
        lastUpdated: new Date().toISOString(),
      };
    }

    // Transform assets to normalized balances
    const balances: NormalizedBalance[] = wallet.data.assets
      .filter(asset => asset.amount > 0) // Only show assets with positive balance
      .map(asset => {
        // Apply decimals to get human-readable amount
        const humanAmount = asset.amount / Math.pow(10, asset.decimals);
        
        return {
          symbol: asset["unit-name"] || `Asset ${asset["asset-id"]}`,
          amount: humanAmount,
          usd: asset.value, // The API already provides USD value
        };
      })
      .sort((a, b) => (b.usd || b.amount) - (a.usd || a.amount)); // Sort by USD value, then amount

    return {
      label: wallet.label,
      address: wallet.address,
      balances,
      lastUpdated: new Date().toISOString(),
    };
  });

  // Calculate totals across all wallets
  const totals: Record<string, number> = {};
  transformedWallets.forEach(wallet => {
    wallet.balances.forEach(balance => {
      totals[balance.symbol] = (totals[balance.symbol] || 0) + balance.amount;
    });
  });

  // Create TreasurySnapshot-compatible object
  const snapshot: TreasurySnapshot = {
    totals,
    fiatTotals: { USD: totalUsdValue },
    wallets: transformedWallets,
    latestTxs: [], // Empty for now as requested
    lastUpdated: new Date().toISOString(),
  };

  // Show loading state
  if (isAnyLoading) {
    return (
      <div className="min-h-screen bg-bg dark:bg-dark-bg transition-colors duration-200 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-semibold text-ink-700 dark:text-dark-text mb-2">Loading treasury data...</div>
          <div className="text-ink-500 dark:text-dark-text-muted">Fetching wallet information from the blockchain</div>
        </div>
      </div>
    );
  }

  // Show error state
  if (hasErrors) {
    return (
      <div className="min-h-screen bg-bg dark:bg-dark-bg transition-colors duration-200 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-semibold text-red-600 dark:text-red-400 mb-2">Error loading treasury data</div>
          <div className="text-ink-500 dark:text-dark-text-muted">Please try refreshing the page</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg dark:bg-dark-bg transition-colors duration-200">
      {/* Header */}
      <header className="bg-white dark:bg-dark-surface border-b border-line dark:border-dark-border transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img
                src={project.logoUrl}
                alt={project.name}
                className="h-12 w-12 rounded-full"
              />
              <div>
                <h1 className="text-3xl font-bold text-ink-700 dark:text-dark-text font-heading transition-colors duration-200">{project.name}</h1>
                <p className="text-ink-500 dark:text-dark-text-muted mt-1 transition-colors duration-200">{project.description}</p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Treasury Overview */}
          <Section title="Treasury Overview">
            <TotalsCard snapshot={snapshot} />
          </Section>

          {/* Wallet Breakdown */}
          <Section title="Wallet Breakdown">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {snapshot.wallets.map((wallet, idx) => (
                <WalletCard key={idx} wallet={wallet} />
              ))}
            </div>
          </Section>

          {/* Recent Transactions - Coming Soon */}
          <Section title="Recent Transactions">
            <div className="bg-white dark:bg-dark-surface rounded-xl border border-line dark:border-dark-border p-8 shadow-sm transition-colors duration-200 text-center">
              <div className="text-ink-500 dark:text-dark-text-muted">
                Transaction history coming soon...
              </div>
            </div>
          </Section>

          {/* Team */}
          <Section title="Team">
            <TeamCard />
          </Section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-dark-surface border-t border-line dark:border-dark-border mt-16 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img
                src={project.logoUrl}
                alt="Cairn"
                className="h-6 w-6"
              />
              <span className="text-sm text-ink-500 dark:text-dark-text-muted transition-colors duration-200">
                Powered by Cairn - Transparency through verification
              </span>
            </div>
            <div className="text-sm text-ink-400 dark:text-dark-text-subtle transition-colors duration-200">
              Last updated: {new Date(snapshot.lastUpdated).toLocaleString()}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}


