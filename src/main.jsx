import React from "react";
import { createRoot } from "react-dom/client";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { App } from "./App";
import { theme } from "../src/components/Dashboard/themes/themePY";
import { AuthProvider } from "./pages/auth/context";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { AuthWrapper } from "./components/AuthWrapper";
import { SearchProvider } from "./components/component/SearchContext";
import { setupAxiosInterceptors } from "./utils/authInterceptor";

import GlobalErrorBoundary from "./components/GlobalErrorBoundary";

setupAxiosInterceptors();

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <GlobalErrorBoundary>
      <Provider store={store}>
        <AuthProvider>
          <ColorModeScript initialColorMode={theme.config.initialColorMode} />
          <ChakraProvider theme={theme}>
            <BrowserRouter>
              <SearchProvider>
                <AuthWrapper>
                  <App />
                </AuthWrapper>
              </SearchProvider>
            </BrowserRouter>
          </ChakraProvider>
        </AuthProvider>
      </Provider>
    </GlobalErrorBoundary>
  </React.StrictMode>
);
