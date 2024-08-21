import axios from 'axios';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Link,
  Stack,
  useColorModeValue,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

export const LoginForm = () => {
  const actualUsuario = useSelector(usuario => usuario.auth);
  const navigate = useNavigate();

  const [correo_electronico, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (actualUsuario === 'authenticated') {
      return navigate("/auth/home", { replace: true });
    }
  }, [actualUsuario, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      console.log("Enviando solicitud al backend...");
      const response = await axios.post('http://localhost:3000/usuarios/login', {
        correo_electronico,
        password,
      });

      console.log("Respuesta recibida del backend:", response);

      if (response.data && response.data.token) {
        console.log("Login exitoso, redireccionando a /auth/home...");
        // Guardar el token en el almacenamiento local o en el estado de la aplicación
        localStorage.setItem('token', response.data.token);

        // Redirigir a la nueva página de inicio
        navigate("/auth/home", { replace: true });
      } else {
        console.log("Credenciales incorrectas.");
        setError('Credenciales incorrectas');
      }
    } catch (err) {
      console.error("Error en la solicitud de login:", err);
      setError('Error al iniciar sesión. Por favor, intenta de nuevo.');
    }
  };

  return (
    <Flex
      minHeight="100vh"
      width="full"
      align="center"
      justifyContent="center"
      backgroundColor="gray.50"
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
          <Heading as='section' pb={5} textAlign={"center"} size="lg" mb="0.2" lineHeight="tight">Iniciar sesión</Heading>
        </Box>
        <form onSubmit={handleSubmit}>
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
                required
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
            </FormControl>
            {error && (
              <Alert status="error" variant="subtle">
                <AlertIcon />
                {error}
              </Alert>
            )}
            <Stack spacing={6}>
              <Button
                type="submit"
                colorScheme="green"
              >
                Iniciar sesión
              </Button>
              <Button
                variant="outline"
                colorScheme="green"
                onClick={() => navigate('/auth/registro')}
              >
                Registro
              </Button>
            </Stack>
            <Link color="teal.500" href="#" onClick={() => navigate('/auth/recuperar_clave')} textAlign={"center"}>
              Se me olvidó la contraseña
            </Link>
          </Stack>
        </form>
      </Box>
    </Flex>
  );
};
