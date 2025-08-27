// app/routes/demo.tsx
import { type LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import { getTreasurySnapshot } from "~/models/treasury.server";
import type { TreasurySnapshot } from "~/types/treasury";
import { project } from "~/data/project";
import { Section } from "~/components/Section";
import { TotalsCard } from "~/components/TotalsCard";
import { WalletCard } from "~/components/WalletCard";
import { TransactionsTable } from "~/components/TransactionsTable";
import { TeamCard } from "~/components/TeamCard";
import { ThemeToggle } from "~/components/ThemeToggle";

export async function loader(_: LoaderFunctionArgs) {
  const data = await getTreasurySnapshot();
  return Response.json(data, {
    headers: { "Cache-Control": "public, max-age=30, s-maxage=60" },
  });
}

export function meta() {
  return [
    { title: `${project.name} – Demo Treasury` },
    { name: "description", content: project.description },
  ];
}

export default function Demo() {
  const snapshot = useLoaderData<TreasurySnapshot>();

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

          {/* Recent Transactions */}
          <Section title="Recent Transactions">
            <TransactionsTable transactions={snapshot.latestTxs} />
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


