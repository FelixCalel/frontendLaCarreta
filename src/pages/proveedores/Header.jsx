import { Box, Flex, Heading, HStack, Link, Image } from "@chakra-ui/react";

const Header = () => {
  return (
    <Box bg="green.800" px={5} py={0}>
      {" "}
      <Flex h={20} alignItems="center" justifyContent="space-between">
        <Flex alignItems="center">
          <Image
            src="../../images/POPOYAN BLANCO.png"
            alt="Logo Popoyán"
            boxSize="80px"
            width={200}
          />
          <Heading size="lg" color="white" ml={9}>
            Modulo La Carreta - Solicitud
          </Heading>
        </Flex>
        <HStack spacing={8} alignItems="center">
          <Link href="/" color="white">
            Inicio
          </Link>
          <Link href="/about" color="white">
            Acerca de
          </Link>
          <Link href="/contact" color="white">
            Contacto
          </Link>
        </HStack>
      </Flex>
    </Box>
  );
};

export default Header;
