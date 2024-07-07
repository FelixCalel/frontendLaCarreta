import { Box } from '@chakra-ui/react';
import Header from '../proveedores/Header';
import Footer from '../proveedores/Footer';
import Content from '../proveedores/Content';
import { Outlet } from 'react-router-dom'; // Asegúrate de importar Outlet

const Proveedores = ({ children }) => {
  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Header />
      <Content>
        <Outlet /> {/* Renderiza las rutas anidadas */}
      </Content>
      <Footer />
    </Box>
  );
};

export default Proveedores;
