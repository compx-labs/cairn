import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/_index.tsx"),
  route("/demo", "routes/demo.tsx"),
  route("/wallet/:address", "routes/wallet.$address.tsx"),
  route("/aptos-balances/:address", "routes/aptos-balances.$address.tsx"),
] satisfies RouteConfig;
