import path from "path";
import { defineConfig } from "vite";
import { createVuePlugin as vue } from "vite-plugin-vue2";

let base_path = "/interface/modules/custom_modules/vue-workspace-builder";
if (import.meta.VITE_BASE_URL) {
  base_path = import.meta.VITE_BASE_URL + base_path;
}
if (import.meta.NODE_ENV === "production") {
  base_path = base_path + "/dist";
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json", ".vue"], // allows importing files without adding file extension
  },
  publicDir: base_path,
  server: {
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    watch: {
      usePolling: true,
      awaitWriteFinish: {
        stabilityThreshold: 300,
        pollInterval: 1000,
      },
    },
    host: "127.0.0.1",
    proxy: { "/": "http://localhost:8300" },
  },
});

/**
 * from old vue.config.js file which was using webpack under the hood
 * devServer: {
    disableHostCheck: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000,
    },
    proxy: "http://localhost:8300",
    host: "127.0.0.1",
  },
 */
