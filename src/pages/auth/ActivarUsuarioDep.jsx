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

export const ActivarUsuarioDep = () => {
  const url = window.location.href;
  const tokenMatch = url.match(/\/([^/]+)\/([^/]+)\/([^/]+)\/([^/]+)$/);
  const [error, setError] = useState(false);
  const [nombres, setNombres] = useState('');
  const [token, setToken] = useState('');
  const [correo_electronico, setCorreoElectronico] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [celular, setCelular] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [nuevaClave, setNuevaClave] = useState('');
  const [confirmarClave, setConfirmarClave] = useState('');
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

  useEffect(() => {
    // Extraer parámetros de la URL
    const [, token, correoElectronico, nombres, apellidos] = tokenMatch;
    const tokenp = token;
    const correoElectronicop = correoElectronico;
    const nombresp = decodeURIComponent(nombres);
    const apellidosp = decodeURIComponent(apellidos);

    // Actualiza el estado con los parámetros de la URL
    setToken(tokenp);
    setCorreoElectronico(correoElectronicop);
    setNombres(nombresp);
    setApellidos(apellidosp);

    // Resto de tu código
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
   // Restablece el estado de error antes de validar
   setError(false);
    // Validar que todos los campos estén completos
  if (!nombres || !apellidos || !correo_electronico || !telefono || !celular || !nuevaClave || !confirmarClave) {
    setError(true); // Activa el estado de error
    setMensaje('Por favor completa todos los campos.');
    return;
  }
  // Validar que la nueva contraseña y la confirmación coincidan
  if (nuevaClave !== confirmarClave) {
    setError(true); // Activa el estado de error
    setMensaje('La nueva contraseña y la confirmación no coinciden.');
    return;
  }
    
    // Aquí se activa el usuario actualizando la contraseña solicitada
    try {
      const response = await axios.post('http://localhost:3000/usuarios/activarUsuarioHijo', {
        nombres, apellidos,correo_electronico,nuevaClave,telefono,celular
      });
      console.log(response.status)
      setMensaje('Tu cuenta fue activada correctamente.');
      if(response.status === 201){
        window.location.href = '/auth/login';
      }
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
                onChange={(e) => setEmail(e.target.value)}
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

export default ActivarUsuarioDep;
