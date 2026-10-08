import type { Pool } from "pg";
import { describe, expect, it } from "vitest";
import { createPostgresCatalog } from "../../../src/adapters/catalog/postgres-catalog.ts";

const rowsByTable: Record<string, object[]> = {
  sagas: [
    {
      name: "Back to the Future",
      episodePriceInCents: 1500,
      discountTiers: [
        { minDistinctMovies: 2, percent: 10 },
        { minDistinctMovies: 3, percent: 20 },
      ],
    },
  ],
  shop_settings: [{ priceInCents: 2000 }],
};
function fakePool(rows: Record<string, object[]>) {
  return {
    async query(sql: string) {
      const table = sql.match(/FROM (\w+)/)?.[1] ?? "";
      return { rows: rows[table] ?? [] };
    },
  } as unknown as Pool;
}
const catalog = createPostgresCatalog(fakePool(rowsByTable));

describe("createPostgresCatalog", () => {
  it("reads sagas with their discount tiers", async () => {
    expect(await catalog.listSagas()).toEqual(rowsByTable.sagas);
  });

  it("reads the unlisted movie price", async () => {
    expect(await catalog.getUnlistedMoviePriceInCents()).toBe(2000);
  });

  it("throws when settings are missing", async () => {
    const empty = createPostgresCatalog(fakePool({}));
    await expect(empty.getUnlistedMoviePriceInCents()).rejects.toThrow("shop_settings");
  });
});
