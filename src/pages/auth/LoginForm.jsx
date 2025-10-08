import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
  keyframes,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { login as loginAuth } from "../../store/auth/authSlice";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../middleware/firebase-config";
import { fetchCurrentUser } from "../../store/auth/thunks";

const BASE_URL = import.meta.env.VITE_API_URL;

const float = keyframes`
  0% { transform: translateY(10vh); opacity: 0; }
  20% { opacity: 1; }
  80% { opacity: 1; }
  100% { transform: translateY(-120vh); opacity: 0; }
`;

const AnimatedBackground = React.memo(() => {
  const icons = React.useMemo(
    () => ["🍍", "🍎", "🥑", "🥬", "🥦", "🥖", "🍌", "🍓"],
    []
  );
  const bg = useColorModeValue("teal.50", "gray.900");

  const animatedElements = React.useMemo(() => {
    return Array.from({ length: 15 }).map((_, index) => {
      const duration = Math.random() * 15 + 10;
      const delay = Math.random() * 10;
      const animation = `${float} ${duration}s linear ${delay}s infinite`;
      return (
        <Text
          key={index}
          position="absolute"
          bottom="-20%"
          left={`${Math.random() * 95}%`}
          fontSize={`${Math.random() * 1.5 + 0.75}rem`}
          animation={animation}
          opacity={0}
          zIndex={0}
          willChange="transform, opacity"
        >
          {icons[Math.floor(Math.random() * icons.length)]}
        </Text>
      );
    });
  }, [icons]); // Dependencia corregida

  return (
    <Box
      position="absolute"
      top={0}
      left={0}
      right={0}
      bottom={0}
      overflow="hidden"
      bg={bg}
      zIndex={0}
    >
      {animatedElements}
    </Box>
  );
});

AnimatedBackground.displayName = "AnimatedBackground";

const BrandingPanel = React.memo(({ ...props }) => (
  <Flex
    flex={1}
    align={"center"}
    justify={"center"}
    position="relative"
    {...props}
  >
    <AnimatedBackground />
    <Stack spacing={4} w={"full"} maxW={"md"} p={8} zIndex={1}>
      <Heading
        fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
        color={useColorModeValue("teal.700", "teal.200")}
      >
        ¡Bienvenido de Nuevo!
      </Heading>
      <Text
        fontSize={{ base: "md", lg: "lg" }}
        color={useColorModeValue("gray.600", "gray.300")}
      >
        Inicia sesión para continuar gestionando tus pedidos en La Carreta.
      </Text>
    </Stack>
  </Flex>
));

BrandingPanel.displayName = "BrandingPanel";

export const LoginForm = () => {
  const actualUsuario = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (actualUsuario?.status === "authenticated") {
      navigate("/auth/home", { replace: true });
    }
  }, [actualUsuario, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        correo,
        contrasena
      );
      const user = userCredential.user;

      if (!user.emailVerified) {
        setError(
          "El correo electrónico no está verificado. Por favor, verifica tu correo antes de iniciar sesión."
        );
        setIsLoading(false);
        return;
      }

      const token = await user.getIdToken();
      const resp = await axios.post(`${BASE_URL}/usuarios/datos`, {
        correo: user.email,
      });

      if (resp.data && resp.data.usuario) {
        const {
          nombre,
          correo: correoUsuario,
          id: usuarioId,
          paisId,
          roleId,
          estaActivo,
        } = resp.data.usuario;

        if (!estaActivo) {
          setError("Tu usuario está inactivo. No tienes acceso al sistema.");
          setIsLoading(false);
          return;
        }

        // Intercambiar token de Firebase por JWT del backend
        console.log("Enviando token de Firebase para intercambio:", token);
        try {
          // Primer intento: endpoint de usuarios (entorno local/dev)
          let access_token = null;
          let refresh_token = null;

          try {
            const tokenExchangeResp = await axios.post(
              `${BASE_URL}/usuarios/exchange-token`,
              {
                firebaseToken: token,
              }
            );
            access_token = tokenExchangeResp?.data?.access_token ?? null;
            refresh_token = tokenExchangeResp?.data?.refresh_token ?? null;
          } catch (e) {
            // Fallback: algunos entornos exponen /login/firebase
            const status = e?.response?.status;
            if (status === 404 || status === 401 || status === 405) {
              const fbResp = await axios.post(`${BASE_URL}/login/firebase`, {
                idToken: token,
              });
              access_token =
                fbResp?.data?.accessToken ?? fbResp?.data?.access_token ?? null;
              refresh_token =
                fbResp?.data?.refreshToken ??
                fbResp?.data?.refresh_token ??
                null;
            } else {
              throw e;
            }
          }

          console.log("JWT del backend recibido:", access_token);

          if (!access_token) {
            throw new Error("No se recibió access_token del backend");
          }

          localStorage.setItem("access_token", access_token);
          if (refresh_token) {
            localStorage.setItem("refresh_token", refresh_token);
          }
          console.log("Token guardado en localStorage:", access_token);
          console.log(
            "Verificación localStorage access_token:",
            localStorage.getItem("access_token")
          );
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
              token: access_token,
              roleId,
              paisId,
              rutas: resp.data.usuario.rutas?.map((r) => r.id) ?? [],
              rutasFull: resp.data.usuario.rutas,
              id: usuarioId,
            })
          );
          await dispatch(fetchCurrentUser());
          navigate("/auth/home", { replace: true });
          // Ya no forzamos recarga: el interceptor de axios adjunta el token dinámicamente
        } catch (tokenError) {
          console.error("Error al intercambiar token:", tokenError);
          const msg =
            tokenError?.response?.data?.message ||
            tokenError?.response?.data?.error ||
            tokenError?.message ||
            "Error al obtener token de autenticación.";
          setError(msg);
          setIsLoading(false);
          return;
        }
      } else {
        setError("Error al obtener datos del usuario.");
      }
    } catch (err) {
      console.error("Error al iniciar sesión:", err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Error al iniciar sesión. Verifica tus credenciales.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box position="relative" minH="100vh" w="100vw" overflow="hidden">
      <AnimatedBackground />
      <Stack
        direction={{ base: "column", md: "row" }}
        minH="100vh"
        position="relative"
        zIndex={1}
      >
        <BrandingPanel display={{ base: "none", md: "flex" }} />
        <Flex p={1} flex={1} align="center" justify="center" bg="transparent">
          <Stack
            spacing={4}
            w="full"
            maxW="md"
            rounded="xl"
            boxShadow="lg"
            p={6}
            bg={useColorModeValue("white", "gray.700")}
            color={useColorModeValue("gray.800", "white")}
          >
            <Stack align="center">
              <Heading fontSize="2xl">Inicia Sesión en tu Cuenta</Heading>
            </Stack>
            <form onSubmit={handleSubmit}>
              <Stack spacing={4}>
                <FormControl id="email" isRequired>
                  <FormLabel>Correo electrónico</FormLabel>
                  <Input
                    type="email"
                    placeholder="tu-correo@ejemplo.com"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    size="lg"
                    rounded="md"
                    bg={useColorModeValue("white", "gray.800")}
                    color={useColorModeValue("gray.800", "white")}
                    _placeholder={{
                      color: useColorModeValue("gray.600", "gray.400"),
                    }}
                    borderColor={useColorModeValue("gray.400", "gray.600")}
                    _hover={{
                      borderColor: useColorModeValue("teal.200", "teal.400"),
                    }}
                    _focus={{
                      borderColor: useColorModeValue("teal.200", "teal.500"),
                      boxShadow: `0 0 0 1px ${useColorModeValue(
                        "teal.200",
                        "teal.500"
                      )}`,
                    }}
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
                      rounded="md"
                      bg={useColorModeValue("white", "gray.800")}
                      color={useColorModeValue("gray.800", "white")}
                      _placeholder={{
                        color: useColorModeValue("gray.600", "gray.400"),
                      }}
                      borderColor={useColorModeValue("gray.400", "gray.600")}
                      _hover={{
                        borderColor: useColorModeValue("teal.200", "teal.400"),
                      }}
                      _focus={{
                        borderColor: useColorModeValue("teal.200", "teal.500"),
                        boxShadow: `0 0 0 1px ${useColorModeValue(
                          "teal.200",
                          "teal.500"
                        )}`,
                      }}
                    />
                    <InputRightElement width="4.5rem">
                      <Button
                        h="1.75rem"
                        size="sm"
                        onClick={() => setShowPassword(!showPassword)}
                        variant="ghost"
                        _hover={{ bg: "whiteAlpha.300" }}
                      >
                        {showPassword ? <ViewOffIcon /> : <ViewIcon />}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                </FormControl>

                {error && (
                  <Alert status="error" rounded="md" bg="red.500" color="white">
                    <AlertIcon color="white" />
                    {error}
                  </Alert>
                )}

                <Stack spacing={6} pt={2}>
                  <Button
                    type="submit"
                    bg={"green.400"}
                    color={"white"}
                    size="lg"
                    isLoading={isLoading}
                    _hover={{ bg: "green.500" }}
                  >
                    Iniciar Sesión
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => navigate("/auth/registro")}
                    borderColor={{
                      base: useColorModeValue("green.500", "inherit"),
                      md: "inherit",
                    }}
                    _hover={{ bg: "whiteAlpha.300" }}
                    color={{
                      base: useColorModeValue("gray.800", "inherit"),
                      md: "inherit",
                    }}
                  >
                    Crear Cuenta Nueva
                  </Button>
                </Stack>

                <Link
                  color={{ base: "teal.200", md: "teal.500" }}
                  textAlign="center"
                  onClick={() => navigate("/auth/recuperar_clave")}
                  fontWeight="medium"
                  mt={2}
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </Stack>
            </form>
          </Stack>
        </Flex>
      </Stack>
    </Box>
  );
};
