import React from 'react';
import { createRoot } from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import {App} from './App';
import { theme } from '../src/components/Dashboard/themes/themePY'
import { AuthProvider } from './pages/auth/context';
import { BrowserRouter } from 'react-router-dom';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';

const container = document.getElementById('root');
const root = createRoot(container); // Crea una raíz.
root.render(<React.StrictMode>
  <AuthProvider>
    <ChakraProvider theme={theme}>
      <BrowserRouter>
            <App />
      </BrowserRouter>      
    </ChakraProvider>
  </AuthProvider>
</React.StrictMode>); // Renderiza tu aplicación en la raíz.

