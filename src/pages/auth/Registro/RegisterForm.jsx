import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_URL;

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
  const [error, setError] = useState({});
  const [message, setMessage] = useState("");
  const toast = useToast();

  const validateForm = () => {
    const errors = {};

    // Validar nombre y apellido (solo letras, mínimo 2 caracteres)
    const nameRegex = /^[a-zA-Z\s]{2,}$/;
    if (!nameRegex.test(formData.nombre)) {
      errors.nombre =
        "El nombre solo debe contener letras y ser mayor a 2 caracteres.";
    }
    if (!nameRegex.test(formData.apellido)) {
      errors.apellido =
        "El apellido solo debe contener letras y ser mayor a 2 caracteres.";
    }

    // Validar correo
    if (!formData.correo) {0
      errors.correo = "El correo electrónico es obligatorio.";
    } else if (!/\S+@\S+\.\S+/.test(formData.correo)) {
      errors.correo = "El correo no tiene un formato válido.";
    }

    // Validar teléfono (solo números, mínimo 8 caracteres)
    if (!/^\d{8,}$/.test(formData.telefono)) {
      errors.telefono =
        "El teléfono solo debe contener números y tener al menos 8 dígitos.";
    }

    // Validar contraseñas (iguales, mínimo 8 caracteres, al menos un número y una letra)
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    if (!passwordRegex.test(formData.contrasena)) {
      errors.contrasena =
        "La contraseña debe tener al menos 6 caracteres, incluir letras y números.";
    }
    if (formData.contrasena !== formData.confirmacionContrasena) {
      errors.confirmacionContrasena = "Las contraseñas no coinciden.";
    }

    // Validar país (debe ser seleccionado)
    if (!formData.paisId) {
      errors.paisId = "Debe seleccionar un país.";
    }

    return errors;
  };

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

    // Validar formulario
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors);
      return;
    }

    setError("");
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
        setError({ general: response.errorMessage });
      }
    } catch (err) {
      setError({ general: "Error al registrar el usuario." });
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
            <FormControl id="nombre" isInvalid={!!error.nombre} isRequired>
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
              {error.nombre && (
                <Text color="red.500" fontSize="sm">
                  {error.nombre}
                </Text>
              )}
            </FormControl>

            <FormControl id="apellido" isInvalid={!!error.apellido} isRequired>
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
              {error.apellido && (
                <Text color="red.500" fontSize="sm">
                  {error.apellido}
                </Text>
              )}
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

            <FormControl id="telefono" isInvalid={!!error.telefono} isRequired>
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
              {error.telefono && (
                <Text color="red.500" fontSize="sm">
                  {error.telefono}
                </Text>
              )}
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
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    variant="ghost"
                  >
                    {showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
          </VStack>

          {error.general && (
            <Alert
              status="error"
              variant="left-accent"
              borderRadius="md"
              mt={4}
            >
              <AlertIcon />
              {error.general}
            </Alert>
          )}

          {Object.keys(error).map((key) => (
            <Alert
              key={key}
              status="error"
              variant="left-accent"
              borderRadius="md"
              mt={4}
            >
              <AlertIcon />
              {error[key]}
            </Alert>
          ))}

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
    roleId: 2,
  };

  try {
    const response = await axios.post(
      `${BASE_URL}/usuarios/registro`,
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
