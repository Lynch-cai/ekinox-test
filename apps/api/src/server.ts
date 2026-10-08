import path from "node:path";
import { createPriceCartUseCase } from "@bttf/pricing";
import { createInMemoryCatalog } from "./adapters/catalog/in-memory-catalog.ts";
import { createApp } from "./adapters/http/app.ts";
import { cartRoutes } from "./adapters/http/cart/routes.ts";

const catalog = createInMemoryCatalog();

const app = createApp({
  routers: [cartRoutes(createPriceCartUseCase(catalog))],
  webDir: path.join(import.meta.dirname, "..", "..", "web", ".output", "public"),
});

const host = process.env.HOST ?? "localhost";
const port = Number(process.env.PORT ?? 4000);

app.listen(port, host, (error) => {
  if (error) throw error;
  console.log(`API ready on http://${host}:${port}`);
});
