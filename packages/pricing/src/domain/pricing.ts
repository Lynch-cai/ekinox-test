import type { CartPrice, Discount } from "./types/cart-price.ts";
import type { Movie } from "./types/movie.ts";
import type { Saga } from "./types/saga.ts";

export function computeCartPrice(movies: Movie[], sagas: Saga[]): CartPrice {
  const discounts = sagas
    .map((saga) => sagaDiscount(saga, movies))
    .filter((discount) => discount !== undefined);
  const totalInCents =
    sumOf(movies.map((movie) => movie.priceInCents)) -
    sumOf(discounts.map((discount) => discount.amountInCents));
  return { movies, discounts, totalInCents };
}

function sagaDiscount(saga: Saga, movies: Movie[]): Discount | undefined {
  const sagaMovies = movies.filter((movie) => movie.saga === saga.name);
  const distinctMovies = new Set(sagaMovies.map((movie) => movie.title)).size;
  const percent = Math.max(
    0,
    ...saga.discountTiers
      .filter((tier) => distinctMovies >= tier.minDistinctMovies)
      .map((tier) => tier.percent),
  );
  if (percent === 0) return undefined;

  const amountInCents = Math.round(
    (sumOf(sagaMovies.map((movie) => movie.priceInCents)) * percent) / 100,
  );
  return { saga: saga.name, distinctMovies, percent, amountInCents };
}

function sumOf(amounts: number[]): number {
  return amounts.reduce((sum, amount) => sum + amount, 0);
}
