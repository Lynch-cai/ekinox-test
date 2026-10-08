import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    projects: [
      { test: { name: "pricing", include: ["packages/pricing/test/**/*.test.ts"] } },
      { test: { name: "api", include: ["apps/api/test/**/*.test.ts"] } },
      "apps/web",
    ],
  },
});
