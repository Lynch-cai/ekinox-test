import { once } from "node:events";
import type { AddressInfo } from "node:net";
import type { Express } from "express";

export async function listen(app: Express) {
  const server = app.listen(0);
  await once(server, "listening");
  return { server, url: `http://localhost:${(server.address() as AddressInfo).port}` };
}
