import { Box } from '@chakra-ui/react';
import Header from '../proveedores/Header';
import Footer from '../proveedores/Footer';
import Content from '../proveedores/Content';

const Proveedores = ({ children }) => {
  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Header />
      <Content>{children}</Content>
      <Footer />
    </Box>
  );
};

export default Proveedores;
