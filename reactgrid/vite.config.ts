import { defineConfig } from "vite";
import { resolve } from "path";
import react from "@vitejs/plugin-react-swc";
import dts from "vite-plugin-dts";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      jsxImportSource: "@emotion/react",
    }),
    dts({ include: ["lib"] }),
    cssInjectedByJsPlugin(),
  ],
  esbuild: {
    drop: ["console"],
  },
  build: {
    lib: {
      entry: resolve(__dirname, "lib/main.ts"),
      formats: ["es"],
      fileName: "main",
    },
    copyPublicDir: false,
    rollupOptions: {
      external: ["react", "react/jsx-runtime"],
    },
    emptyOutDir: true,
  },
});
