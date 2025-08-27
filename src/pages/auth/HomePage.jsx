import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar";
import MenuPrincipalD from "../../components/MenuPrincipalD";
import {
  Box,
  Flex,
  Heading,
  Text,
  Badge,
  Icon,
  Button,
  VStack,
  HStack,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  FaUserShield,
  FaUserAlt,
  FaShoppingCart,
  FaBox,
  FaSearch,
  FaUserTie,
  FaPlusCircle,
  FaRegLightbulb,
  FaLaptop,
  FaHardHat,
  FaTools,
} from "react-icons/fa";

const roleMap = {
  1: "Administrador",
  2: "Usuario",
  3: "Ventas",
  5: "Compras",
  6: "QA",
  7: "Supervisor",
  8: "Rol Ejemplo",
  9: "Supervisor producción",
  10: "Encargado de área",
  11: "Digitador",
};
const roleColorMap = {
  Administrador: "red",
  Display: "blue",
  Ventas: "green",
  Supervisor: "pink",
  Compras: "orange",
  QA: "purple",
  "Supervisor producción": "teal",
  "Encargado de área": "cyan",
  Digitador: "yellow",
};
const roleIconMap = {
  Administrador: FaUserShield,
  Display: FaUserAlt,
  Ventas: FaShoppingCart,
  Supervisor: FaUserTie,
  Compras: FaBox,
  QA: FaSearch,
  "Supervisor producción": FaHardHat,
  "Encargado de área": FaTools,
  Digitador: FaLaptop,
};

const tips = [
  "Recuerda revisar la cantidad de los items antes de realizar el pedido.",
  "Puedes ver el historial de pedidos en el menu lateral.",
  "Activa el modo oscuro con el ícono de luna.",
];

const HomePage = () => {
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [rolNombre, setRolNombre] = useState("Sin rol");
  const [roleId, setRoleId] = useState(null);
  const [tipIndex, setTipIndex] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const nombre = localStorage.getItem("nombreUsuario") ?? "";
    const roleIdLS = parseInt(localStorage.getItem("roleId"), 10);

    setNombreUsuario(nombre);

    if (!isNaN(roleIdLS) && roleMap[roleIdLS]) {
      setRolNombre(roleMap[roleIdLS]);
      setRoleId(roleIdLS);
    }
    const id = setInterval(
      () => setTipIndex((i) => (i + 1) % tips.length),
      12000
    );
    return () => clearInterval(id);
  }, []);

  const pageBg = useColorModeValue("gray.50", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");
  const cardBg = useColorModeValue("white", "gray.900");
  const cardBorder = useColorModeValue("gray.200", "gray.700");

  const badgeColorScheme = roleColorMap[rolNombre] || "gray";
  const RoleIcon = roleIconMap[rolNombre];

  return (
    <Flex minH="100vh" direction="column" bg={pageBg} color={textColor}>
      <NavBar />

      <Flex flex="1">
        <MenuPrincipalD />

        <Box flex="1" py={2} px={{ base: 2, md: 2 }}>
          <Box maxW="1900px" mx="auto">
            <VStack align="stretch" spacing={2}>
              <Box
                bg={cardBg}
                border="1px solid"
                borderColor={cardBorder}
                borderRadius="lg"
                p={{ base: 4, md: 4 }}
                //boxShadow="md"
              >
                <VStack align="stretch" spacing={2}>
                  <Heading fontSize={{ base: "2xl", md: "3xl" }}>
                    Bienvenido {nombreUsuario}
                    {rolNombre !== "Sin rol" && (
                      <Badge
                        ml={2}
                        variant="subtle"
                        colorScheme={badgeColorScheme}
                        fontSize="xs"
                        px={2}
                        py={0.5}
                        borderRadius="full"
                      >
                        <HStack spacing={1}>
                          {RoleIcon && <Icon as={RoleIcon} boxSize={3} />}
                          <span>{rolNombre}</span>
                        </HStack>
                      </Badge>
                    )}
                  </Heading>

                  <Text fontSize={{ base: "sm", md: "md" }}>
                    ¡Nos alegra tenerte de vuelta! Explora el menú lateral para
                    acceder a las secciones disponibles.
                  </Text>
                </VStack>
              </Box>

              {roleId === 2 && (
                <Box
                  bg={cardBg}
                  border="1px solid"
                  borderColor={cardBorder}
                  borderRadius="lg"
                  p={{ base: 4, md: 4 }}
                  //boxShadow="md"
                  display="flex"
                  flexDirection="column"
                  justifyContent="space-between"
                >
                  <VStack align="stretch" spacing={2}>
                    <Heading
                      as="h2"
                      fontSize={{ base: "xl", md: "2xl" }}
                      color="green.600"
                    >
                      ¿Listo para tu pedido?
                    </Heading>

                    <Text fontSize={{ base: "sm", md: "md" }}>
                      Haz clic y crea tu pedido de manera rápida. El sistema
                      abrirá directamente el formulario.
                    </Text>

                    <HStack fontSize="xs" color="gray.500">
                      <Icon as={FaRegLightbulb} />
                      <span>{tips[tipIndex]}</span>
                    </HStack>
                  </VStack>

                  <Button
                    mt={4}
                    colorScheme="green"
                    leftIcon={<FaPlusCircle />}
                    size="lg"
                    alignSelf={{ base: "stretch", md: "flex-start" }}
                    onClick={() =>
                      navigate("/pedido/listar", {
                        state: { openCrearPedido: true },
                      })
                    }
                    _hover={{ transform: "scale(1.03)" }}
                  >
                    Crear pedido
                  </Button>
                </Box>
              )}
            </VStack>
          </Box>
        </Box>
      </Flex>
    </Flex>
  );
};

export default HomePage;
