// app/models/indexer.server.ts
import type { Balance, Tx } from "~/types/treasury";
import { project } from "~/data/project";

export async function getWalletBalances(_address: string): Promise<Balance[]> {
  // TODO: Implement against Algorand Indexer
  // Return amounts as *base units* (e.g., microAlgos); UI will humanize by decimals.
  return [];
}

export async function getWalletTxs(_address: string, _opts?: { limit?: number; next?: string })
: Promise<{ txs: Tx[]; next?: string }> {
  // TODO: Implement against Algorand Indexer
  return { txs: [] };
}

// Helpers Claude can implement later:
// - map indexer asset holdings -> Balance[]
// - map indexer transactions -> Tx (set direction via sender/receiver vs address)
