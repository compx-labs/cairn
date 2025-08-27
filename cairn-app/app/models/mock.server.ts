// app/models/mock.server.ts
import type { TreasurySnapshot, Tx, SerializableTx, NormalizedBalance } from "~/types/treasury";
import { project } from "~/data/project";

// Simple utility to build explorer URLs for mock data
const explorerTx = (hash: string) => `https://allo.info/tx/${hash}`;

function nb(symbol: string, amount: number, usd?: number): NormalizedBalance {
  return { symbol, amount, usd };
}

export function getMockSnapshot(): TreasurySnapshot {
  const now = new Date().toISOString();

  const wallets = [
    {
      label: "Treasury",
      address: project.wallets[0].address,
      balances: [
        nb("ALGO", 125432.987),
        nb("xUSD",  58234.12, 58234.12), // 1:1 USD
        nb("COMPX", 812345.67),
      ],
      lastUpdated: now,
    },
    {
      label: "Ops",
      address: project.wallets[1].address,
      balances: [
        nb("ALGO",  4521.33),
        nb("xUSD",  923.50, 923.50),
        nb("COMPX", 12000.00),
      ],
      lastUpdated: now,
    },
    {
      label: "Rewards",
      address: project.wallets[2].address,
      balances: [
        nb("ALGO",  230.05),
        nb("xUSD",  15000.00, 15000.00),
        nb("COMPX", 3500000.00),
      ],
      lastUpdated: now,
    },
  ];

  const latestTxs: Tx[] = [
    {
      hash: "TXMOCK1",
      ts: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      walletAddress: project.wallets[0].address,
      walletLabel: "Treasury",
      direction: "out",
      assetId: 2994233666, // xUSD
      amount: BigInt(2_500_000), // 2,500.000000 xUSD
      sender: project.wallets[0].address,
      receiver: project.wallets[1].address,
      explorerUrl: explorerTx("TXMOCK1"),
    },
    {
      hash: "TXMOCK2",
      ts: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      walletAddress: project.wallets[1].address,
      walletLabel: "Ops",
      direction: "in",
      assetId: 0, // ALGO
      amount: BigInt(250_000_000), // 250 ALGO
      sender: "SOME_EXT_ADDR",
      receiver: project.wallets[1].address,
      explorerUrl: explorerTx("TXMOCK2"),
    },
    {
      hash: "TXMOCK3",
      ts: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
      walletAddress: project.wallets[2].address,
      walletLabel: "Rewards",
      direction: "in",
      assetId: 1234567890, // COMPX
      amount: BigInt(1_500_000_000), // 1,500,000 COMPX (6 dp)
      sender: project.wallets[0].address,
      receiver: project.wallets[2].address,
      explorerUrl: explorerTx("TXMOCK3"),
    },
  ];

  // naive totals for demo (sum humanized amounts by symbol)
  const totals = { ALGO: 0, xUSD: 0, COMPX: 0 } as Record<string, number>;
  wallets.forEach(w => w.balances.forEach(b => { totals[b.symbol] = (totals[b.symbol] ?? 0) + b.amount; }));

  // Convert BigInt amounts to strings for JSON serialization
  const serializableLatestTxs: SerializableTx[] = latestTxs.map(tx => ({
    ...tx,
    amount: tx.amount.toString()
  }));

  return {
    totals,
    fiatTotals: { USD: totals["xUSD"] }, // demo: xUSD == $1
    wallets,
    latestTxs: serializableLatestTxs.sort((a,b) => b.ts.localeCompare(a.ts)),
    lastUpdated: now,
  };
}
