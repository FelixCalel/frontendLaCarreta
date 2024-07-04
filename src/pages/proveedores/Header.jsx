import { Box, Flex, Heading, HStack, Link } from '@chakra-ui/react';

const Header = () => {
  return (
    <Box bg="teal.500" px={4}>
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <Heading size="md" color="white">Modulo Proveedores - Solicitud</Heading>
        <HStack spacing={8} alignItems="center">
          <Link href="/" color="white">Inicio</Link>
          <Link href="/about" color="white">Acerca de</Link>
          <Link href="/contact" color="white">Contacto</Link>
        </HStack>
      </Flex>
    </Box>
  );
};

export default Header;
