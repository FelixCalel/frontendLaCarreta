import { useEffect, useState } from 'react';
import NavBar from '../../components/NavBar';
import MenuPrincipalD from '../../components/MenuPrincipalD';
import { Box, Flex, Heading, Text, Stack } from '@chakra-ui/react';

const HomePage = () => {
  const [nombreUsuario, setNombreUsuario] = useState('');

  useEffect(() => {
    const nombre = localStorage.getItem('nombreUsuario');
    
    if (nombre) {
      setNombreUsuario(nombre);
    }
  }, []);

  return (
    <Flex height="100vh" direction="column">
      {/* NavBar */}
      <NavBar />
      
      {/* Main content */}
      <Flex flex="1" direction="row" minHeight="100vh">
        {/* Sidebar */}
        <MenuPrincipalD />
        
        {/* Main section */}
        <Box flex="1" p={4} m={0} bg="white">
          <Heading as="h1" size="xl" mb={4} textAlign="left">
            Bienvenido {nombreUsuario}
          </Heading>
          <Text fontSize="lg" color="gray.600" mb={6}>
            ¡Nos alegra tenerte de vuelta! Aquí podrás acceder a los distintos servicios.
          </Text>

          <Stack direction={'column'} mt={6} spacing={3} align="flex-start">
            <Box>
              {/* <Button size="sm" colorScheme="green" onClick={() => alert('Ir a tu perfil')}>
                Ir a mi perfil
              </Button> */}
            </Box>
            <Box>
              {/* <Button size="sm" variant="outline" colorScheme="green" onClick={() => alert('Ver el catálogo')}>
                Ver el catálogo
              </Button> */}
            </Box>
          </Stack>
        </Box>
      </Flex>
    </Flex>
  );
};

export default HomePage;
