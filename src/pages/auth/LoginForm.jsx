import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
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
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { login as loginAuth } from "../../store/auth/authSlice";
const BASE_URL = import.meta.env.VITE_API_URL;

export const LoginForm = () => {
  const actualUsuario = useSelector((usuario) => usuario.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [correo, setEmail] = useState("");
  const [contrasena, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  // Redirigir solo cuando el usuario esté autenticado
  useEffect(() => {
    if (actualUsuario?.status === "authenticated") {
      navigate("/auth/home", { replace: true });
    }
  }, [actualUsuario, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BASE_URL}/usuarios/login`, {
        correo,
        contrasena,
      });
      if (response.data && response.data.usuario && response.data.usuario.token) {
        const { token } = response.data.usuario;
        const nombre = response.data.usuario.usuario.nombre;
        const correoUsuario = response.data.usuario.usuario.correo;
        const usuarioId = response.data.usuario.usuario.id;
        const paisId = response.data.usuario.usuario.paisId;
        const roleId = response.data.usuario.usuario.roleId;
  
        // Guardar en localStorage.
        localStorage.setItem("token", token);
        localStorage.setItem("nombreUsuario", nombre);
        localStorage.setItem("correoUsuario", correoUsuario);
        localStorage.setItem("usuarioId", usuarioId);
        localStorage.setItem("roleId", roleId);
        localStorage.setItem("paisId", paisId);
        // console.log("roleId guardado en localStorage:", localStorage.getItem("roleId"));
  
        // Actualizar el estado global con Redux y luego el efecto se encargará de la redirección
        dispatch(loginAuth({ token, nombre, correo: correoUsuario, roleId }));
  
        // // Recargar la página después de iniciar sesión
        // window.location.reload(); 
      } else {
        setError("Credenciales incorrectas");
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("Error al iniciar sesión. Intenta de nuevo.");
      }
    }
  };
  

  return (
    <Flex
      minHeight="100vh"
      align="center"
      justify="center"
      bg={useColorModeValue("gray.100", "gray.900")}
      position="relative"
    >
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        zIndex="-1"
        overflow="hidden"
      >
        <Box
          position="absolute"
          bottom="0"
          left="0"
          right="0"
          height="100px"
          bg="linear-gradient(to top, #00c6ff, #0072ff)"
          opacity="0.5"
          animation="wave 10s infinite linear"
          transform="translate3d(0, 0, 0)"
        />
        <Box
          position="absolute"
          bottom="0"
          left="0"
          right="0"
          height="120px"
          bg="linear-gradient(to top, #00c6ff, #0072ff)"
          opacity="0.7"
          animation="wave 15s infinite linear"
          transform="translate3d(0, 0, 0)"
          css={{
            "@keyframes wave": {
              "0%": { transform: "translateX(0)" },
              "100%": { transform: "translateX(-100%)" },
            },
          }}
        />
        <Box
          as="img"
          src="/images/plant.png"
          position="absolute"
          bottom="20px"
          left="20px"
          zIndex="-1"
          width="150px"
          height="auto"
        />
      </Box>

      <Box
        w="full"
        maxW="md"
        bg={useColorModeValue("white", "gray.800")}
        boxShadow="2xl"
        rounded="lg"
        p={8}
        mt={-10}
      >
        <Stack spacing={4} mb={6} align="center">
          <Heading fontSize="2xl" textAlign="center">
            ¡Bienvenido de nuevo!
          </Heading>
          <Text fontSize="md" color="gray.600">
            Inicia sesión para continuar
          </Text>
        </Stack>
        <form onSubmit={handleSubmit}>
          <Stack spacing={4}>
            <FormControl id="email" isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                placeholder="Tu email"
                value={correo}
                onChange={(e) => setEmail(e.target.value)}
                focusBorderColor="teal.500"
                size="lg"
                rounded="full"
              />
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel>Contraseña</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Tu contraseña"
                  value={contrasena}
                  onChange={(e) => setPassword(e.target.value)}
                  size="lg"
                  rounded="full"
                  focusBorderColor="teal.500"
                />
                <InputRightElement width="4.5rem">
                  <Button
                    h="1.75rem"
                    size="sm"
                    onClick={() => setShowPassword(!showPassword)}
                    variant="ghost"
                    _hover={{ bg: "transparent" }}
                  >
                    {showPassword ? <ViewOffIcon /> : <ViewIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>

            {error && (
              <Alert status="error" rounded="lg" mb={4}>
                <AlertIcon />
                {error}
              </Alert>
            )}

            <Stack spacing={6}>
              <Button
                type="submit"
                colorScheme="teal"
                size="lg"
                rounded="full"
                _hover={{ bg: "teal.600" }}
                
              >
                Iniciar sesión
              </Button>
              <Button
                variant="outline"
                colorScheme="teal"
                size="lg"
                rounded="full"
                _hover={{ bg: "teal.50" }}
                onClick={() => navigate("/auth/registro")}
              >
                Crear cuenta
              </Button>
            </Stack>

            <Link
              color="teal.500"
              textAlign="center"
              onClick={() => navigate("/auth/recuperar_clave")}
              fontSize="sm"
              fontWeight="bold"
              mt={2}
              _hover={{ textDecoration: "underline" }}
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </Stack>
        </form>
      </Box>
    </Flex>
  );
};
