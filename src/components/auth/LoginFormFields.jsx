import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Stack,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Button,
  Alert,
  AlertIcon,
  Link,
  useColorModeValue,
  Heading,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import PropTypes from "prop-types";

export const LoginFormFields = ({ onSubmit, isLoading, error }) => {
  const navigate = useNavigate();
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const correoNormalizado = correo.toLowerCase().trim(" ");
    const contrasenaNormalizada = contrasena;
    onSubmit({ correo: correoNormalizado, contrasena: contrasenaNormalizada });
  };

  return (
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
        <Heading as="h1" fontSize="2xl">Inicia Sesión en tu Cuenta</Heading>
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
              autoComplete="email"
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
                autoComplete="current-password"
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
  );
};

LoginFormFields.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  error: PropTypes.string,
};
