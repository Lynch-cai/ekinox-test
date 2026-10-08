import { describe, expect, it } from "vitest";
import { matchMovies } from "../../src/domain/movie.ts";
import type { Saga } from "../../src/domain/types/saga.ts";

const saga: Saga = { name: "Star Saga", episodePriceInCents: 1000, discountTiers: [] };
const episode = (number: number) => ({
  title: `Star Saga ${number}`,
  priceInCents: 1000,
  saga: "Star Saga",
});

describe("matchMovies", () => {
  it("recognizes any episode number of a saga", () => {
    expect(matchMovies(["Star Saga 1", "Star Saga 4", "Star Saga 12"], [saga], 2000)).toEqual([
      episode(1),
      episode(4),
      episode(12),
    ]);
  });

  it("treats the saga name alone as episode 1", () => {
    expect(matchMovies(["Star Saga"], [saga], 2000)).toEqual([episode(1)]);
  });

  it("ignores case and extra spaces", () => {
    const nbsp = String.fromCharCode(0xa0);
    expect(
      matchMovies(["star saga 2", "  STAR   SAGA 2 ", `Star${nbsp}Saga 2`], [saga], 2000),
    ).toEqual([episode(2), episode(2), episode(2)]);
  });

  it("prices other titles as unlisted movies", () => {
    expect(
      matchMovies(["La chèvre", "Star Saga 0", "Star Sagas 2", "Star Saga 2b"], [saga], 1800),
    ).toEqual([
      { title: "La chèvre", priceInCents: 1800, saga: null },
      { title: "Star Saga 0", priceInCents: 1800, saga: null },
      { title: "Star Sagas 2", priceInCents: 1800, saga: null },
      { title: "Star Saga 2b", priceInCents: 1800, saga: null },
    ]);
  });

  it("reads a saga name with regex characters literally", () => {
    const dotted: Saga = { ...saga, name: "S.A.G.A" };
    expect(matchMovies(["SXAXGXA 2"], [dotted], 2000)[0]?.saga).toBeNull();
    expect(matchMovies(["s.a.g.a 2"], [dotted], 2000)[0]?.saga).toBe("S.A.G.A");
  });
});
