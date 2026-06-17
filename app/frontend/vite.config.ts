import { tanstackRouter } from "@tanstack/router-plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
    }),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@types": path.resolve(__dirname, "./src/types"),
      "@utility": path.resolve(__dirname, "./src/utility"),
      "@services": path.resolve(__dirname, "./src/services"),
      "@queries": path.resolve(__dirname, "./src/queries"),
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: +process.env.PORT || 3000,
    strictPort: true,
  },
});
