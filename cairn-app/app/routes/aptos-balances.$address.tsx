// app/routes/aptos-balances.$address.tsx
import { type LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import type { AptosGraphQLResponse, AptosBalance } from "~/types/aptos";
import { env } from "~/utils/env.server";

// Helper: humanize bigint by decimals
const humanize = (raw: bigint, decimals: number) =>
  Number(raw) / 10 ** decimals;

// Loader to fetch FA v2 + legacy coin balances (incl. APT)
export async function loader({ params }: LoaderFunctionArgs) {
  const address = params.address;
  if (!address) throw new Response("Address param missing", { status: 400 });

  const endpoint = "https://indexer.mainnet.aptoslabs.com/v1/graphql";

  // 1) Pull FA v2 balances + legacy coin balances with amount > 0
  const query1 = `
    query AllBalances($address: String!) {
      current_fungible_asset_balances(
        where: {
          owner_address: { _eq: $address }
          amount: { _gt: "0" }
        }
        order_by: { amount: desc }
      ) {
        amount
        asset_type
        token_standard
        metadata { symbol decimals name }
      }

      current_coin_balances(
        where: {
          owner_address: { _eq: $address }
          amount: { _gt: "0" }
        }
        order_by: { amount: desc }
      ) {
        amount
        coin_type
      }
    }`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json"
  };
  
  if (env.APTOS_API_KEY) {
    headers["Authorization"] = `Bearer ${env.APTOS_API_KEY}`;
  }

  const resp1 = await fetch(endpoint, {
    method: "POST",
    headers,
    body: JSON.stringify({ query: query1, variables: { address } }),
  });
  if (!resp1.ok) throw new Response("Indexer error", { status: resp1.status });

  const body1 = (await resp1.json()) as AptosGraphQLResponse as any;

  const faRows: Array<{
    amount: string;
    asset_type: string;
    token_standard: string;
    metadata?: { symbol?: string; decimals?: number; name?: string };
  }> = body1?.data?.current_fungible_asset_balances ?? [];

  const coinRows: Array<{ amount: string; coin_type: string }> =
    body1?.data?.current_coin_balances ?? [];

  // 2) If any legacy coins besides APT appear, enrich with symbol/decimals
  const APT_TYPE = "0x1::aptos_coin::AptosCoin";
  const otherCoinTypes = [
    ...new Set(coinRows.map((r) => r.coin_type).filter((t) => t !== APT_TYPE)),
  ];

  let coinInfoMap = new Map<string, { symbol: string; decimals: number }>();

  if (otherCoinTypes.length > 0) {
    const query2 = `
      query CoinInfos($types: [String!]) {
        current_coin_infos(where: { coin_type: { _in: $types } }) {
          coin_type
          symbol
          decimals
        }
      }`;

    const resp2 = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify({ query: query2, variables: { types: otherCoinTypes } }),
    });
    if (resp2.ok) {
      const body2 = (await resp2.json()) as any;
      const infos: Array<{ coin_type: string; symbol: string; decimals: number }> =
        body2?.data?.current_coin_infos ?? [];
      coinInfoMap = new Map(infos.map((i) => [i.coin_type, { symbol: i.symbol, decimals: i.decimals }]));
    }
  }

  // 3) Normalize FA v2 balances
  const faBalances: AptosBalance[] = faRows.map((r) => {
    const amountRaw = BigInt(r.amount);
    const decimals = r.metadata?.decimals ?? 0;
    return {
      symbol: r.metadata?.symbol ?? r.asset_type,
      decimals,
      amountRaw: amountRaw.toString(), // Convert BigInt to string for JSON serialization
      amount: humanize(amountRaw, decimals),
      assetType: r.asset_type,
      standard: r.token_standard ?? "v2",
    };
  });

  // 4) Normalize legacy coin balances (APT + others)
  const coinBalances: AptosBalance[] = coinRows.map((r) => {
    const amountRaw = BigInt(r.amount);
    // Default assumptions; override below
    let symbol = r.coin_type;
    let decimals = 0;

    if (r.coin_type === APT_TYPE) {
      symbol = "APT";
      decimals = 8; // APT uses 8 decimals
    } else if (coinInfoMap.has(r.coin_type)) {
      const info = coinInfoMap.get(r.coin_type);
      symbol = info?.symbol ?? r.coin_type;
      decimals = info?.decimals ?? 0;
    }

    return {
      symbol,
      decimals,
      amountRaw: amountRaw.toString(), // Convert BigInt to string for JSON serialization
      amount: humanize(amountRaw, decimals),
      assetType: r.coin_type,
      standard: "v2",
    };
  });

  return Response.json({ address, balances: [...faBalances, ...coinBalances] }, {
    headers: { "Cache-Control": "public, max-age=30, s-maxage=60" },
  });
}