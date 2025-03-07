import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "sdk/index.ts"),
      name: "socaity",
      fileName: (format) => `socaity.${format}.js`,
      formats: ["es", "umd"]
    },
    sourcemap: true
  },
  server: {
    port: 5173,
    open: "/examples/website_usage/index.html",
    watch: {
      usePolling: true
    }
  }
});
