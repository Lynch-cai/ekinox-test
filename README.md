# Back to the Future DVD shop

Enter a cart (one movie title per line) and get its price.

- A Back to the Future movie costs €15.
- 2 different Back to the Future movies: 10% off all Back to the Future DVDs in the cart.
- 3 different ones: 20% off.
- Any other movie costs €20.

## Run it

Requires Node 24 (`nvm use`).

```bash
npm ci
npm run dev
```

Open http://localhost:3000/cart. The API runs on http://localhost:4000.

Production build, served by Express on port 4000:

```bash
npm run build
npm start
```

## Tests

```bash
npm run check      # typecheck, lint, unit tests
npm run test:e2e   # Playwright (first time: npx playwright install chromium)
```

CI runs both on every push.

## Project layout

```
packages/pricing   pricing rules, no framework
apps/api           Express API (POST /api/cart/price), also serves the built front end
apps/web           Nuxt front end
tests/e2e          Playwright test
```

The movie catalog is in memory (`apps/api/src/adapters/catalog/in-memory-catalog.ts`). A PostgreSQL version is written but not used yet. To switch to it, install `pg`, load `schema.sql` and pick `createPostgresCatalog` in `apps/api/src/server.ts`.

## API

```bash
curl -s localhost:4000/api/cart/price -H 'Content-Type: application/json' \
  -d '{"cart": "Back to the Future 1\nBack to the Future 3"}'
```

```json
{
  "movies": [
    { "title": "Back to the Future 1", "priceInCents": 1500, "saga": "Back to the Future" },
    { "title": "Back to the Future 3", "priceInCents": 1500, "saga": "Back to the Future" }
  ],
  "discounts": [
    { "saga": "Back to the Future", "distinctMovies": 2, "percent": 10, "amountInCents": 300 }
  ],
  "totalInCents": 2700
}
```

## Assumptions

- Titles are matched case-insensitively, extra spaces ignored.
- "Back to the Future" with no number is the first movie. Any episode number is recognized (part 4 included) without changing the catalog.
- Blank lines are ignored.
- Discounts are rounded to the nearest cent.
