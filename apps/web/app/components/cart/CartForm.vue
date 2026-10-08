<script setup lang="ts">
defineProps<{ pending: boolean }>();
const cart = defineModel<string>({ required: true });
const emit = defineEmits<{ submit: [] }>();

const SUGGESTED_MOVIES = [
  "Back to the Future 1",
  "Back to the Future 2",
  "Back to the Future 3",
  "La chèvre",
];

const titles = computed(() =>
  cart.value
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line !== ""),
);

function toggle(title: string) {
  cart.value = (
    titles.value.includes(title)
      ? titles.value.filter((line) => line !== title)
      : [...titles.value, title]
  ).join("\n");
}
</script>

<template>
  <form class="grid gap-5" @submit.prevent="emit('submit')">
    <fieldset class="grid gap-2">
      <legend class="mb-2 text-sm font-medium">Quick add</legend>
      <div class="flex flex-wrap gap-2">
        <Button
          v-for="title in SUGGESTED_MOVIES"
          :key="title"
          type="button"
          size="sm"
          :variant="titles.includes(title) ? 'default' : 'outline'"
          :aria-pressed="titles.includes(title)"
          data-testid="movie-toggle"
          @click="toggle(title)"
        >
          <span aria-hidden="true" class="inline-block w-3 text-center">{{
            titles.includes(title) ? "✓" : "+"
          }}</span>
          {{ title }}
        </Button>
      </div>
    </fieldset>

    <div class="grid gap-2">
      <Label for="cart">Cart</Label>
      <Textarea
        id="cart"
        v-model="cart"
        name="cart"
        rows="4"
        class="max-h-40"
        aria-describedby="cart-hint"
        data-testid="cart-input"
      />
      <p id="cart-hint" class="text-xs text-muted-foreground">One movie title per line.</p>
    </div>

    <Button
      type="submit"
      class="w-full sm:w-auto sm:justify-self-end"
      :disabled="pending"
      data-testid="cart-submit"
    >
      Calculate price
    </Button>
  </form>
</template>
