<script setup lang="ts">
useHead({ title: "Cart price - Back to the Future" });

const cart = ref(`Back to the Future 1
Back to the Future 2
Back to the Future 3
La chèvre`);

const { price, error, pending, compute } = useCartPrice();

const card = "rounded-xl border bg-card p-5 text-card-foreground shadow-sm";
</script>

<template>
  <main class="mx-auto max-w-xl px-4 py-10 sm:py-16">
    <header>
      <h1 class="text-3xl font-bold tracking-tight" data-testid="page-title">
        Promo Back to the Future
      </h1>
      <p class="mt-2 text-sm text-muted-foreground">
        €15 per Back to the Future movie, 10% off for 2 different ones, 20% off for 3 or more. Other
        movies cost €20.
      </p>
    </header>

    <CartForm v-model="cart" :class="['mt-8', card]" :pending="pending" @submit="compute(cart)" />

    <section :class="['mt-6', card]" aria-labelledby="price-title">
      <h2 id="price-title" class="text-sm font-medium text-muted-foreground">Price</h2>
      <p role="status" class="text-3xl font-bold tabular-nums" data-testid="cart-total">
        {{ price ? `Total: ${formatEuros(price.totalInCents)}` : "" }}
      </p>
      <p v-if="!price && !error" class="mt-1 text-sm text-muted-foreground">
        Add movies, then calculate the price.
      </p>

      <Alert v-if="error" variant="destructive" class="mt-2" data-testid="cart-error">
        <AlertTitle>Unable to calculate the price</AlertTitle>
        <AlertDescription>{{ error }}</AlertDescription>
      </Alert>

      <CartReceipt
        v-if="price?.movies.length"
        :price="price"
        class="mt-4"
        data-testid="cart-receipt"
      />
    </section>
  </main>
</template>
