import { AppRouter } from "./router/AppRouter";
import { store } from "./store/store";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import { Provider } from "react-redux";
import { PedidoProvider } from "./components/pedidoProvider";
import { WebSocketProvider } from "./providers/WebSocketProvider";

import { ReloadPrompt } from "./components/ReloadPrompt";

export function App() {
  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
      language="es"
    >
      <Provider store={store}>
        <WebSocketProvider>
          <PedidoProvider>
            <AppRouter />
            <ReloadPrompt />
          </PedidoProvider>
        </WebSocketProvider>
      </Provider>
    </GoogleReCaptchaProvider>
  );
}
