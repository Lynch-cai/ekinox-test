import { describe, expect, it } from "vitest";
import { computeCartPrice } from "../../src/domain/pricing.ts";
import type { Movie } from "../../src/domain/types/movie.ts";
import type { Saga } from "../../src/domain/types/saga.ts";

const sagaMovie = (title: string): Movie => ({ title, priceInCents: 1000, saga: "Saga" });
const otherMovie: Movie = { title: "Standalone movie", priceInCents: 2000, saga: null };
const saga: Saga = {
  name: "Saga",
  episodePriceInCents: 1000,
  discountTiers: [
    { minDistinctMovies: 2, percent: 10 },
    { minDistinctMovies: 3, percent: 20 },
  ],
};
const totalOf = (movies: Movie[]) => computeCartPrice(movies, [saga]).totalInCents;

describe("computeCartPrice", () => {
  it("no discount below the first tier", () => {
    expect(totalOf([sagaMovie("A"), otherMovie])).toBe(3000);
  });

  it("applies the tier for the number of distinct movies", () => {
    expect(totalOf([sagaMovie("A"), sagaMovie("B")])).toBe(1800);
    expect(totalOf([sagaMovie("A"), sagaMovie("B"), sagaMovie("C")])).toBe(2400);
  });

  it("does not count a duplicate as a distinct movie", () => {
    expect(totalOf([sagaMovie("A"), sagaMovie("A")])).toBe(2000);
  });

  it("discounts duplicates too", () => {
    expect(totalOf([sagaMovie("A"), sagaMovie("B"), sagaMovie("A")])).toBe(2700);
  });

  it("never discounts a non-saga movie", () => {
    expect(totalOf([sagaMovie("A"), sagaMovie("B"), sagaMovie("C"), otherMovie])).toBe(4400);
  });

  it("applies each saga's own tiers", () => {
    const otherSagaMovie = (title: string): Movie => ({
      title,
      priceInCents: 1000,
      saga: "Other saga",
    });
    const half: Saga = {
      name: "Other saga",
      episodePriceInCents: 1000,
      discountTiers: [{ minDistinctMovies: 2, percent: 50 }],
    };
    const movies = [sagaMovie("A"), sagaMovie("B"), otherSagaMovie("X"), otherSagaMovie("Y")];
    expect(computeCartPrice(movies, [saga, half]).totalInCents).toBe(2800);
  });

  it("ignores tier order", () => {
    const reversed: Saga = { ...saga, discountTiers: saga.discountTiers.toReversed() };
    const movies = [sagaMovie("A"), sagaMovie("B"), sagaMovie("C")];
    expect(computeCartPrice(movies, [reversed]).totalInCents).toBe(2400);
  });

  it("rounds the discount to the nearest cent", () => {
    const movie: Movie = { title: "A", priceInCents: 105, saga: "Saga" };
    const tenPercent: Saga = {
      ...saga,
      discountTiers: [{ minDistinctMovies: 1, percent: 10 }],
    };
    expect(computeCartPrice([movie], [tenPercent]).totalInCents).toBe(94);
  });

  it("returns the movies and discounts", () => {
    const movies = [sagaMovie("A"), sagaMovie("B"), sagaMovie("C")];
    expect(computeCartPrice(movies, [saga])).toEqual({
      movies,
      discounts: [{ saga: "Saga", distinctMovies: 3, percent: 20, amountInCents: 600 }],
      totalInCents: 2400,
    });
  });

  it("prices an empty cart at 0", () => {
    expect(computeCartPrice([], [saga])).toEqual({
      movies: [],
      discounts: [],
      totalInCents: 0,
    });
  });
});
