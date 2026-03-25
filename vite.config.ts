import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import viteCompression from 'vite-plugin-compression';
import path from 'path';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), "");
    const apiUrl = env.VITE_API_URL?.trim();
    const explicitProxyTarget = env.VITE_PROXY_TARGET?.trim();
    const hmrHost = env.VITE_HMR_HOST?.trim() || env.HOST;
    const hmrProtocol = env.VITE_HMR_PROTOCOL?.trim() || "ws";

    const resolvedProxyTarget = (() => {
        if (explicitProxyTarget) return explicitProxyTarget;

        if (apiUrl && /^https?:\/\//i.test(apiUrl)) {
            try {
                const parsed = new URL(apiUrl);
                return parsed.origin;
            } catch {
                // Si VITE_API_URL no es una URL valida, evitamos crear proxy invalido.
            }
        }

        return undefined;
    })();

    const proxyConfig = resolvedProxyTarget
        ? {
            '/api': {
                target: resolvedProxyTarget,
                changeOrigin: true,
            },
            '/ws': {
                target: resolvedProxyTarget,
                changeOrigin: true,
                ws: true,
            }
        }
        : undefined;

    if (!proxyConfig && mode === "development") {
        console.warn('[vite] Proxy deshabilitado: define VITE_PROXY_TARGET o usa VITE_API_URL absoluta.');
    }

    return {
        server: {
            host: env.HOST,
            port: Number(env.PORT),
            proxy: proxyConfig,
            hmr: {
                host: hmrHost,
                protocol: hmrProtocol,
            },
        },
        preview: {
            host: env.HOST,
            port: Number(env.PORT),
        },
        plugins: [
            react(),
            viteCompression(),
            VitePWA({
                registerType: "autoUpdate",
                selfDestroying: true,
                includeAssets: ["favicon.ico", "apple-touch-icon.png", "masked-icon.svg"],
                devOptions: {
                    enabled: true,
                },
                manifest: {
                    name: "Portal La Carreta",
                    short_name: "La Carreta",
                    description: "Portal administrativo para La Carreta. Gestión eficiente de tiendas, rutas, pedidos y reportes.",
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
                    maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
                    cleanupOutdatedCaches: true,
                },
            }),
        ],
        resolve: {
            alias: mode === 'development' ? [
                { find: 'virtual:pwa-register/react', replacement: path.resolve(process.cwd(), 'src/mocks/pwa-register-sw.js') }
            ] : []
        },
    };
});