import axios from "axios";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Alert,
  AlertIcon,
  Link,
  useToast,
  InputGroup,
  InputRightElement,
  Divider,
  Text,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import PaisSelector from "./component/paisSelector";

export const RegisterForm = () => {
  const navigate = useNavigate();
  const actualUsuario = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    telefono: "",
    contrasena: "",
    confirmacionContrasena: "",
    estadoActivo: true,
    correoValidado: false,
    paisId: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const toast = useToast();

  useEffect(() => {
    if (actualUsuario === "authenticated") {
      return navigate("/admin/dashboard", { replace: true });
    }
  }, [actualUsuario, navigate]);

  useEffect(() => {
    if (formData.contrasena === formData.confirmacionContrasena) {
      setError(""); // Limpia el error si las contraseñas coinciden
    }
  }, [formData.contrasena, formData.confirmacionContrasena]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.contrasena !== formData.confirmacionContrasena) {
      setError("Las contraseñas no coinciden");
      return;
    }
    try {
      const response = await registerUser(formData);
      if (response.ok) {
        toast({
          title: "Usuario creado.",
          description:
            "Usuario creado correctamente. Por favor, verifica tu correo electrónico.",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
        setMessage(
          "Usuario creado correctamente. Por favor, verifica tu correo electrónico."
        );
      } else {
        setError(response.errorMessage);
      }
    } catch (err) {
      setError("Error al registrar el usuario");
    }
  };

  return (
    <Flex
      minHeight="100vh"
      align="center"
      justify="center"
      bg="gray.50"
      padding="20px"
    >
      <Box
        p={8}
        width={{ base: "full", md: "450px" }}
        borderRadius="lg"
        boxShadow="2xl"
        bg="white"
        border="1px solid"
        borderColor="green.200"
      >
        <VStack spacing={6}>
          <Heading as="h2" size="lg" textAlign="center" color="green.600">
            Crea tu Cuenta
          </Heading>
          <Text fontSize="sm" color="gray.500">
            Completa el siguiente formulario para registrarte
          </Text>
        </VStack>

        <form onSubmit={handleSubmit}>
          <VStack spacing={4} mt={6}>
            <FormControl id="nombre" isRequired>
              <FormLabel>Nombre</FormLabel>
              <Input
                name="nombre"
                type="text"
                placeholder="Ingresa tu nombre"
                value={formData.nombre}
                onChange={handleChange}
                focusBorderColor="green.500"
                borderRadius="md"
                size="lg"
              />
            </FormControl>

            <FormControl id="apellido" isRequired>
              <FormLabel>Apellido</FormLabel>
              <Input
                name="apellido"
                type="text"
                placeholder="Ingresa tu apellido"
                value={formData.apellido}
                onChange={handleChange}
                focusBorderColor="green.500"
                borderRadius="md"
                size="lg"
              />
            </FormControl>

            <FormControl id="pais" isRequired>
              <FormLabel>País</FormLabel>
              <PaisSelector
                value={formData.paisId}
                onPaisChange={(paisId) =>
                  setFormData((prev) => ({
                    ...prev,
                    paisId: parseInt(paisId, 10),
                  }))
                }
              />
            </FormControl>

            <FormControl id="correo" isRequired>
              <FormLabel>Correo Electrónico</FormLabel>
              <Input
                name="correo"
                type="email"
                placeholder="Ingresa tu correo electrónico"
                value={formData.correo}
                onChange={handleChange}
                focusBorderColor="green.500"
                borderRadius="md"
                size="lg"
              />
            </FormControl>

            <FormControl id="telefono" isRequired>
              <FormLabel>Teléfono</FormLabel>
              <Input
                name="telefono"
                type="tel"
                placeholder="Ingresa tu teléfono"
                value={formData.telefono}
                onChange={handleChange}
                focusBorderColor="green.500"
                borderRadius="md"
                size="lg"
              />
            </FormControl>

            <Divider my={4} borderColor="gray.300" />

            <FormControl id="contrasena" isRequired>
              <FormLabel>Contraseña</FormLabel>
              <InputGroup>
                <Input
                  name="contrasena"
                  type={showPassword ? "text" : "password"}
                  placeholder="Ingresa tu contraseña"
                  value={formData.contrasena}
                  onChange={handleChange}
                  focusBorderColor="green.500"
                  borderRadius="md"
                  size="lg"
                />
                <InputRightElement width="4.5rem">
                  <Button
                    h="1.75rem"
                    size="sm"
                    onClick={() => setShowPassword(!showPassword)}
                    variant="ghost"
                  >
                    {showPassword ? <ViewOffIcon /> : <ViewIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>

            <FormControl id="confirmacionContrasena" isRequired>
              <FormLabel>Confirmar Contraseña</FormLabel>
              <InputGroup>
                <Input
                  name="confirmacionContrasena"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirma tu contraseña"
                  value={formData.confirmacionContrasena}
                  onChange={handleChange}
                  focusBorderColor="green.500"
                  borderRadius="md"
                  size="lg"
                />
                <InputRightElement width="4.5rem">
                  <Button
                    h="1.75rem"
                    size="sm"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    variant="ghost"
                  >
                    {showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
          </VStack>

          {error && (
            <Alert status="error" variant="left-accent" borderRadius="md" mt={4}>
              <AlertIcon />
              {error}
            </Alert>
          )}

          {message && (
            <Alert
              status="success"
              variant="left-accent"
              borderRadius="md"
              mt={4}
            >
              <AlertIcon />
              {message}
            </Alert>
          )}

          <Button
            type="submit"
            colorScheme="green"
            size="lg"
            mt={6}
            width="full"
            borderRadius="md"
          >
            Registrar
          </Button>

          <Flex justifyContent="center" mt={5}>
            <Link as="a" href="/auth/login" color="green.600">
              Volver al inicio de sesión
            </Link>
          </Flex>
        </form>
      </Box>
    </Flex>
  );
};

async function registerUser(data) {
  const userData = {
    nombre: data.nombre,
    apellido: data.apellido,
    correo: data.correo,
    telefono: parseInt(data.telefono, 10),
    contrasena: data.contrasena,
    estadoActivo: data.estadoActivo,
    correoValidado: data.correoValidado,
    paisId: data.paisId,
  };

  try {
    const response = await axios.post(
      "http://localhost:3000/usuarios/registro",
      userData
    );
    return {
      ok: true,
      usuario: response.data.usuario,
    };
  } catch (error) {
    return {
      ok: false,
      errorMessage:
        error.response?.data?.error || "Error al registrar el usuario",
    };
  }
}
