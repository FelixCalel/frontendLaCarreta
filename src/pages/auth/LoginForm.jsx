import { useDispatch, useSelector } from 'react-redux';
import React, { useContext, useEffect, useMemo, useState } from 'react';

import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Link,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { Navigate, redirect, useNavigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import { useForm } from '../../hooks/useForm';
import { checkingAuthentication, startSignIn } from '../../store/auth';
import { replace } from 'formik';




export const LoginForm = () => {
 
  // const [usuario, setUsuario] = useState(null);
  const actualUsuario = useSelector(usuario => usuario.auth);
 
  useEffect(() => {
    if(actualUsuario === 'authenticated')
     return navigate("/admin/dashboard", replace)
  })
     

  const dispatch = useDispatch();

  let navigate = useNavigate();


  const [correo_electronico, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isEmployee, setIsEmployee] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [error, setError] = useState(actualUsuario.errorMessage);

  

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

  const handleSubmit =  (e) => {
    e.preventDefault();
    
    // Deshabilitar el botón
    // document.getElementById('login-button').disabled = true;
    // Aquí manejarías el envío del formulario

     dispatch(startSignIn({correo_electronico,password}))

       
 
  
      if(actualUsuario.status == 'authenticated' ){
              console.log("redirecciona a dashboard")
               //  navigate("/admin/dashboard", replace)
            navigate("/admin/dashboard", replace)
      }
      if(actualUsuario.status === 'not-authenticated' ){

        console.log("muestra error")
            setError(actualUsuario.errorMessage);
           navigate("auth/login", replace)
      }

  };
 
  return (
    <Flex
      minHeight="100vh"
      width="full"
      align="center"
      justifyContent="center"
      backgroundImage={images[currentImageIndex]}
     // backgroundColor={"gray.50"}
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
        maxWidth="500px"
        borderRadius="lg"
        boxShadow="lg"
        backgroundColor={useColorModeValue('whiteAlpha.800', 'gray.700')}
      >
        <Box lineHeight={1} pb={6} textAlign={"center"}>
         <Heading as='section' pb={5} textAlign={"center"} size="lg" mb="0.2" lineHeight="tight" > Iniciar sesión</Heading>
         <Text mt="-4" lineHeight="short">Portal de proveedores Popoyán</Text>
        </Box>
   
          
        <form onSubmit={handleSubmit}
        >
       
        
      <Stack spacing={4}></Stack>
          <Stack spacing={4}>
            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                placeholder="Ingresa tu email"
                onChange={(e) => setEmail(e.target.value)}
                value={correo_electronico}
                required
              />
            </FormControl>
            <FormControl>
              <FormLabel>Contraseña</FormLabel>
              <Input
                type="password"
                placeholder="Ingresa tu contraseña"
                // id='login-button'
                required
                aria-required="true"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
               
               
              />
            </FormControl>
            <Checkbox isChecked={isEmployee} onChange={(e) => setIsEmployee(e.target.checked)}>
              ¿Empleado?
            </Checkbox>
            {error && (
            <Alert status="error" variant="subtle">
              <AlertIcon />
              {error}
            </Alert>
          )}
            <Stack spacing={6}>
              <Button
                type="submit"
                // disabled= { isAuthenticating }
                colorScheme="green"
              >
                Iniciar sesión
              </Button>
              <Button
                variant="outline"
                colorScheme="green"
                onClick={() =>{ navigate('/auth/registro') }  }
              >
                Registro
              </Button>
            </Stack>
            <Link color="teal.500" href="#" onClick={() => navigate('/auth/recuperar_clave')}  textAlign={"center"} >
              Se me olvidó la contraseña
            </Link>
          </Stack>
        </form>
      </Box>
    </Flex>
  );
};


