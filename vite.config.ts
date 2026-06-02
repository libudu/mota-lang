import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import { traeBadgePlugin } from "vite-plugin-trae-solo-badge";

const isGitHubPagesBuild = process.env.GITHUB_PAGES === "true";
const repositoryName =
  process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "mota-lang";

// https://vite.dev/config/
export default defineConfig({
  base: isGitHubPagesBuild ? `/${repositoryName}/` : "/",
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
        plugins: ["react-dev-locator"],
      },
    }),
    traeBadgePlugin({
      variant: "dark",
      position: "bottom-right",
      prodOnly: true,
      clickable: true,
      clickUrl: "https://www.trae.ai/solo?showJoin=1",
      autoTheme: true,
      autoThemeTarget: "#root",
    }),
    tsconfigPaths(),
  ],
});
