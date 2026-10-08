import { createPriceCartUseCase, type Catalog } from "@bttf/pricing";
import { afterAll, describe, expect, it, onTestFinished, vi } from "vitest";
import { createInMemoryCatalog } from "../../../../src/adapters/catalog/in-memory-catalog.ts";
import { createApp } from "../../../../src/adapters/http/app.ts";
import type { CartPriceResponse } from "../../../../src/adapters/http/cart/contract.ts";
import { cartRoutes } from "../../../../src/adapters/http/cart/routes.ts";
import { listen } from "../../../listen.ts";

function cartApp(catalog: Catalog) {
  return createApp({ routers: [cartRoutes(createPriceCartUseCase(catalog))] });
}

const { server, url: baseUrl } = await listen(cartApp(createInMemoryCatalog()));
afterAll(() => {
  server.close();
});

function postCart(body: string, url = baseUrl): Promise<Response> {
  return fetch(`${url}/api/cart/price`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });
}

async function totalOf(cart: string): Promise<number> {
  const response = await postCart(JSON.stringify({ cart }));
  expect(response.status).toBe(200);
  const { totalInCents } = (await response.json()) as CartPriceResponse;
  return totalInCents;
}

describe("brief examples", () => {
  it.each([
    {
      example: "n°1",
      cart: "Back to the Future 1\n\nBack to the Future 2\n\nBack to the Future 3",
      totalInCents: 3600,
    },
    { example: "n°2", cart: "Back to the Future 1\n\nBack to the Future 3", totalInCents: 2700 },
    { example: "n°3", cart: "Back to the Future 1", totalInCents: 1500 },
    {
      example: "n°4",
      cart: "Back to the Future 1\n\nBack to the Future 2\n\nBack to the Future 3\n\nBack to the Future 2",
      totalInCents: 4800,
    },
  ])("example $example: $totalInCents cents", async ({ cart, totalInCents }) => {
    expect(await totalOf(cart)).toBe(totalInCents);
  });
});

describe("real catalog", () => {
  it('treats "Back to the Future" as part 1', async () => {
    expect(await totalOf("Back to the Future\nBack to the Future 1")).toBe(3000);
  });

  it("recognizes episodes beyond the third", async () => {
    expect(await totalOf("Back to the Future 1\nBack to the Future 4")).toBe(2700);
  });
});

describe("errors", () => {
  it("rejects a non-text cart", async () => {
    const response = await postCart(JSON.stringify({ cart: ["Back to the Future 1"] }));
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      error: 'The "cart" field must contain the cart, one title per line.',
    });
  });

  it("returns 500 when the catalog fails", async () => {
    const outage = new Error("database unreachable");
    const failing = await listen(
      cartApp({
        listSagas: () => Promise.reject(outage),
        getUnlistedMoviePriceInCents: async () => 2000,
      }),
    );
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    onTestFinished(() => {
      failing.server.close();
      consoleError.mockRestore();
    });

    const response = await postCart(JSON.stringify({ cart: "Back to the Future 1" }), failing.url);
    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: "Internal server error." });
    expect(consoleError).toHaveBeenCalledWith(outage);
  });
});
