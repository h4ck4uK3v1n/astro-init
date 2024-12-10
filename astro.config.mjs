// @ts-check
import { defineConfig, envField } from "astro/config";
import tailwind from "@astrojs/tailwind";
import alpine from "@astrojs/alpinejs";

import solidJs from "@astrojs/solid-js";

// https://astro.build/config
export default defineConfig({
  site: "https://astro-blog-custom.netlify.app/",
  integrations: [tailwind(), alpine({ entrypoint: "/src/scripts/entrypoint" }), solidJs()],
  env: {
    schema: {
      API_STRAPI_URL: envField.string({
        context: "server",
        access: "public",
        optional: false,
      }),
      IMAGE_STRAPI_URL: envField.string({
        context: "server",
        access: "public",
        optional: false,
      }),
    },
  },
});