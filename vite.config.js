import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// IMPORTANT: "base" must match your GitHub repo name for GitHub Pages to
// find the built assets, e.g. if your repo is
// github.com/CyberbobSweden/nymans-pitstoppet then base should be
// "/nymans-pitstoppet/". If you rename the repo, update this too.
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["icons/apple-touch-icon.png"],
      manifest: {
        name: "Nymans Däck – Pitstoppet",
        short_name: "Pitstoppet",
        description: "Byt fyra hjul så snabbt du kan – tävlingsspelet från Nymans Däck Team.",
        theme_color: "#0b0d10",
        background_color: "#0b0d10",
        display: "standalone",
        orientation: "portrait",
        start_url: "/nymans-pitstoppet/",
        scope: "/nymans-pitstoppet/",
        icons: [
          { src: "icons/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "icons/icon-512.png", sizes: "512x512", type: "image/png" },
          { src: "icons/icon-192-maskable.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
          { src: "icons/icon-512-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,png,svg,ico}"],
      },
    }),
  ],
  base: "/nymans-pitstoppet/",
});
