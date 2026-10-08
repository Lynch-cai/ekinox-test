import { createConfigForNuxt } from "@nuxt/eslint-config";

export default createConfigForNuxt({
  dirs: { src: ["apps/web/app"] },
}).append({
  files: ["apps/web/app/components/ui/**/*.vue"],
  rules: { "vue/require-default-prop": "off" },
});
