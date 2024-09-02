import NavBar from '../../components/NavBar'; // Ajusta la ruta según la ubicación de tu archivo NavBar.jsx
import MenuPrincipalD from '../../components/MenuPrincipalD' ; // Ajusta la ruta según la ubicación de tu archivo MenuPrincipalD.jsx
import { Box, Flex } from '@chakra-ui/react';

const HomePage = () => {
  return (
    <Flex height="100vh" direction="column">
      <NavBar />
      <Flex flex="1" direction="row">
        <MenuPrincipalD />
        <Box flex="1" p={4}>
          <h1>Bienvenido a la Página de Empresa</h1>
        </Box>
      </Flex>
    </Flex>
  );
};

export default HomePage;
