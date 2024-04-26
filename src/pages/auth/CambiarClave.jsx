
import React, { useState } from 'react';
import { Box, Heading, FormControl, FormLabel, Input, Button, Text, useToast, Icon } from '@chakra-ui/react';
import axios from 'axios';
import { MdError, MdCheckCircle, MdWarning } from 'react-icons/md';
import { Navigate, redirect, useNavigate, useParams } from 'react-router-dom';




export const CambiarClave = () => {
    
    const { token, correo_electronico } = useParams();
    const [nuevaClave, setNuevaClave] = useState('');
    const [confirmarClave, setConfirmarClave] = useState('');
    const [mensaje, setMensaje] = useState('');
    const toast = useToast();
    const navigate = useNavigate();
    
    console.log(token, correo_electronico);

const handleSubmit = async (e) => {
    e.preventDefault();
    

 
    try {
        // Verificar que las contraseñas coincidan
        if (nuevaClave !== confirmarClave) {
          setMensaje('Las contraseñas no coinciden');
          return;
        }
        if (!nuevaClave || !confirmarClave) {
            setMensaje('Por favor ingrese una nueva contraseña y confírmela');
            return;
          }
  
        // Realizar la solicitud HTTP para enviar la nueva contraseña
        const response = await axios.post('http://localhost:3000/usuarios/recuperar-clave', {
          
          correo_electronico: correo_electronico,
          token: token,
          clave: nuevaClave,
        });
  
        
        toast({
          title: 'Contraseña cambiada',
          description: 'Tu contraseña ha sido cambiada exitosamente.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });

        
        navigate('/auth/login');
      } catch (error) {
        console.error('Error al enviar la contraseña:', error);
        setMensaje('Error al enviar la contraseña');
        toast({
          title: 'Error',
          description: 'Hubo un error al cambiar la contraseña. Por favor, inténtalo de nuevo más tarde.',
          status: 'error',
          duration: 5000,
          status: 'warning',
          isClosable: true,
        });
      }
    };
  return (
    <Box maxW="400px" mx="auto" mt="50px" p="6" borderWidth="1px" borderRadius="lg" boxShadow="lg">
      <Heading as="h2" mb="6" textAlign="center">Recuperar Contraseña</Heading>
      <form onSubmit={handleSubmit}>
        <FormControl id="nuevaContraseña" mb="4">
          <FormLabel>Nueva Contraseña</FormLabel>
          <Input type="password" value={nuevaClave} onChange={(e) => setNuevaClave(e.target.value)} placeholder="Nueva Contraseña" />
        </FormControl>
        <FormControl id="confirmarContraseña" mb="4">
          <FormLabel>Confirmar Contraseña</FormLabel>
          <Input type="password" value={confirmarClave} onChange={(e) => setConfirmarClave(e.target.value)} placeholder="Confirmar Contraseña" />
        </FormControl>
        <Button type="submit" colorScheme="blue" width="100%">Guardar Contraseña</Button>
      </form>
      {mensaje && (
        <Text mt="4" textAlign="center" color={mensaje.includes('Error') ? 'red.500' : 'green.500'}>
          <Icon as={mensaje.includes('Error') ? MdError : MdWarning} mr="2" />
          {mensaje}
        </Text>
      )}
    </Box>
  )
}
