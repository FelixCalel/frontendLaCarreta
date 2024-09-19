import { useEffect, useState } from 'react';
import NavBar from '../../components/NavBar';
import MenuPrincipalD from '../../components/MenuPrincipalD';
import { Box, Flex, Heading, Text, Stack, Button } from '@chakra-ui/react';

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
      <NavBar />.
      <Flex flex="1" direction="row">
        <MenuPrincipalD />
        <Box flex="1" p={4}>
          {/* Bienvenida personalizada */}
          <Heading as="h1" size="xl" mb={4}>
            Bienvenido {nombreUsuario}
          </Heading>
          <Text fontSize="lg" color="gray.600" mb={6}>
            ¡Nos alegra tenerte de vuelta! Aquí podrás acceder a los disntitos servicios.
          </Text>

          {/* Información adicional o acciones */}
          <Stack direction={'row'} mt={6} spacing={3}>
            <Button colorScheme="green" onClick={() => alert('Ir a tu perfil')}>
              Ir a mi perfil
            </Button>
            <Button variant="outline" colorScheme="green" onClick={() => alert('Ver el catálogo')}>
              Ver el catálogo
            </Button>
          </Stack>
        </Box>
      </Flex>
    </Flex>
  );
};

export default HomePage;
