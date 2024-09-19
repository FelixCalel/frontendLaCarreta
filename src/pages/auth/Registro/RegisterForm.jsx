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
      bg="gray.100"
      padding="20px"
    >
      <Box
        p={8}
        width={{ base: "full", md: "450px" }}
        borderRadius="lg"
        boxShadow="lg"
        bg="white"
      >
        <Heading as="h2" size="lg" textAlign="center" mb={6} color="green.800">
          Registro para Usuarios
        </Heading>
        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
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

            <Divider my={4} borderColor="gray.300" />

            <FormControl id="pais" isRequired>
              <FormLabel>País</FormLabel>
              <PaisSelector
                value={formData.paisId}
                onPaisChange={(paisId) =>
                  setFormData((prev) => ({
                    ...prev,
                    paisId: parseInt(paisId, 10), // Convierte paisId a número entero
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
                type="text"
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
                    onMouseDown={() => setShowPassword(true)}
                    onMouseUp={() => setShowPassword(false)}
                    onMouseLeave={() => setShowPassword(false)}
                  >
                    {showPassword ? <ViewOffIcon /> : <ViewIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <FormControl id="confirmacionContrasena" isRequired>
              <FormLabel>Confirmación de Contraseña</FormLabel>
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
                    onMouseDown={() => setShowConfirmPassword(true)}
                    onMouseUp={() => setShowConfirmPassword(false)}
                    onMouseLeave={() => setShowConfirmPassword(false)}
                  >
                    {showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
          </VStack>
          {error && (
            <Box width="full" mt={4}>
              <Alert status="error" variant="left-accent" borderRadius="md">
                <AlertIcon />
                {error}
              </Alert>
            </Box>
          )}
          {message && (
            <Box width="full" mt={4}>
              <Alert status="success" variant="left-accent" borderRadius="md">
                <AlertIcon />
                {message}
              </Alert>
            </Box>
          )}
          <Button
            type="submit"
            colorScheme="green"
            size="lg"
            mt={6}
            width="full"
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

  // Log para ver qué datos están siendo enviados al backend
  console.log("Datos que se envían al backend:", userData);

  try {
    const response = await axios.post(
      "http://localhost:3000/usuarios/registro",
      userData
    );

    // Log para ver la respuesta del backend
    console.log("Respuesta del backend:", response.data);

    return {
      ok: true,
      usuario: response.data.usuario,
    };
  } catch (error) {
    // Log del error para ver más detalles si algo falla
    console.error("Error en el registro:", error.response?.data);

    return {
      ok: false,
      errorMessage:
        error.response?.data?.error || "Error al registrar el usuario",
    };
  }
}
