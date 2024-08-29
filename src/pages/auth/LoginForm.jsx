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
  InputGroup,
  InputRightElement,
  Link,
  Stack,
  useColorModeValue,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const LoginForm = () => {
  const actualUsuario = useSelector(usuario => usuario.auth);
  const navigate = useNavigate();

  const [correo, setEmail] = useState('');
  const [contrasena, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
        correo,
        contrasena,
      });

      console.log("Respuesta recibida del backend:", response);

      if (response.data && response.data.token) {
        console.log("Login exitoso, redireccionando a /auth/home...");
        localStorage.setItem('token', response.data.token);
        navigate("/auth/home", { replace: true });
      } else {
        console.log("Credenciales incorrectas.");
        setError('Credenciales incorrectas');
      }
    } catch (err) {
      console.error("Error en la solicitud de login:", err);

      if (err.response && err.response.data && err.response.data.error) {
        const backendMessage = err.response.data.error;
        if (backendMessage.includes('Por favor verifica tu correo electrónico')) {
          setError('Por favor verifica tu correo electrónico antes de iniciar sesión.');
        } else if (backendMessage.includes('Este usuario no existe')) {
          setError('Este usuario no existe. Por favor, crea una cuenta.');
        } else {
          setError('Error al iniciar sesión. Por favor, intenta de nuevo.');
        }
      } else {
        setError('Error al iniciar sesión. Por favor, intenta de nuevo.');
      }
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
                value={correo}
                required
              />
            </FormControl>
            <FormControl>
              <FormLabel>Contraseña</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Ingresa tu contraseña"
                  required
                  onChange={(e) => setPassword(e.target.value)}
                  value={contrasena}
                />
                <InputRightElement width="4.5rem">
                  <Button
                    h="1.75rem"
                    size="sm"
                    onMouseDown={() => setShowPassword(true)}
                    onMouseUp={() => setShowPassword(false)}
                    onMouseLeave={() => setShowPassword(false)}
                  >
                    {showPassword ? <ViewOffIcon /> : <ViewIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
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
