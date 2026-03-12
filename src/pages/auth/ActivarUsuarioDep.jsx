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
import { useDispatch } from 'react-redux';
import { activateUserChild } from '../../store/auth/thunks';
// import axios from 'axios';


export const ActivarUsuarioDep = () => {
  const url = window.location.href;
  const tokenMatch = url.match(/\/([^/]+)\/([^/]+)\/([^/]+)\/([^/]+)$/) || [];
  const [, tokenUrl, correoElectronicoUrl, nombresUrl, apellidosUrl] = tokenMatch;

  const [setError] = useState(false);
  const [nombres, setNombres] = useState(() => decodeURIComponent(nombresUrl || ''));
  const [token, setToken] = useState(() => tokenUrl || '');
  const [correo_electronico, setCorreoElectronico] = useState(() => correoElectronicoUrl || '');
  const [celular, setCelular] = useState('');
  const [telefono, setTelefono] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [nuevaClave, setNuevaClave] = useState('');
  const [confirmarClave, setConfirmarClave] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = [
   'url("./src/assets/images/fnd_py01.jpg")',
   'url("./src/assets/images/fnd_py02.jpg")',
   'url("./src/assets/images/fnd_py03.jpg")',
   'url("./src/assets/images/fnd_py04.jpg")',
  ];

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex((idx) => (idx + 1) % images.length);
    }, 5000);
    return () => clearInterval(intervalId);
  }, [images.length]);

  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombres || !apellidos || !correo_electronico || !telefono || !celular || !nuevaClave || !confirmarClave) {
      setMensaje('Por favor completa todos los campos.');
      return;
    }
    if (nuevaClave !== confirmarClave) {
      setMensaje('La nueva contraseña y la confirmación no coinciden.');
      return;
    }
    
    try {
      const resultAction = await dispatch(activateUserChild({
        nombres, apellidos, correo_electronico, nuevaClave, telefono, celular
      }));

      if (activateUserChild.fulfilled.match(resultAction)) {
        setMensaje(resultAction.payload.message);
        window.location.href = '/auth/login';
      } else {
        setMensaje(resultAction.payload || 'Hubo un error al activar el usuario.');
      }
    } catch (error) {
      setMensaje('Hubo un error inesperado.');
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

