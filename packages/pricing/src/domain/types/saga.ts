export type DiscountTier = {
  minDistinctMovies: number;
  percent: number;
};

export type Saga = {
  name: string;
  episodePriceInCents: number;
  discountTiers: DiscountTier[];
};
