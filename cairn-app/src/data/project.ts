// app/data/project.ts
import { z } from "zod";

export const AssetSchema = z.object({
  id: z.number(), // 0 = ALGO
  symbol: z.string(), // "ALGO", "xUSD", "COMPX"
  decimals: z.number(), // 6 for ALGO/xUSD/etc.
});
export const WalletSchema = z.object({
  label: z.string(), // "Treasury", "Ops", etc.
  address: z.string(), // Algorand address
  network: z.string(), // "algorand", "ethereum", etc.
});
export const TeamSchema = z.object({
  name: z.string(),
  role: z.string(),
  photoUrl: z.string().optional(),
  contacts: z
    .object({
      x: z.string().url().optional(),
      email: z.string().email().optional(),
      site: z.string().url().optional(),
    })
    .optional(),
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
  name: "CompX Transparency Dashboard",
  logoUrl: "/cairn-logo.png",
  description:
    "Public, on-chain transparency dashboard for the CompX treasury.",
  wallets: [
    {
      label: "Treasury",
      network: "algorand",
      address: "HPD6ZADEDED6EIZ6HDGDJG4QQWVSEPUOKOPJD7BFTKUC7YFHHGFVYTW5QQ",
    },
    {
      label: "Community Treasury",
      network: "algorand",
      address: "KPEZM2DSFHOOHG7RPDECCBTD6FRN2LPSSRJMMFVCFSIHGES4BXBJHPUBVQ",
    },
    {
      label: "Reward Injector",
      network: "algorand",
      address: "RY773S3CRF5LVOD2KPKFV5P5MBX44MECMI3ESO4AG3B43JN5YEHASGZKCY",
    },
    {
      label: "Aptos Treasury",
      network: "aptos",
      address: "0x5b1276d4f54e6919c4356adfe7f89bd72934894b6cc00e95607b8594abf9e912",
    },
  ],
  assets: [
    { id: 0, symbol: "ALGO", decimals: 6 },
    { id: 2994233666, symbol: "xUSD", decimals: 6 },
    { id: 1234567890, symbol: "COMPX", decimals: 6 }, // replace with real ASA id
  ],
  team: [
    {
      name: "Kieran Nelson",
      role: "Founder",
      photoUrl: "/team/kieran.png",
      contacts: { x: "https://x.com/xxiled1", email: "kieran@compx.io" },
    },
  ],
};

export const project = ProjectSchema.parse(rawProject);
