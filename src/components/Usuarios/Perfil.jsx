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
} from "@chakra-ui/react";
import { useState } from "react";
import { FaCamera } from "react-icons/fa";

export const Perfil = () => {
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    mobileNumber: "",
    dpi: "",
    password: "",
    avatar: "",
  });

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
    // Aquí puedes enviar los datos del usuario al servidor
    console.log(userData);
  };

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
                placeholder="Juan"
                name="firstName"
                value={userData.firstName}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl id="lastName" isRequired>
              <FormLabel>Apellidos</FormLabel>
              <Input
                placeholder="Pérez"
                name="lastName"
                value={userData.lastName}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl id="phoneNumber">
              <FormLabel>Teléfono</FormLabel>
              <Input
                placeholder="2222-3333"
                name="phoneNumber"
                value={userData.phoneNumber}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl id="mobileNumber">
              <FormLabel>Celular</FormLabel>
              <Input
                placeholder="5555-6666"
                name="mobileNumber"
                value={userData.mobileNumber}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl id="dpi">
              <FormLabel>DPI</FormLabel>
              <Input
                placeholder="1234567890101"
                name="dpi"
                value={userData.dpi}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl id="password">
              <FormLabel>Contraseña</FormLabel>
              <Input
                type="password"
                placeholder="••••••••"
                name="password"
                value={userData.password}
                onChange={handleChange}
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
                name={`${userData.firstName} ${userData.lastName}`}
                src={userData.avatar}
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
              Guardar
            </Button>
          </Stack>
        </Flex>
      </Box>
    </Flex>
  );
};
