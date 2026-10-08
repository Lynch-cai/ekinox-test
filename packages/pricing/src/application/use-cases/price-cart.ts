import { parseCart } from "../../domain/cart.ts";
import { matchMovies } from "../../domain/movie.ts";
import { computeCartPrice } from "../../domain/pricing.ts";
import type { Catalog } from "../ports/catalog.ts";
import type { PriceCartUseCase } from "../ports/price-cart.ts";

export function createPriceCartUseCase(catalog: Catalog): PriceCartUseCase {
  return async (cart) => {
    const [sagas, unlistedMoviePriceInCents] = await Promise.all([
      catalog.listSagas(),
      catalog.getUnlistedMoviePriceInCents(),
    ]);
    return computeCartPrice(matchMovies(parseCart(cart), sagas, unlistedMoviePriceInCents), sagas);
  };
}
