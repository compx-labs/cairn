// app/models/treasury.server.ts
import type { TreasurySnapshot, Tx, SerializableTx, NormalizedBalance, Balance, Asset } from "~/types/treasury";
import { project } from "~/data/project";
import { env } from "~/utils/env.server";
import { cache } from "~/utils/cache.server";
import { getMockSnapshot } from "./mock.server";
import { getWalletBalances, getWalletTxs } from "./indexer.server";

const SNAPSHOT_TTL = 60_000;

export async function getTreasurySnapshot(): Promise<TreasurySnapshot> {
  if (env.USE_MOCK) return getMockSnapshot();

  const key = `snapshot:v1:${project.slug}`;
  const hit = cache.get(key) as TreasurySnapshot | undefined;
  if (hit) return hit;

  // prices: simple $1 for xUSD, fake values for demo until wired
  const priceMap = new Map<number, number>([
    [0, 0.16], // ALGO (example)
    [2994233666, 1], // xUSD
    [1234567890, 0.0018], // COMPX example
  ]);

  const wallets = await Promise.all(project.wallets.map(async (w) => {
    const raw = await getWalletBalances(w.address);
    const norm = normalizeBalances(raw, project.assets, priceMap);
    return {
      label: w.label,
      address: w.address,
      balances: norm,
      lastUpdated: new Date().toISOString(),
    };
  }));

  const txsNested = await Promise.all(project.wallets.map(async (w) => {
    const { txs } = await getWalletTxs(w.address, { limit: 50 });
    return txs.map(tx => ({ ...tx, walletLabel: w.label }));
  }));
  const latestTxs = serializeTxs(mergeLatestTxs(txsNested.flat(), 20));

  const totals = sumTotals(wallets);
  const fiatTotals = { USD: (totals["xUSD"] ?? 0) * 1 + (totals["ALGO"] ?? 0) * (priceMap.get(0) ?? 0) };

  const snapshot: TreasurySnapshot = {
    totals,
    fiatTotals,
    wallets,
    latestTxs,
    lastUpdated: new Date().toISOString(),
  };

  cache.set(key, snapshot, { ttl: SNAPSHOT_TTL });
  return snapshot;
}

function normalizeBalances(raw: Balance[], assets: Asset[], priceMap: Map<number, number>): NormalizedBalance[] {
  const byId = new Map(assets.map(a => [a.id, a]));
  return raw.map(b => {
    const asset = byId.get(b.assetId);
    if (!asset) return { symbol: String(b.assetId), amount: 0 };
    const human = Number(b.amount) / 10 ** asset.decimals;
    const usd = (priceMap.get(asset.id) ?? (asset.symbol === "xUSD" ? 1 : 0)) * human;
    return { symbol: asset.symbol, amount: human, usd };
  }).sort((a,b) => (b.usd ?? b.amount) - (a.usd ?? a.amount));
}

function mergeLatestTxs(all: Tx[], N: number): Tx[] {
  return all.sort((a,b) => b.ts.localeCompare(a.ts)).slice(0, N);
}

function serializeTxs(txs: Tx[]): SerializableTx[] {
  return txs.map(tx => ({
    ...tx,
    amount: tx.amount.toString()
  }));
}

function sumTotals(wallets: TreasurySnapshot["wallets"]): Record<string, number> {
  const totals: Record<string, number> = {};
  wallets.forEach(w => w.balances.forEach(b => {
    totals[b.symbol] = (totals[b.symbol] ?? 0) + b.amount;
  }));
  return totals;
}
