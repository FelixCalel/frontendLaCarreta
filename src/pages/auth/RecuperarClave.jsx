import { useEffect, useState } from 'react';
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

// Importa la función de envío de correo de recuperación
import { sendPasswordResetEmail } from 'firebase/auth';

// Importa tu instancia de autenticación de Firebase
import { auth } from '../../middleware/firebase-config';

export const RecuperarClave = () => {
  const [email, setEmail] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Array de URLs de imágenes
  const images = [
    'url("./src/assets/images/fnd_py01.jpg")',
    'url("./src/assets/images/fnd_py02.jpg")',
    'url("./src/assets/images/fnd_py03.jpg")',
    'url("./src/assets/images/fnd_py04.jpg")',
  ];

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex((currentImageIndex) => (currentImageIndex + 1) % images.length);
    }, 5000); // Cambia la imagen cada 5 segundos

    return () => clearInterval(intervalId);
  }, [images.length]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Envía la solicitud de recuperación de contraseña por Firebase
      await sendPasswordResetEmail(auth, email);
      setMensaje(
        'Correo electrónico enviado correctamente. Por favor revisa tu bandeja de correo para restablecer tu contraseña.'
      );
    } catch (error) {
      // Puedes manejar distintos mensajes de error según el type/code de Firebase
      // Por ejemplo:
      // if (error.code === 'auth/invalid-email') { ... }
      // if (error.code === 'auth/user-not-found') { ... }
      setMensaje(`Hubo un error al enviar el correo de recuperación: ${error.message}`);
    }
  };

  return (
    <Flex
      minHeight="100vh"
      align="center"
      justifyContent="center"
      backgroundImage={images[currentImageIndex]}
      backgroundColor={'gray.50'}
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
        },
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
              Recuperar Contraseña
            </Text>
            <FormControl isRequired>
              <FormLabel>Correo Electrónico</FormLabel>
              <Input
                type="email"
                placeholder="Ingresa tu correo electrónico"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
            </FormControl>

            {/* Muestra el mensaje si existe */}
            {mensaje && (
              <Text color="teal.700" fontSize="sm">
                {mensaje}
              </Text>
            )}

            <Button type="submit" colorScheme="green" width="full">
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

export default RecuperarClave;
