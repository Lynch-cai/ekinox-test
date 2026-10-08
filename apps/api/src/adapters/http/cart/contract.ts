export type MovieLine = {
  title: string;
  priceInCents: number;
  saga: string | null;
};

export type DiscountLine = {
  saga: string;
  distinctMovies: number;
  percent: number;
  amountInCents: number;
};

export type CartPriceResponse = {
  movies: MovieLine[];
  discounts: DiscountLine[];
  totalInCents: number;
};
