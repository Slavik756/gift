import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // Relative asset URLs let the same build work on Vercel and GitHub Pages.
  base: "./",
  plugins: [react()],
});
