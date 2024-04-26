import React, { useEffect, useState } from 'react';

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
import axios from 'axios';

export const RecuperarClave = () => {
  const [email, setEmail] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

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
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const correo_electronico = email
    
    // Aquí manejarías el envío del correo electrónico para la recuperación de la contraseña
    try {
      const response = await axios.post('http://localhost:3000/usuarios/recuperar_clave_email', {
        correo_electronico,
      });
      console.log(response)
      setMensaje('Correo electrónico enviado correctamente, por favor revisar tu bandeja de correo.');
    } catch (error) {
      setMensaje('Hubo un error: '+ error);
    }
   
    
    
  };

  return (
    <Flex
      minHeight="100vh"
      align="center"
      justifyContent="center"      
      backgroundImage={images[currentImageIndex]}
      backgroundColor={"gray.50"}
      backgroundSize="cover"
      transition="background-image 1s ease-in-out" // Añade esta línea para la transición
        sx={{
          // Asegúrate de que el cambio de imagen sea suave
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            backgroundImage: images[currentImageIndex],
            backgroundSize: 'cover',
            filter: 'blur(8px)', // Añade un efecto de desenfoque si lo deseas
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
            {mensaje && <p>{mensaje}</p>}
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

export default RecuperarClave;
