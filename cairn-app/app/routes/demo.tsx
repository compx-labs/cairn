// app/routes/demo.tsx
import { project } from "~/data/project";
import { Section } from "~/components/Section";
import { TotalsCard } from "~/components/TotalsCard";
import { WalletCard } from "~/components/WalletCard";
import { TransactionsTable } from "~/components/TransactionsTable";
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

// Helper function to format LP token names
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

export default function Demo() {
  const { wallets, isAnyLoading, hasErrors, latestTransactions, isTransactionsLoading } = useWallets();

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

    // Transform balances to normalized format
    const balances: NormalizedBalance[] = wallet.data.balances
      .filter(balance => balance.amount > 0) // Only show assets with positive balance
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
      balances,
      lastUpdated: wallet.data.lastUpdated,
    };
  });

  // Calculate totals across all wallets
  const totals: Record<string, number> = {};
  let totalUsdValue = 0;
  
  transformedWallets.forEach(wallet => {
    wallet.balances.forEach(balance => {
      totals[balance.symbol] = (totals[balance.symbol] || 0) + balance.amount;
      totalUsdValue += balance.usd || 0;
    });
  });

  // Create TreasurySnapshot-compatible object
  const snapshot: TreasurySnapshot = {
    totals,
    fiatTotals: { USD: totalUsdValue },
    wallets: transformedWallets,
    latestTxs: latestTransactions,
    lastUpdated: new Date().toISOString(),
  };

  // Show error state only if all wallets failed
  const allWalletsFailed = wallets.length > 0 && wallets.every(wallet => wallet.error !== null);
  if (allWalletsFailed) {
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
            <TotalsCard snapshot={isAnyLoading ? undefined : snapshot} isLoading={isAnyLoading} />
          </Section>

          {/* Wallet Breakdown */}
          <Section title="Wallet Breakdown">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wallets.map((contextWallet, idx) => {
                const transformedWallet = transformedWallets[idx];
                return (
                  <WalletCard 
                    key={idx} 
                    wallet={contextWallet.isLoading ? undefined : transformedWallet}
                    isLoading={contextWallet.isLoading}
                    label={contextWallet.label}
                    address={contextWallet.address}
                    network={contextWallet.network}
                  />
                );
              })}
            </div>
          </Section>

          {/* Recent Transactions */}
          <Section title="Recent Transactions">
            <TransactionsTable 
              transactions={isTransactionsLoading ? undefined : snapshot.latestTxs} 
              isLoading={isTransactionsLoading} 
            />
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


