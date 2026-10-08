import type { Movie } from "./movie.ts";

export type Discount = {
  saga: string;
  distinctMovies: number;
  percent: number;
  amountInCents: number;
};

export type CartPrice = {
  movies: Movie[];
  discounts: Discount[];
  totalInCents: number;
};
