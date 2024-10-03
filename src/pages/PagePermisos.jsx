// PageRoles.jsx
import { Box, Flex, Text, Icon } from '@chakra-ui/react';
import { InfoOutlineIcon } from '@chakra-ui/icons';
import { TablaRoles } from '../components/Usuarios/TablaRoles';

export const PageRoles = () => {
  return (
    <>
      <Box bg="brand.25" p={4} borderRadius="md" boxShadow="md">
        <Flex align="center">
          <Icon as={InfoOutlineIcon} color="brand.500" mr={2} />
          <Text fontSize="md">
            Se presentan los diferentes roles que se pueden asignar a los usuarios de lacarreta por empresas al solicitar un trámite de pago. En la opción de ver permisos, los usuarios pueden agregar o quitar permisos según lo necesiten.
          </Text>
        </Flex>
      </Box>
      <TablaRoles />
    </>
  );
};

// PagePermisos.jsx
import { Permisos } from "../components/Usuarios/Permisos";

export const PagePermisos = () => {
  return <Permisos />;
};
