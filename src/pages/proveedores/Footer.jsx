import { Box, Text } from "@chakra-ui/react";

const Footer = () => {
  return (
    <Box bg="green.800" color="white" p={4} textAlign="center">
      <Text>
        &copy; {new Date().getFullYear()} La Carreta. Todos los derechos
        reservados.
      </Text>
    </Box>
  );
};

export default Footer;
