// app/utils/env.server.ts
import { z } from "zod";

const EnvSchema = z.object({
  USE_MOCK: z.string().optional(), // "true" to use mock
  ALGOD_INDEXER_URL: z.string().optional(),
  ALGOD_INDEXER_TOKEN: z.string().optional(),
});

const parsed = EnvSchema.parse(process.env);
export const env = {
  USE_MOCK: parsed.USE_MOCK === "true",
  ALGOD_INDEXER_URL: parsed.ALGOD_INDEXER_URL,
  ALGOD_INDEXER_TOKEN: parsed.ALGOD_INDEXER_TOKEN,
};
