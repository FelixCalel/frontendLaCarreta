import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

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

        plugins: [react()],
        define: {
            "process.env": env,
        },

        // build: {
        //     minify: "terser",
        //     terserOptions: {
        //         compress: {
        //             drop_console: true,
        //             drop_debugger: true,
        //         },
        //     },
        // },
    };
});