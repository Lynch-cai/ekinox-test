import type { CartPriceResponse } from "@bttf/api/cart/contract";

export function useCartPrice() {
  const price = ref<CartPriceResponse>();
  const error = ref<string>();
  const pending = ref(false);

  async function compute(cart: string) {
    pending.value = true;
    try {
      price.value = await $fetch<CartPriceResponse>("/api/cart/price", {
        method: "POST",
        body: { cart },
      });
      error.value = undefined;
    } catch (cause) {
      price.value = undefined;
      const message = (cause as { data?: { error?: unknown } }).data?.error;
      error.value =
        typeof message === "string"
          ? message
          : "The calculation failed: the pricing service is not responding.";
    } finally {
      pending.value = false;
    }
  }

  return { price, error, pending, compute };
}
