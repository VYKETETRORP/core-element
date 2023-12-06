import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],

  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @import "imports/ui/style/index.scss";
         
        `,
      },
    },
  },

  meteor: {
    clientEntry: "imports/ui/main.js",
  },
  optimizeDeps: {
    exclude: ["vue-meteor-tracker"],
  },
});
