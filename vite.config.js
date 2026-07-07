import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// IMPORTANT: "base" must match your GitHub repo name for GitHub Pages to
// find the built assets, e.g. if your repo is
// github.com/CyberbobSweden/nymans-pitstoppet then base should be
// "/nymans-pitstoppet/". If you rename the repo, update this too.
export default defineConfig({
  plugins: [react()],
  base: "/nymans-pitstoppet/",
});
