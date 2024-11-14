import React from 'react';
import { createRoot } from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import {App} from './App';
import { theme } from '../src/components/Dashboard/themes/themePY';
import { AuthProvider } from './pages/auth/context';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { AuthWrapper } from './components/AuthWrapper.jsx';  // Importa el AuthWrapper

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <Provider store={store}>  {/* Aquí está el Provider de Redux */}
      <AuthProvider>
        <ChakraProvider theme={theme}>
          <BrowserRouter>
            <AuthWrapper>
              <App />
            </AuthWrapper>
          </BrowserRouter>
        </ChakraProvider>
      </AuthProvider>
    </Provider>
  </React.StrictMode>
);
