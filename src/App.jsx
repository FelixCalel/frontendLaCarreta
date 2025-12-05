import { AppRouter } from "./router/AppRouter";
import { store } from "./store/store";
import { Provider } from "react-redux";
import { PedidoProvider } from "./components/pedidoProvider";
import { WebSocketProvider } from "./providers/WebSocketProvider";

import { ReloadPrompt } from "./components/ReloadPrompt";

export function App() {
  return (
    <Provider store={store}>
      <WebSocketProvider>
        <PedidoProvider>
          <AppRouter />
          <ReloadPrompt />
        </PedidoProvider>
      </WebSocketProvider>
    </Provider>
  );
}
