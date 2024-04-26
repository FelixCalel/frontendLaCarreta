
import { Flex, Input, Stack, Button, Avatar, FormControl, FormLabel, FormHelperText, FormErrorMessage } from "@chakra-ui/react";
import { useState } from "react"

 

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
    direction={{ base: "column", md: "row" }}
    justify="center"
    align="center"
    minHeight="100vh"
    p={10} // Margen uniforme
    spacing={8}
  >
    <Stack spacing={4} flex="1">
      <FormControl id="firstName" isRequired>
        <FormLabel>Nombres</FormLabel>
        <Input
          name="firstName"
          value={userData.firstName}
          onChange={handleChange}
        />
      </FormControl>
      <FormControl id="lastName" isRequired>
        <FormLabel>Apellidos</FormLabel>
        <Input
          name="lastName"
          value={userData.lastName}
          onChange={handleChange}
        />
      </FormControl>
      <FormControl id="phoneNumber">
        <FormLabel>Teléfono</FormLabel>
        <Input
          name="phoneNumber"
          value={userData.phoneNumber}
          onChange={handleChange}
        />
      </FormControl>
      <FormControl id="mobileNumber">
        <FormLabel>Celular</FormLabel>
        <Input
          name="mobileNumber"
          value={userData.mobileNumber}
          onChange={handleChange}
        />
      </FormControl>
      <FormControl id="dpi">
        <FormLabel>DPI</FormLabel>
        <Input
          name="dpi"
          value={userData.dpi}
          onChange={handleChange}
        />
      </FormControl>
      <FormControl id="password">
        <FormLabel>Contraseña</FormLabel>
        <Input
          type="password"
          name="password"
          value={userData.password}
          onChange={handleChange}
        />
      </FormControl>
    </Stack>
    <Stack spacing={4} flex="1">
      <Avatar size="xl" name={`${userData.firstName} ${userData.lastName}`} src={userData.avatar} />
      <input type="file" accept="image/*" onChange={handleAvatarChange} />
      <Button colorScheme="teal" onClick={handleSubmit}>Guardar</Button>
    </Stack>
  </Flex>
  )
}

