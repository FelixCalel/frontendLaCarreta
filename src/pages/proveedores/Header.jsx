import React from 'react';
import { Box, Flex, Heading, HStack, Link, Image } from '@chakra-ui/react';

const Header = () => {
  return (
    <Box bg="green.800" px={5} py={0}>  {/* Ajusta el padding vertical */}
      <Flex h={20} alignItems="center" justifyContent="space-between">  {/* Ajusta la altura */}
        <Flex alignItems="center">
          <Image 
            src="../../images/POPOYAN BLANCO.png"
            alt="Logo Popoyán" 
            boxSize="80px"  // Ajusta el tamaño de la imagen
            width={200}  // Ajusta el ancho de la imagen
          />
          <Heading size="lg" color="white" ml={9}>  {/* Ajusta el tamaño del texto */}
             Modulo Proveedores - Solicitud
          </Heading>
        </Flex>
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
