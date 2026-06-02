import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { nodePolyfills } from "vite-plugin-node-polyfills";

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  base: "/mota-lang",
  build: {
    sourcemap: "hidden",
  },
  server: {
    port: 3000,
  },
  plugins: [
    nodePolyfills({
      include: ["buffer", "string_decoder"],
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
    }),
    react({
      babel: {
        plugins: command === "serve" ? ["react-dev-locator"] : [],
      },
    }),
    tsconfigPaths(),
  ],
}));
