import { Box, Button, Link, Text } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { Link as RouterLink } from "react-router-dom"; 


export const ConfirmacionRegistro = () => {
  const actualUsuario = useSelector( state => state.auth)
 console.log(actualUsuario);

  return (
    <Box
    width="100%"
    height="100vh"
    display="flex"
    justifyContent="center"
    alignItems="center"
    boxShadow="lg"
  >
    <Box
      maxW="md"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      p={8}
      textAlign="center"
    >
      <Text fontSize="xl" mb={4}>
        Te has registrado con el correo {} correctamente en el sistema de portal de proveedores Agropecuaria Popoyan. Revisa tu bandeja de entrada del correo que registraste para darte de alta en el sistema.
      </Text>
      <Link as={RouterLink} to="/auth/login">
        <Button colorScheme="blue">Regresar al Login</Button>
      </Link>
    </Box>
  </Box>
  )
}
