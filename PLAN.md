Here’s the full plan **formatted in Markdown**, with an **intro/explanation** at the top. You can drop this straight into a README or hand-off doc for Claude 👇

---

# Cairn – Transparency Dashboard (MVP Plan)

## 📖 What is Cairn?

Cairn is a **Web3 transparency dashboard** designed to give projects a simple, trustworthy way to show their communities how treasury funds are managed. Inspired by the cairns of Scotland — stone markers that guide travelers — Cairn acts as a digital marker of openness, stacking verifiable on-chain data into a clear, public view.

## 🎯 Goals of Cairn

* **Clarity**: Provide an easy, “at-a-glance” overview of a project’s treasury.
* **Proof**: Every balance and transaction links back to the blockchain.
* **Trust**: Show who’s behind the project (team section) alongside verifiable wallet activity.
* **SaaS foundation**: Start with one hardcoded project (CompX), but design so it can later support multi-tenant onboarding.

## 🛠️ Goal of the MVP

The MVP is **read-only, public, Algorand-only**. It will:

* Display treasury wallets (balances + latest transactions).
* Provide combined totals (with USD estimates).
* Offer a wallet detail view (with paginated transactions).
* Show the team behind the project (photo, name, role, contact).
* Be configured via a **hardcoded project config** (no auth/admin yet).
* Use **Remix** with in-memory caching and clean public APIs.

---

# 📦 Features (MVP Scope)

* **Landing dashboard**

  * Project header (logo/name/description).
  * Treasury overview: wallet cards, combined totals, last updated.
  * Latest 20 transactions (merged across notable wallets).
  * Team grid with contact info.

* **Wallet detail**

  * Full address, copy + explorer button.
  * Balances by asset (+ USD, % of wallet).
  * Paginated transactions with direction.

* **Public API endpoints**

  * Treasury snapshot (`/api/public/treasury`).
  * Wallet transactions (`/api/public/wallet/:address/txs`).
  * Prices (`/api/public/prices`).

* **Caching**

  * In-memory LRU cache (30–60s).
  * Cache-control headers for CDN.

---

# 📂 File Tree (Remix)

```
app/
  components/
    Section.tsx
    WalletCard.tsx
    TotalsCard.tsx
    TransactionsTable.tsx
    TeamCard.tsx
    CopyButton.tsx
    ExplorerButton.tsx
    Skeleton.tsx
    ErrorBanner.tsx
  data/
    project.ts
  models/
    indexer.server.ts
    prices.server.ts
    treasury.server.ts
  routes/
    _index.tsx
    wallets.$address.tsx
    api.public.treasury.ts
    api.public.wallet.$address.txs.ts
    api.public.prices.ts
  types/
    treasury.ts
  utils/
    env.server.ts
    explorer.ts
    format.ts
    cache.server.ts
  styles/
    tailwind.css
```

---

# 📝 Raw Tasks

## 0) Repo & Tooling

* Init Remix (TypeScript).
* Add Tailwind, PostCSS, theme tokens.
* Add deps: `zod`, `lru-cache`, `date-fns`, `clsx`.
* Strict TS config.

## 1) Branding & Theme

* Import **Cairn** teal stacked-stones SVG.
* Tailwind colors:

  * `--brand: #00F5C0`, `--ink: #26323A`, `--bg: #F9FAFB`, `--line: #E5E7EB`.
* Add favicon + OG image.

## 2) Hardcoded Project Config

* `app/data/project.ts` with:

  * Project info (name, slug, logo, description).
  * Wallets `[ { label, address } ]`.
  * Assets `[ { id, symbol, decimals } ]`.
  * Team `[ { name, role, photoUrl, contacts } ]`.

## 3) Types

* `app/types/treasury.ts` defining `Asset`, `Wallet`, `Balance`, `Tx`, `TreasurySnapshot`.

## 4) Utils & Env

* `env.server.ts` for validated envs (`ALGOD_INDEXER_URL`, `ALGOD_INDEXER_TOKEN?`).
* `explorer.ts` for address/tx links.
* `format.ts` for decimals/fiat helpers.
* `cache.server.ts` with shared LRU.

## 5) Indexer Integration

* `models/indexer.server.ts`:

  * `getWalletBalances(address)`.
  * `getWalletTxs(address, opts)`.
  * Normalize to internal `Tx`.
  * Direction by comparing sender/receiver.
  * Map assets → symbols.

## 6) Prices

* `models/prices.server.ts`:

  * `getAssetPriceUSD(assetId|0)`.
  * `getPriceMap(assets)`.
  * Static source or simple API.

## 7) Aggregation

* `models/treasury.server.ts`:

  * `fetchWalletSnapshot(wallet, assets)`.
  * `mergeLatestTxs(allTxs, N)`.
  * `sumTotals(wallets)`.
  * Cache snapshot for 30–60s.

## 8) API Routes

* `routes/api.public.treasury.ts` → treasury snapshot.
* `routes/api.public.wallet.$address.txs.ts` → paginated txs.
* `routes/api.public.prices.ts` → prices.

## 9) Page Routes

* `_index.tsx` loader → full snapshot, render totals, wallets, txs, team.
* `wallets.$address.tsx` loader → wallet balances + txs, render detail view.

## 10) Components

* `Section`
* `TotalsCard`
* `WalletCard`
* `TransactionsTable`
* `TeamCard`
* Helpers: `CopyButton`, `ExplorerButton`, `Skeleton`, `ErrorBanner`.

## 11) UX Polish

* Loading skeletons, error states.
* Last updated timestamp.
* Responsive layouts.
* Accessibility checks.

## 12) Tests

* Unit: balance normalization, direction, price math.
* Integration: treasury loader with mocked indexer.
* Component smoke tests.

## 13) Deployment

* Deploy with Remix adapter (Fly.io / DO / Vercel).
* Set env vars.
* Verify cache headers.

## 14) Acceptance Criteria

* Project shows logo, description.
* Wallets display balances correctly.
* Combined totals + USD estimate visible.
* Latest 20 tx merged across wallets with explorer links.
* Wallet detail works with pagination.
* Team grid visible.
* API JSON validates schemas.
* Responsive + accessible.

---

## 🔜 Post-MVP Backlog

* Background job to pre-warm cache.
* Multi-tenant (project by subdomain).
* Admin onboarding (email/pass or wallet auth).
* Transaction categorisation.
* CSV export + embed widgets.

---
