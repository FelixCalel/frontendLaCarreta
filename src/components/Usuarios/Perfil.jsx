import { useEffect, useState } from "react";
import axios from "axios";
import {
  Flex,
  Input,
  Stack,
  Button,
  Avatar,
  FormControl,
  FormLabel,
  Heading,
  Box,
  IconButton,
  useColorModeValue,
  Spinner,
} from "@chakra-ui/react";
import { FaCamera } from "react-icons/fa";

export const Perfil = () => {
  const [userData, setUserData] = useState(null); // Estado para almacenar los datos del usuario
  const [isLoading, setIsLoading] = useState(true); // Estado para manejar la carga
  const [error, setError] = useState(null); // Estado para manejar errores
  const usuarioId = localStorage.getItem("usuarioId"); // Obtener el ID del usuario desde localStorage

  useEffect(() => {
    // Función para obtener los usuarios desde la API
    const obtenerUsuarios = async () => {
      try {
        const response = await axios.get("http://localhost:3000/usuarios/todos"); // Petición a la API
        const usuarios = response.data.usuarios;

        // Filtrar el usuario que está logueado
        const usuarioLogueado = usuarios.find(
          (usuario) => usuario.id === parseInt(usuarioId)
        );

        if (usuarioLogueado) {
          setUserData({
            firstName: usuarioLogueado.nombre,
            lastName: usuarioLogueado.apellido,
            phoneNumber: usuarioLogueado.telefono,
            email: usuarioLogueado.correo,
            avatar: "", // Puedes agregar un campo para el avatar si lo tienes disponible
          });
        } else {
          setError("Usuario no encontrado");
        }
      } catch (err) {
        setError("Error al obtener la información del usuario");
      } finally {
        setIsLoading(false);
      }
    };

    // Ejecutar la función al montar el componente
    obtenerUsuarios();
  }, [usuarioId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setUserData({
        ...userData,
        avatar: reader.result,
      });
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    // Aquí puedes enviar los datos actualizados del usuario al servidor
    console.log(userData);
  };

  if (isLoading) {
    return (
      <Flex align="center" justify="center" minHeight="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex align="center" justify="center" minHeight="100vh">
        <Box>{error}</Box>
      </Flex>
    );
  }

  return (
    <Flex
      direction="column"
      justify="center"
      align="center"
      minHeight="100vh"
      bg={useColorModeValue("gray.100", "gray.900")}
      p={10}
    >
      <Box
        bg={useColorModeValue("white", "gray.700")}
        boxShadow="xl"
        rounded="lg"
        p={8}
        maxW="lg"
        w="full"
      >
        <Heading as="h2" mb={6} textAlign="center" color="teal.500">
          Perfil de Usuario
        </Heading>
        <Flex direction={{ base: "column", md: "row" }} justify="space-between">
          {/* Datos personales */}
          <Stack spacing={4} flex="1">
            <FormControl id="firstName" isRequired>
              <FormLabel>Nombres</FormLabel>
              <Input
                placeholder="Nombres"
                name="firstName"
                value={userData?.firstName || ""}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl id="lastName" isRequired>
              <FormLabel>Apellidos</FormLabel>
              <Input
                placeholder="Apellidos"
                name="lastName"
                value={userData?.lastName || ""}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl id="phoneNumber">
              <FormLabel>Teléfono</FormLabel>
              <Input
                placeholder="Teléfono"
                name="phoneNumber"
                value={userData?.phoneNumber || ""}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl id="email">
              <FormLabel>Correo Electrónico</FormLabel>
              <Input
                placeholder="Correo Electrónico"
                name="email"
                value={userData?.email || ""}
                isReadOnly
              />
            </FormControl>
          </Stack>

          {/* Avatar y botón */}
          <Stack
            spacing={4}
            align="center"
            flex="1"
            mt={{ base: 6, md: 0 }}
            ml={{ md: 6 }}
          >
            <Box position="relative">
              <Avatar
                size="2xl"
                name={`${userData?.firstName} ${userData?.lastName}`}
                src={userData?.avatar}
                mb={4}
              />
              <IconButton
                aria-label="Cambiar avatar"
                icon={<FaCamera />}
                size="sm"
                position="absolute"
                bottom={2}
                right={2}
                colorScheme="teal"
                onClick={() => document.getElementById("avatarInput").click()}
              />
              <input
                id="avatarInput"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                style={{ display: "none" }}
              />
            </Box>
            <Button
              w="full"
              colorScheme="teal"
              size="lg"
              onClick={handleSubmit}
            >
              Guardar Cambios
            </Button>
          </Stack>
        </Flex>
      </Box>
    </Flex>
  );
};
