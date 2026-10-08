import type { CartPriceResponse } from "@bttf/api/cart/contract";
import { registerEndpoint, renderSuspended } from "@nuxt/test-utils/runtime";
import { cleanup, screen } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";
import { setResponseStatus } from "h3";
import { afterEach, describe, expect, it } from "vitest";
import CartPage from "~/pages/cart.vue";

const EXAMPLE_5_PRICE: CartPriceResponse = {
  movies: [
    { title: "Back to the Future 1", priceInCents: 1500, saga: "Back to the Future" },
    { title: "Back to the Future 2", priceInCents: 1500, saga: "Back to the Future" },
    { title: "Back to the Future 3", priceInCents: 1500, saga: "Back to the Future" },
    { title: "La chèvre", priceInCents: 2000, saga: null },
  ],
  discounts: [{ saga: "Back to the Future", distinctMovies: 3, percent: 20, amountInCents: 900 }],
  totalInCents: 5600,
};

function apiRespondsOnce(status: number, body: object) {
  registerEndpoint("/api/cart/price", {
    method: "POST",
    once: true,
    handler: (event) => {
      setResponseStatus(event, status);
      return body;
    },
  });
}

afterEach(cleanup);

async function submitCart(user: ReturnType<typeof userEvent.setup>, cart: string) {
  await user.clear(screen.getByTestId("cart-input"));
  await user.type(screen.getByTestId("cart-input"), cart);
  await user.click(screen.getByTestId("cart-submit"));
}

describe("CartPage", () => {
  it("adds and removes a movie with its button, keeping the typed lines", async () => {
    const user = userEvent.setup();
    await renderSuspended(CartPage);
    const input = screen.getByTestId("cart-input") as HTMLTextAreaElement;
    await user.clear(input);
    await user.type(input, "La chèvre");
    const [firstMovie] = screen.getAllByTestId("movie-toggle");

    await user.click(firstMovie!);
    expect(input.value).toBe("La chèvre\nBack to the Future 1");
    expect(firstMovie!.getAttribute("aria-pressed")).toBe("true");

    await user.click(firstMovie!);
    expect(input.value).toBe("La chèvre");
    expect(firstMovie!.getAttribute("aria-pressed")).toBe("false");
  });

  it("shows the error message returned by the API", async () => {
    const user = userEvent.setup();
    await renderSuspended(CartPage);
    apiRespondsOnce(500, { error: "API error." });
    await submitCart(user, "Back to the Future 1");

    expect((await screen.findByTestId("cart-error")).textContent).toContain("API error.");
  });

  it("clears the previous price when the API responds with an error", async () => {
    const user = userEvent.setup();
    await renderSuspended(CartPage);
    apiRespondsOnce(200, EXAMPLE_5_PRICE);
    await submitCart(user, "Back to the Future 1");
    expect(await screen.findByTestId("cart-receipt")).toBeTruthy();

    apiRespondsOnce(500, { error: "API error." });
    await submitCart(user, "Back to the Future 1");
    await screen.findByTestId("cart-error");

    expect(screen.getByTestId("cart-total").textContent).toBe("");
    expect(screen.queryByTestId("cart-receipt")).toBeNull();
  });
});
