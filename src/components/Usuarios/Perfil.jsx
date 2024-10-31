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
  Text,
  VStack,
  Divider,
} from "@chakra-ui/react";
import { FaCamera } from "react-icons/fa";

const BASE_URL = import.meta.env.VITE_API_URL;

export const Perfil = () => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const usuarioId = localStorage.getItem("usuarioId");

  const colorModeBg = useColorModeValue("gray.50", "gray.800");
  const boxBgColor = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("gray.600", "gray.300");

  useEffect(() => {
    const obtenerUsuarios = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/usuarios/todos`);
        const usuarios = response.data.usuarios;

        const usuarioLogueado = usuarios.find(
          (usuario) => usuario.id === parseInt(usuarioId)
        );

        if (usuarioLogueado) {
          setUserData({
            firstName: usuarioLogueado.nombre,
            lastName: usuarioLogueado.apellido,
            phoneNumber: usuarioLogueado.telefono,
            email: usuarioLogueado.correo,
            avatar: "",
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
    console.log(userData);
  };

  return (
    <Flex
      direction="column"
      align="center"
      minHeight="100vh"
      bg={colorModeBg}
      p={4}
    >
      {isLoading ? (
        <Spinner size="xl" />
      ) : error ? (
        <Box>{error}</Box>
      ) : (
        <Box
          bg={boxBgColor}
          boxShadow="lg"
          rounded="lg"
          w={{ base: "90%", md: "80%", lg: "50%" }}
          maxW="500px"
          p={4}
        >
          <VStack spacing={4}>
            <Box position="relative">
              <Avatar
                size="2xl"
                name={`${userData?.firstName} ${userData?.lastName}`}
                src={userData?.avatar}
              />
              <IconButton
                aria-label="Cambiar avatar"
                icon={<FaCamera />}
                size="sm"
                position="absolute"
                bottom={0}
                right={0}
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

            <Heading as="h2" size="lg" textAlign="center" color="teal.500">
              {userData?.firstName} {userData?.lastName}
            </Heading>

            <Text fontSize="md" color={textColor}>
              Perfil de Usuario
            </Text>

            <Divider />

            <Stack spacing={4} w="100%">
              <FormControl id="firstName" isRequired>
                <FormLabel>Nombres</FormLabel>
                <Input
                  placeholder="Nombres"
                  name="firstName"
                  value={userData?.firstName || ""}
                  onChange={handleChange}
                  variant="filled"
                />
              </FormControl>

              <FormControl id="lastName" isRequired>
                <FormLabel>Apellidos</FormLabel>
                <Input
                  placeholder="Apellidos"
                  name="lastName"
                  value={userData?.lastName || ""}
                  onChange={handleChange}
                  variant="filled"
                />
              </FormControl>

              <FormControl id="phoneNumber">
                <FormLabel>Teléfono</FormLabel>
                <Input
                  placeholder="Teléfono"
                  name="phoneNumber"
                  value={userData?.phoneNumber || ""}
                  onChange={handleChange}
                  variant="filled"
                />
              </FormControl>

              <FormControl id="email">
                <FormLabel>Correo Electrónico</FormLabel>
                <Input
                  placeholder="Correo Electrónico"
                  name="email"
                  value={userData?.email || ""}
                  isReadOnly
                  variant="filled"
                />
              </FormControl>
            </Stack>

            <Button
              w="full"
              colorScheme="teal"
              size="lg"
              onClick={handleSubmit}
              _hover={{ bg: "teal.600" }}
            >
              Guardar Cambios
            </Button>
          </VStack>
        </Box>
      )}
    </Flex>
  );
};
