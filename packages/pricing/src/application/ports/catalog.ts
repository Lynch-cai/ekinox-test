import type { Saga } from "../../domain/types/saga.ts";

export interface Catalog {
  listSagas(): Promise<Saga[]>;
  getUnlistedMoviePriceInCents(): Promise<number>;
}
