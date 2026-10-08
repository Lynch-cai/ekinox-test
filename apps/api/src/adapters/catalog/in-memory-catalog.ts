import type { Catalog, Saga } from "@bttf/pricing";

const SAGAS: Saga[] = [
  {
    name: "Back to the Future",
    episodePriceInCents: 1500,
    discountTiers: [
      { minDistinctMovies: 2, percent: 10 },
      { minDistinctMovies: 3, percent: 20 },
    ],
  },
];

const UNLISTED_MOVIE_PRICE_IN_CENTS = 2000;

export function createInMemoryCatalog(): Catalog {
  return {
    async listSagas() {
      return SAGAS;
    },
    async getUnlistedMoviePriceInCents() {
      return UNLISTED_MOVIE_PRICE_IN_CENTS;
    },
  };
}
