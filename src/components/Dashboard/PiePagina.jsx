
import { Box, Text, Container } from '@chakra-ui/react';

const Footer = () => {
  const year = new Date().getFullYear(); // Obtiene el año actual

  return (
    <Box as="footer" width="full" mt="auto">
      <Container maxW="container.xl" py="4">
        <Text textAlign="center">
          © {year} Popoyán. Todos los derechos reservados.
        </Text>
      </Container>
    </Box>
  );
};

export default Footer;
