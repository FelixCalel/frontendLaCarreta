import { AppRouter } from "./router/AppRouter";
import { store } from './store/store';
import { Provider } from 'react-redux';
import { PedidoProvider } from "./components/pedidoProvider"; // Asegúrate de que la ruta sea correcta

export function App() {
  return (
    <Provider store={store}>
      {/* El PedidoProvider debe envolver todo el enrutador */}
      <PedidoProvider>
        <AppRouter />
      </PedidoProvider>
    </Provider>
  );
}
