import { useState } from 'react';
import { Box, Heading, FormControl, FormLabel, Input, Button, Text, useToast, Icon } from '@chakra-ui/react';
import { useDispatch } from 'react-redux';
import { resetPasswordWithToken } from '../../store/auth/thunks';
import { MdError, MdWarning } from 'react-icons/md';
import { useNavigate, useParams } from 'react-router-dom';

export const CambiarClave = () => {
    const { token, correo_electronico } = useParams();
    const [nuevaClave, setNuevaClave] = useState('');
    const [confirmarClave, setConfirmarClave] = useState('');
    const [mensaje, setMensaje] = useState('');
    const toast = useToast();
    const navigate = useNavigate();
    const dispatch = useDispatch();

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

            const resultAction = await dispatch(resetPasswordWithToken({
                correo_electronico,
                token,
                clave: nuevaClave,
            }));

            if (resetPasswordWithToken.fulfilled.match(resultAction)) {
                toast({
                    title: 'Contraseña cambiada',
                    description: resultAction.payload.message,
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                });
                navigate('/auth/login');
            } else {
                setMensaje(resultAction.payload || 'Error al enviar la contraseña');
                toast({
                    title: 'Error',
                    description: resultAction.payload || 'Hubo un error al cambiar la contraseña.',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            }
        } catch (error) {
            console.error('Error al enviar la contraseña:', error);
            setMensaje('Error inesperado');
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
    );
};
