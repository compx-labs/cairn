// app/data/project.ts
import { z } from "zod";

export const AssetSchema = z.object({
  id: z.number(),          // 0 = ALGO
  symbol: z.string(),      // "ALGO", "xUSD", "COMPX"
  decimals: z.number(),    // 6 for ALGO/xUSD/etc.
});
export const WalletSchema = z.object({
  label: z.string(),       // "Treasury", "Ops", etc.
  address: z.string(),     // Algorand address
});
export const TeamSchema = z.object({
  name: z.string(),
  role: z.string(),
  photoUrl: z.string().optional(),
  contacts: z.object({
    x: z.string().url().optional(),
    email: z.string().email().optional(),
    site: z.string().url().optional(),
  }).optional(),
});

export const ProjectSchema = z.object({
  slug: z.string(),
  name: z.string(),
  logoUrl: z.string(),
  description: z.string(),
  wallets: z.array(WalletSchema),
  assets: z.array(AssetSchema),
  team: z.array(TeamSchema),
});

export type Project = z.infer<typeof ProjectSchema>;

const rawProject: Project = {
  slug: "compx",
  name: "Cairn Demo – CompX",
  logoUrl: "/cairn-logo.svg",
  description: "Public, on-chain transparency dashboard for the CompX treasury.",
  wallets: [
    { label: "Treasury", address: "TREASURY_ADDR_XXXXXXXXXXXXXX" },
    { label: "Ops",      address: "OPS_ADDR_XXXXXXXXXXXXXXXXXXX" },
    { label: "Rewards",  address: "REWARDS_ADDR_XXXXXXXXXXXXXXX" },
  ],
  assets: [
    { id: 0,           symbol: "ALGO",  decimals: 6 },
    { id: 2994233666,  symbol: "xUSD",  decimals: 6 },
    { id: 1234567890,  symbol: "COMPX", decimals: 6 }, // replace with real ASA id
  ],
  team: [
    {
      name: "Kieran Nelson",
      role: "Founder",
      photoUrl: "/team/kieran.png",
      contacts: { x: "https://x.com/xxiled1", email: "kieran@compx.io" }
    },
  ],
};

export const project = ProjectSchema.parse(rawProject);
