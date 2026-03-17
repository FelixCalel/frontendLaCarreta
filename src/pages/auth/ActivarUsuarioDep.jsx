import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Stack,
  useColorModeValue,
  Link,
  Text,
} from '@chakra-ui/react';
import { useActivarUsuario } from "./hooks/useActivarUsuario";

export const ActivarUsuarioDep = () => {
  const {
    nombres, setNombres,
    apellidos, setApellidos,
    correo_electronico, setCorreoElectronico,
    celular, setCelular,
    telefono, setTelefono,
    mensaje,
    nuevaClave, setNuevaClave,
    confirmarClave, setConfirmarClave,
    currentImageIndex, images,
    handleSubmit
  } = useActivarUsuario();

  return (
    <Flex
      minHeight="100vh"
      align="center"
      justifyContent="center"      
      backgroundImage={images[currentImageIndex]}
      backgroundColor={"gray.50"}
      backgroundSize="cover"
      transition="background-image 1s ease-in-out"
        sx={{
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            backgroundImage: images[currentImageIndex],
            backgroundSize: 'cover',
            filter: 'blur(8px)',
            zIndex: -1,
          }
        }}
    >
      <Box
        p={8}
        width="full"
        maxWidth="400px"
        borderRadius="lg"
        boxShadow="lg"        
        backgroundColor={useColorModeValue('whiteAlpha.800', 'gray.700')}
      >
        <form onSubmit={handleSubmit}>
          <Stack spacing={4}>
            <Text fontSize="lg" fontWeight="bold" textAlign="center">
              Activar Usuario
            </Text>
            <FormControl isRequired>
              <FormLabel>Nombres</FormLabel>
              <Input
                type="text"
                placeholder="Nombres"
                onChange={(e) => setNombres(e.target.value)}
                value={nombres}
              />
                <FormLabel>Apellidos</FormLabel>
              <Input
                type="text"
                placeholder="Apellidos"
                onChange={(e) => setApellidos(e.target.value)}
                value={apellidos}
              />
               <FormLabel>Celular</FormLabel>
              <Input
                type="text"
                placeholder="Celular"
                onChange={(e) => setCelular(e.target.value)}
                value={celular}
              />

                <FormLabel>Telefono</FormLabel>
                <Input
                type="text"
                placeholder="Telefono"
                onChange={(e) => setTelefono(e.target.value)}
                value={telefono}
              />
              <FormLabel>Correo Electrónico</FormLabel>
              <Input
                type="email"
                placeholder="Ingresa tu correo electrónico"
                onChange={(e) => setCorreoElectronico(e.target.value)}
                value={correo_electronico}
              />
            </FormControl> <FormControl id="nuevaContraseña" mb="4" isRequired>
          <FormLabel>Nueva Contraseña</FormLabel>
          <Input type="password" value={nuevaClave} onChange={(e) => setNuevaClave(e.target.value)} placeholder="Nueva Contraseña" />
        </FormControl>
        <FormControl id="confirmarContraseña" mb="4" isRequired>
          <FormLabel>Confirmar Contraseña</FormLabel>
          <Input type="password" value={confirmarClave} onChange={(e) => setConfirmarClave(e.target.value)} placeholder="Confirmar Contraseña" />
        </FormControl>

            {mensaje && <p style={{ color: 'red' }}>{mensaje}</p>}
            <Button
              type="submit"
              colorScheme="green"
              width="full"
            >
              Enviar
            </Button>
            <Flex justifyContent="center">
              <Link color="teal.500" href="/auth/login">
                Volver al inicio de sesión
              </Link>
            </Flex>
          </Stack>
        </form>
      </Box>
    </Flex>
  );
};

