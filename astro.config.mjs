import { defineConfig } from 'astro/config';
import vue from "@astrojs/vue";
import tailwind from "@astrojs/tailwind";

import netlify from "@astrojs/netlify";

// https://astro.build/config
export default defineConfig({
  integrations: [vue(), tailwind()],
  output: 'hybrid'
  // output: 'static',
  ,
  adapter: netlify()
});