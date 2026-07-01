import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    // Force all shared packages to resolve from THIS project's node_modules,
    // regardless of whether the importing file lives under frontend/src or
    // adminpanel/src. Without this, files imported from ../../frontend/src/pages
    // pull in a second copy of React (and friends) from frontend/node_modules,
    // which causes "Invalid hook call" crashes → white page.
    dedupe: [
      "react",
      "react-dom",
      "react-router-dom",
      "axios",
      "chart.js",
      "react-chartjs-2",
      "bootstrap",
    ],
    alias: {
      // Redirect any import of the frontend's auth lib to the adminpanel's
      // own local copy, so localStorage is always scoped to this origin.
      [path.resolve(__dirname, "../frontend/src/lib/auth")]: path.resolve(
        __dirname,
        "src/lib/auth.js"
      ),
    },
  },
  server: {
    fs: {
      allow: [".."],
    },
  },
});
