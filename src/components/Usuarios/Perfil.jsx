import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { updateUser } from "../../store/auth";
import { startUpdateProfile } from "../../store/auth/thunks";
import { fetchUsuarioById } from "../../store/usuarios/thunks";
import {
  Box,
  Container,
  Card,
  CardHeader,
  Flex,
  Avatar,
  IconButton,
  VStack,
  Heading,
  Text,
  CardBody,
  SimpleGrid,
  FormControl,
  FormLabel,
  Input,
  CardFooter,
  Button,
  Spinner,
  useToast,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaUser, FaCamera, FaPhone, FaSave, FaEnvelope } from "react-icons/fa";

export const Perfil = () => {
  const dispatch = useDispatch();
  const [userData, setUserData] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    correo: "",
    avatar: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const usuarioId = localStorage.getItem("usuarioId");
  const toast = useToast();

  const bg = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const iconColor = useColorModeValue("brand.500", "brand.300");
  const headerGradient = useColorModeValue(
    "linear(to-b, white, gray.50)",
    "linear(to-r, brand.800, brand.900)"
  );
  const inputBg = useColorModeValue("gray.100", "gray.700");
  const inputHoverBg = useColorModeValue("gray.200", "gray.600");
  const inputFocusBg = useColorModeValue("white", "gray.600");
  const buttonHoverBg = "brand.600";
  const buttonActiveBg = "brand.700";

  useEffect(() => {
    const obtenerUsuario = async () => {
      if (!usuarioId) return;
      try {
        const resultAction = await dispatch(fetchUsuarioById(usuarioId));
        if (fetchUsuarioById.fulfilled.match(resultAction)) {
          const usuario = resultAction.payload;
          setUserData({
            nombre: usuario.nombre || "",
            apellido: usuario.apellido || "",
            telefono: usuario.telefono || "",
            correo: usuario.correo || "",
            avatar: usuario.avatar || "",
          });
        } else {
          throw new Error("No se pudo cargar la información del usuario.");
        }
      } catch (err) {
        toast({
          title: "Error",
          description: "No se pudo cargar la información del usuario.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    obtenerUsuario();
  }, [usuarioId, toast, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserData({
          ...userData,
          avatar: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    setIsSaving(true);
    try {
      const resultAction = await dispatch(
        startUpdateProfile({
          usuarioId,
          userData: {
            nombre: userData.nombre,
            apellido: userData.apellido,
            telefono: userData.telefono,
            avatar: userData.avatar,
          },
        })
      );

      if (startUpdateProfile.fulfilled.match(resultAction)) {
        window.dispatchEvent(new Event("profileUpdated"));

        toast({
          title: "Perfil actualizado",
          description: "Los cambios se han guardado correctamente.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } else {
        throw new Error(resultAction.payload || "Error al actualizar");
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error.message || "Hubo un problema al guardar los cambios.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Flex justify="center" align="center" minH="100vh" bg={bg}>
        <Spinner size="xl" color="brand.500" thickness="4px" />
      </Flex>
    );
  }

  return (
    <Box minH="100vh" bg={bg} py={10}>
      <Container maxW="container.md">
        <Card bg={cardBg} shadow="xl" borderRadius="2xl" overflow="hidden">
          <Box h="150px" bgGradient={headerGradient} />
          <CardHeader pb={0}>
            <Flex justify="center" mt="-75px">
              <Box position="relative">
                <Avatar
                  key={userData.avatar}
                  size="2xl"
                  name={`${userData.nombre} ${userData.apellido}`}
                  src={userData.avatar}
                  border="4px solid white"
                  showBorder={true}
                  shadow="lg"
                  bg="brand.500"
                  ignoreFallback={false}
                  icon={<FaUser fontSize="3rem" />}
                />
                <IconButton
                  aria-label="Cambiar avatar"
                  icon={<FaCamera />}
                  size="sm"
                  position="absolute"
                  bottom={2}
                  right={2}
                  colorScheme="green"
                  bg="brand.500"
                  _hover={{ bg: "brand.600" }}
                  rounded="full"
                  shadow="md"
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
            </Flex>
            <VStack mt={4} spacing={1}>
              <Heading size="lg" color={textColor}>
                {userData.nombre} {userData.apellido}
              </Heading>
              <Text color="gray.500" fontSize="sm">
                {userData.correo}
              </Text>
            </VStack>
          </CardHeader>

          <CardBody>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mt={6}>
              <FormControl>
                <FormLabel display="flex" alignItems="center" gap={2}>
                  <FaUser color={iconColor} /> Nombres
                </FormLabel>
                <Input
                  name="nombre"
                  value={userData.nombre}
                  onChange={handleChange}
                  focusBorderColor="brand.500"
                  variant="filled"
                  bg={inputBg}
                  _hover={{ bg: inputHoverBg }}
                  _focus={{
                    bg: inputFocusBg,
                    borderColor: "brand.500",
                  }}
                />
              </FormControl>

              <FormControl>
                <FormLabel display="flex" alignItems="center" gap={2}>
                  <FaUser color={iconColor} /> Apellidos
                </FormLabel>
                <Input
                  name="apellido"
                  value={userData.apellido}
                  onChange={handleChange}
                  focusBorderColor="brand.500"
                  variant="filled"
                  bg={inputBg}
                  _hover={{ bg: inputHoverBg }}
                  _focus={{
                    bg: inputFocusBg,
                    borderColor: "brand.500",
                  }}
                />
              </FormControl>

              <FormControl>
                <FormLabel display="flex" alignItems="center" gap={2}>
                  <FaPhone color={iconColor} /> Teléfono
                </FormLabel>
                <Input
                  name="telefono"
                  value={userData.telefono}
                  isReadOnly
                  variant="filled"
                  bg={inputBg}
                  _hover={{ bg: inputHoverBg }}
                  cursor="not-allowed"
                  color="gray.500"
                />
                <Text fontSize="xs" color="gray.500" mt={1}>
                  El teléfono no se puede modificar.
                </Text>
              </FormControl>

              <FormControl>
                <FormLabel display="flex" alignItems="center" gap={2}>
                  <FaEnvelope color={iconColor} /> Correo Electrónico
                </FormLabel>
                <Input
                  name="correo"
                  value={userData.correo}
                  isReadOnly
                  variant="filled"
                  bg={inputBg}
                  _hover={{ bg: inputHoverBg }}
                  cursor="not-allowed"
                  color="gray.500"
                />
                <Text fontSize="xs" color="gray.500" mt={1}>
                  El correo electrónico no se puede modificar.
                </Text>
              </FormControl>
            </SimpleGrid>
          </CardBody>

          <CardFooter justify="center" pb={8}>
            <Button
              leftIcon={<FaSave />}
              bg="brand.500"
              color="white"
              size="lg"
              px={8}
              onClick={handleSubmit}
              isLoading={isSaving}
              loadingText="Guardando..."
              shadow="md"
              _hover={{
                transform: "translateY(-2px)",
                shadow: "lg",
                bg: buttonHoverBg,
              }}
              _active={{ bg: buttonActiveBg }}
              transition="all 0.2s"
            >
              Guardar Cambios
            </Button>
          </CardFooter>
        </Card>
      </Container>
    </Box>
  );
};
