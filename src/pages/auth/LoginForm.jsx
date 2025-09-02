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
  keyframes,
  Icon,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { login as loginAuth } from "../../store/auth/authSlice";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../middleware/firebase-config";
import { fetchCurrentUser } from "../../store/auth/thunks";
import { FaShoppingCart } from "react-icons/fa";

const BASE_URL = import.meta.env.VITE_API_URL;

const float = keyframes`
  0% { transform: translateY(10vh); opacity: 0; }
  20% { opacity: 1; }
  80% { opacity: 1; }
  100% { transform: translateY(-120vh); opacity: 0; }
`;

const AnimatedBackground = () => {
  const icons = ["🍍", "🍎", "🛒", "🛍️", "🥦", "🥖", "🧀", "🍇"];
  const bg = useColorModeValue("teal.50", "gray.900");

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
      {Array.from({ length: 15 }).map((_, index) => {
        const duration = Math.random() * 15 + 10;
        const delay = Math.random() * 15;
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
          >
            {icons[Math.floor(Math.random() * icons.length)]}
          </Text>
        );
      })}
    </Box>
  );
};

const BrandingPanel = ({ ...props }) => (
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
);

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
            rutas: resp.data.usuario.rutas?.map((r) => r.id) ?? [],
            rutasFull: resp.data.usuario.rutas,
            id: usuarioId,
          })
        );
        await dispatch(fetchCurrentUser());
        navigate("/auth/home", { replace: true });
        window.location.reload();
      } else {
        setError("Error al obtener datos del usuario.");
      }
    } catch (err) {
      console.error("Error al iniciar sesión:", err);
      setError("Error al iniciar sesión. Verifica tus credenciales.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Stack direction={{ base: "column", md: "row" }} minH={"100vh"}>
      <BrandingPanel display={{ base: "none", md: "flex" }} />
      <Flex
        p={8}
        flex={1}
        align={"center"}
        justify={"center"}
        bg={useColorModeValue("gray.50", "gray.800")}
      >
        <Stack
          spacing={4}
          w={"full"}
          maxW={"md"}
          rounded={"xl"}
          boxShadow={"lg"}
          p={8}
          sx={{
            "@media (max-width: 48em)": {
              bg: "white",
              color: useColorModeValue("gray.800", "white"),
            },
            "@media (min-width: 48em)": {
              bg: useColorModeValue("white", "gray.700"),
              color: useColorModeValue("gray.800", "white"),
            },
          }}
        >
          <Stack align={"center"}>
            <Icon
              as={FaShoppingCart}
              w={12}
              h={12}
              color={{
                base: useColorModeValue("teal.500", "teal.300"),
                md: useColorModeValue("teal.500", "teal.300"),
              }}
            />
            <Heading fontSize={"2xl"}>Inicia Sesión en tu Cuenta</Heading>
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
                  bg={{ base: "white", md: "inherit" }}
                  _placeholder={{ color: { base: "gray.600", md: "gray.500" } }}
                  borderColor={{
                    base: useColorModeValue("gray.400", "inherit"),
                    md: "inherit",
                  }}
                  _hover={{ borderColor: { base: "teal.200", md: "inherit" } }}
                  _focus={{
                    borderColor: "teal.200",
                    boxShadow: `0 0 0 1px var(--chakra-colors-teal-200)`,
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
                    bg={{ base: "white", md: "inherit" }}
                    _placeholder={{
                      color: { base: "gray.600", md: "gray.500" },
                    }}
                    borderColor={{
                      base: useColorModeValue("gray.400", "inherit"),
                      md: "inherit",
                    }}
                    _hover={{
                      borderColor: { base: "teal.200", md: "inherit" },
                    }}
                    _focus={{
                      borderColor: "teal.200",
                      boxShadow: `0 0 0 1px var(--chakra-colors-teal-200)`,
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
  );
};
