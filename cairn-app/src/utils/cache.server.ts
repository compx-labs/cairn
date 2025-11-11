// app/utils/cache.server.ts
import { LRUCache } from "lru-cache";
export const cache = new LRUCache<string, any>({ max: 200, ttl: 60_000 });
