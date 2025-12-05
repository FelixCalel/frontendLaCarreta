import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), "");

    return {
        server: {
            host: env.HOST,
            port: Number(env.PORT),
            hmr: {
                host: mode === "production" ? env.HOST : "localhost",
                protocol: "ws",
            },
        },
        preview: {
            host: env.HOST,
            port: Number(env.PORT),
        },

        plugins: [
            react(),
            VitePWA({
                registerType: "prompt",
                includeAssets: ["favicon.ico", "apple-touch-icon.png", "masked-icon.svg"],
                manifest: {
                    name: "La Carreta",
                    short_name: "La Carreta",
                    description: "Portal de La Carreta",
                    theme_color: "#ffffff",
                    start_url: "/",
                    orientation: "portrait",
                    id: "/",
                    icons: [
                        {
                            src: "images/logo.png",
                            sizes: "192x192",
                            type: "image/png",
                        },
                        {
                            src: "images/logo.png",
                            sizes: "512x512",
                            type: "image/png",
                        },
                    ],
                },
                workbox: {
                    maximumFileSizeToCacheInBytes: 4 * 1024 * 1024, // 4MB
                },
            }),
        ],
        define: {
            "process.env": env,
        },
    };
});