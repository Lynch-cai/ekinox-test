const euros = new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR" });

export function formatEuros(amountInCents: number): string {
  return euros.format(amountInCents / 100);
}
