interface ImportMetaEnv {
    readonly VITE_API_URL: string;
    readonly VITE_WEBSOCKET_URL: string;
    readonly HOST: string;
    readonly PORT: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
