import { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Heading,
  Text,
  Spinner,
  Button,
  VStack,
  HStack,
  Icon,
  useColorModeValue,
  Divider,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { fetchAreas } from "../../store/areas/thunks";
import { fetchUsuarios } from "../../store/usuarios/usuariosSlice";
import {
  fetchMesasAsignadasThunk,
  fetchAsignacionesThunk,
} from "../../store/asignacionAM/thunks";
import { MdAdd, MdWorkspaces, MdChevronRight } from "react-icons/md";

const PageAsignacionAreas = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { areas, loading: areasLoading } = useSelector((state) => state.areas);
  const { items, status: usuariosStatus } = useSelector(
    (state) => state.usuarios,
  );
  const usuarios = items || [];
  const usuariosLoading = usuariosStatus === "loading";

  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    const loadInitials = async () => {
      await Promise.all([dispatch(fetchAreas()), dispatch(fetchUsuarios())]);
      setIsInitialLoad(false);
    };
    loadInitials();
  }, [dispatch]);

  const sidebarBg = useColorModeValue("white", "gray.800");
  const sidebarBorder = useColorModeValue("gray.200", "gray.700");
  const mainBg = useColorModeValue("gray.50", "gray.900");
  const headingColor = useColorModeValue("gray.700", "whiteAlpha.900");
  const activeBg = useColorModeValue("green.100", "green.900");
  const activeHoverBg = useColorModeValue("green.200", "green.800");
  const inactiveHoverBg = useColorModeValue("gray.50", "whiteAlpha.100");
  const activeBorderColor = useColorModeValue("green.400", "green.600");
  const activeTextColor = useColorModeValue("green.800", "green.200");
  const inactiveTextColor = useColorModeValue("gray.700", "whiteAlpha.800");
  const activeSubtextColor = useColorModeValue("green.700", "green.400");
  const inactiveSubtextColor = useColorModeValue("gray.500", "whiteAlpha.500");

  if (isInitialLoad && (areasLoading || usuariosLoading)) {
    return (
      <Box
        p={4}
        display="flex"
        justifyContent="center"
        alignItems="center"
        h="50vh"
      >
        <Spinner size="xl" color="green.500" />
        <Text ml={4}>Cargando entorno de producción...</Text>
      </Box>
    );
  }

  const areasEnriquecidas = (areas || [])
    .map((area) => {
      const encargado = (usuarios || []).find(
        (u) => u.id === area.encargado_id,
      );
      return {
        ...area,
        nombreFinal:
          area.nombre && area.nombre !== "Área Sin Nombre"
            ? area.nombre
            : "Área Sin Nombre",
        encargadoNombre: encargado
          ? `${encargado.nombre} ${encargado.apellido}`
          : "Sin encargado",
      };
    })
    .sort((a, b) => a.id - b.id);

  const pathParts = location.pathname.split("/");
  const activeAreaId = pathParts[pathParts.length - 1];

  const handleAreaClick = (areaId) => {
    if (!areaId) return;

    dispatch(fetchMesasAsignadasThunk(areaId));
    dispatch(fetchAsignacionesThunk(areaId));
    navigate(`/asignacion-areas/${areaId}`);
  };

  return (
    <HStack flex="1" spacing={0} alignItems="stretch" bg={mainBg}>
      <Box
        w={{ base: "full", md: "270px" }}
        bg={sidebarBg}
        borderRight="1px solid"
        borderColor={sidebarBorder}
        display="flex"
        flexDirection="column"
        shadow="sm"
        zIndex={1}
      >
        <Box p={4}>
          <Heading
            size="md"
            mb={4}
            color={headingColor}
            display="flex"
            alignItems="center"
          >
            <Icon as={MdWorkspaces} mr={2} color="green.500" />
            Áreas de Producción
          </Heading>
          <Button
            leftIcon={<MdAdd />}
            colorScheme="green"
            w="full"
            variant="solid"
            shadow="sm"
            onClick={() => navigate("/asignacion-areas/nueva")}
          >
            Nueva Área
          </Button>
        </Box>

        <Divider />

        <Box flex="1" overflowY="auto" p={2}>
          <VStack spacing={2} align="stretch">
            {areasEnriquecidas.length > 0 ? (
              areasEnriquecidas.map((area) => {
                const isActive = activeAreaId === String(area.id);
                return (
                  <Box
                    key={area.id}
                    p={4}
                    borderRadius="md"
                    cursor="pointer"
                    bg={isActive ? activeBg : "transparent"}
                    border="1px solid"
                    borderColor={isActive ? activeBorderColor : "transparent"}
                    _hover={{
                      bg: isActive ? activeHoverBg : inactiveHoverBg,
                    }}
                    onClick={() => handleAreaClick(area.id)}
                    transition="all 0.2s"
                  >
                    <Flex justify="space-between" align="center">
                      <Box>
                        <Text
                          fontWeight={isActive ? "extrabold" : "medium"}
                          color={isActive ? activeTextColor : inactiveTextColor}
                          fontSize={isActive ? "md" : "sm"}
                        >
                          {area.nombreFinal}
                        </Text>
                        <Text
                          fontSize="xs"
                          color={
                            isActive ? activeSubtextColor : inactiveSubtextColor
                          }
                          mt={0.5}
                        >
                          {area.encargadoNombre}
                        </Text>
                      </Box>
                      {isActive && (
                        <Icon
                          as={MdChevronRight}
                          color={activeTextColor}
                          boxSize={5}
                        />
                      )}
                    </Flex>
                  </Box>
                );
              })
            ) : (
              <Text textAlign="center" color="gray.500" p={4}>
                No hay áreas.
              </Text>
            )}
          </VStack>
        </Box>
      </Box>

      <Box
        flex="1"
        overflowY="auto"
        position="relative"
        bg={mainBg}
        display={{
          base: location.pathname === "/asignacion-areas" ? "none" : "block",
          md: "block",
        }}
      >
        <Outlet />
      </Box>
    </HStack>
  );
};

export default PageAsignacionAreas;
