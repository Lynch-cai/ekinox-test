import type { Catalog, Saga } from "@bttf/pricing";
import type { Pool } from "pg";

export function createPostgresCatalog(pool: Pool): Catalog {
  return {
    async listSagas() {
      const { rows } = await pool.query<Saga>(
        `SELECT s.name, s.episode_price_in_cents AS "episodePriceInCents",
                coalesce(
                  json_agg(json_build_object('minDistinctMovies', t.min_distinct_movies, 'percent', t.percent))
                    FILTER (WHERE t.saga IS NOT NULL),
                  '[]'
                ) AS "discountTiers"
         FROM sagas s LEFT JOIN saga_discount_tiers t ON t.saga = s.name
         GROUP BY s.name`,
      );
      return rows;
    },
    async getUnlistedMoviePriceInCents() {
      const { rows } = await pool.query<{ priceInCents: number }>(
        `SELECT unlisted_movie_price_in_cents AS "priceInCents" FROM shop_settings`,
      );
      const [settings] = rows;
      if (!settings) throw new Error("shop_settings table is empty: unlisted movie price unknown.");
      return settings.priceInCents;
    },
  };
}
