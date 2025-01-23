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
import { signInWithEmailAndPassword } from "firebase/auth"; 
import { auth } from "../../middleware/firebase-config";

const BASE_URL = import.meta.env.VITE_API_URL;

export const LoginForm = () => {
  const actualUsuario = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (actualUsuario?.status === "authenticated") {
      navigate("/auth/home", { replace: true });
    }
  }, [actualUsuario, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, correo, contrasena);
      const user = userCredential.user;

          // Verificar si el correo está verificado
    if (!user.emailVerified) {
      setError("El correo electrónico no está verificado. Por favor, verifica tu correo antes de iniciar sesión.");
      return;
    }

      const token = await user.getIdToken();


      const resp = await axios.post(`${BASE_URL}/usuarios/datos`, {
        correo: user.email
      });
      if (resp.data && resp.data.usuario) {
        const { nombre, correo: correoUsuario, id: usuarioId, paisId, roleId } = resp.data.usuario;
        
        localStorage.setItem("token", token);
        localStorage.setItem("token", token);
        localStorage.setItem("nombreUsuario", nombre);
        localStorage.setItem("correoUsuario", correoUsuario);
        localStorage.setItem("usuarioId", usuarioId);
        localStorage.setItem("roleId", roleId);
        localStorage.setItem("paisId", paisId);

        dispatch(

          loginAuth({
            uid: user.uid,         
            email: correoUsuario,  
            displayName: nombre,    
            token,
            roleId,
            paisId,
          })
        );

        
        navigate("/auth/home", { replace: true });
        window.location.reload()
      } else {
        setError("Error al obtener datos del usuario.");
      }
    } catch (err) {
      console.error("Error al iniciar sesión:", err);
      setError("Error al iniciar sesión. Verifica tus credenciales.");
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
      <Box w="full" maxW="md" bg={useColorModeValue("white", "gray.800")} boxShadow="2xl" rounded="lg" p={8}>
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
              <FormLabel>Correo electrónico</FormLabel>
              <Input
                type="email"
                placeholder="Tu correo"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                size="lg"
                rounded="full"
                focusBorderColor="teal.500"
              />
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel>Contraseña</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Tu contraseña"
                  value={contrasena}
                  onChange={(e) => setContrasena(e.target.value)}
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
