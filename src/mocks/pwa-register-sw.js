// Mock implementation for development when vite-plugin-pwa is disabled or failing
export function useRegisterSW(options) {
  return {
    offlineReady: [false, () => {}],
    needRefresh: [false, () => {}],
    updateServiceWorker: async (reloadPage) => {},
  };
}
