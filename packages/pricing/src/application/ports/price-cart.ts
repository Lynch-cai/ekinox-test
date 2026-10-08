import type { CartPrice } from "../../domain/types/cart-price.ts";

export type PriceCartUseCase = (cart: string) => Promise<CartPrice>;
