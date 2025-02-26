import { AppRouter } from "./router/AppRouter";
import { store } from './store/store';
import { Provider } from 'react-redux';
import { PedidoProvider } from "./components/pedidoProvider"; // Asegúrate de que la ruta sea correcta
import customTheme from "./assets/theme";

export function App() {
  return (
    <Provider theme={customTheme} store={store}>
      <PedidoProvider>
        <AppRouter />
      </PedidoProvider>
    </Provider>
  );
}
