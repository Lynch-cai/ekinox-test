import { expect, test } from "@playwright/test";

test("prices the brief's example #5", async ({ page }) => {
  await page.goto("/cart");
  await page
    .getByTestId("cart-input")
    .fill("Back to the Future 1\nBack to the Future 2\nBack to the Future 3\nLa chèvre");
  await page.getByTestId("cart-submit").click();

  await expect(page.getByTestId("cart-total")).toHaveText("Total: €56.00");
  await expect(page.getByTestId("receipt-line")).toHaveText(
    [
      "Back to the Future 1 €15.00",
      "Back to the Future 2 €15.00",
      "Back to the Future 3 €15.00",
      "La chèvre (other movie) €20.00",
      "Back to the Future discount: 3 different movies, -20% -€9.00",
    ],
    { useInnerText: true },
  );
});
