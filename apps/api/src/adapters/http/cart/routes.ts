import type { CartPrice, PriceCartUseCase } from "@bttf/pricing";
import { Router } from "express";
import type { CartPriceResponse } from "./contract.ts";

function toCartPriceResponse({ movies, discounts, totalInCents }: CartPrice): CartPriceResponse {
  return {
    movies: movies.map(({ title, priceInCents, saga }) => ({ title, priceInCents, saga })),
    discounts: discounts.map(({ saga, distinctMovies, percent, amountInCents }) => ({
      saga,
      distinctMovies,
      percent,
      amountInCents,
    })),
    totalInCents,
  };
}

export function cartRoutes(priceCart: PriceCartUseCase) {
  const router = Router();

  router.post("/cart/price", async (req, res) => {
    const cart: unknown = req.body?.cart;
    if (typeof cart !== "string") {
      res
        .status(400)
        .json({ error: 'The "cart" field must contain the cart, one title per line.' });
      return;
    }
    res.json(toCartPriceResponse(await priceCart(cart)));
  });

  return router;
}
