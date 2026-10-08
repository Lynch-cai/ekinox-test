import type { Movie } from "./types/movie.ts";
import type { Saga } from "./types/saga.ts";

function normalizeTitle(title: string): string {
  return title.replace(/\s+/g, " ").trim().toLowerCase();
}

function sagaEpisode(title: string, saga: Saga): Movie | undefined {
  const episodeTitle = new RegExp(`^${RegExp.escape(normalizeTitle(saga.name))}(?: ([1-9]\\d*))?$`);
  const match = episodeTitle.exec(normalizeTitle(title));
  if (!match) return undefined;
  return {
    title: `${saga.name} ${Number(match[1] ?? 1)}`,
    priceInCents: saga.episodePriceInCents,
    saga: saga.name,
  };
}

export function matchMovies(
  titles: string[],
  sagas: Saga[],
  unlistedMoviePriceInCents: number,
): Movie[] {
  return titles.map(
    (title) =>
      sagas.map((saga) => sagaEpisode(title, saga)).find((movie) => movie !== undefined) ?? {
        title,
        priceInCents: unlistedMoviePriceInCents,
        saga: null,
      },
  );
}
