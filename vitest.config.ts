import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./", import.meta.url)) },
  },
  // Components under test use the automatic JSX runtime, as Next.js compiles them.
  esbuild: { jsx: "automatic" },
  test: {
    include: ["tests/**/*.test.ts"],
    environment: "node",
  },
});
