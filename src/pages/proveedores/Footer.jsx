import { Box, Text } from '@chakra-ui/react';

const Footer = () => {
  return (
    <Box bg="teal.500" color="white" p={4} textAlign="center">
      <Text>&copy; {new Date().getFullYear()} Agropecuaria Popoyán. Todos los derechos reservados.</Text>
    </Box>
  );
};

export default Footer;
