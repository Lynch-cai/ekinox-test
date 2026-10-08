import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2026-10-05",
  ssr: false,
  modules: ["shadcn-nuxt"],
  css: ["~/assets/css/tailwind.css"],
  vite: {
    plugins: [tailwindcss()],
  },
  shadcn: {
    prefix: "",
    componentDir: "@/components/ui",
  },
  app: {
    head: {
      htmlAttrs: { lang: "en" },
      link: [{ rel: "icon", type: "image/svg+xml", href: "/favicon.svg" }],
    },
  },
  hooks: {
    "pages:extend"(pages) {
      pages.push({ path: "/", redirect: "/cart" });
    },
  },
  nitro: {
    devProxy: {
      "/api": {
        target: `${process.env.API_URL ?? "http://localhost:4000"}/api`,
        changeOrigin: true,
      },
    },
  },
});
