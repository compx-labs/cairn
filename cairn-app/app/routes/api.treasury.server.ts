// app/routes/api.public.treasury.ts
import {  type LoaderFunctionArgs } from "react-router";
import { getTreasurySnapshot } from "~/models/treasury.server";
import type { TreasurySnapshot } from "~/types/treasury";

export async function loader(_: LoaderFunctionArgs) {
  const data = await getTreasurySnapshot();
  return Response.json(data, {
    headers: { "Cache-Control": "public, max-age=30, s-maxage=60" },
  });
}
