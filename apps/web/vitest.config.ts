import { fileURLToPath } from "node:url";
import { defineVitestConfig } from "@nuxt/test-utils/config";

export default defineVitestConfig({
  test: {
    name: "web",
    environment: "nuxt",
    environmentOptions: {
      nuxt: { rootDir: fileURLToPath(new URL(".", import.meta.url)) },
    },
  },
});
