<script setup lang="ts">
import type { CartPriceResponse, DiscountLine, MovieLine } from "@bttf/api/cart/contract";

defineProps<{ price: CartPriceResponse }>();

const rowHeader = "h-auto py-2 whitespace-normal";

const movieLabel = (movie: MovieLine) =>
  movie.saga ? movie.title : `${movie.title} (other movie)`;
const discountLabel = (discount: DiscountLine) =>
  `${discount.saga} discount: ${discount.distinctMovies} different movies, -${discount.percent}%`;
</script>

<template>
  <Table>
    <TableCaption class="sr-only">Order details</TableCaption>
    <TableBody>
      <TableRow
        v-for="(movie, index) in price.movies"
        :key="`movie-${index}`"
        data-testid="receipt-line"
      >
        <TableHead scope="row" :class="rowHeader" data-testid="receipt-label">{{
          movieLabel(movie)
        }}</TableHead>
        <TableCell class="text-right tabular-nums" data-testid="receipt-amount">
          {{ formatEuros(movie.priceInCents) }}
        </TableCell>
      </TableRow>
      <TableRow
        v-for="discount in price.discounts"
        :key="`discount-${discount.saga}`"
        data-testid="receipt-line"
      >
        <TableHead scope="row" :class="rowHeader" data-testid="receipt-label">{{
          discountLabel(discount)
        }}</TableHead>
        <TableCell class="text-right tabular-nums" data-testid="receipt-amount">
          {{ formatEuros(-discount.amountInCents) }}
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
</template>
