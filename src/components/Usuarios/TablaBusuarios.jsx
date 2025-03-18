import { useEffect, useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Input,
  Button,
  useToast,
  Stack,
  Text,
  Box,
  Flex,
  Heading,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  IconButton,
  Switch,
  useColorModeValue,
} from "@chakra-ui/react";
import { FiUserPlus, FiSearch } from "react-icons/fi";
import axios from "axios";
import RutaSelector from "./componentes/RutaSelector";
import RolSelector from "./componentes/RolSelector";

const BASE_URL = import.meta.env.VITE_API_URL;

export const TablaBusuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [rutas, setRutas] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRoutes, setSelectedRoutes] = useState([]);
  const [filteredRutas, setFilteredRutas] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [allRoles, setAllRoles] = useState([]);

  const toast = useToast();
  const roleIdLogueado = localStorage.getItem("roleId");

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/usuarios/todos`);
        console.log("Usuarios obtenidos:", response.data.usuarios);
        setUsuarios(response.data.usuarios);
      } catch (error) {
        console.error("Error al obtener los usuarios:", error);
        toast({
          title: "Error al obtener usuarios",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    };

    const fetchRoles = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/roles/listar`);
        setAllRoles(response.data);
      } catch (error) {
        console.error("Error al obtener roles:", error);
      }
    };

    fetchUsuarios();
    fetchRoles();
  }, [toast]);

  useEffect(() => {
    const fetchRutas = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/tienda/todos`);
        const tiendas = Array.isArray(response.data) ? response.data : [];
        console.log("Tiendas obtenidas:", tiendas);

        const rutasExtraidas = tiendas.map((tienda) => ({
          id: tienda.rutaId,
          nombre: tienda.nombreRuta,
          ciudadId: tienda.ciudadId,
          paisId: tienda.paisId,
        }));

        setRutas(rutasExtraidas);
      } catch (error) {
        console.error(
          "Error al obtener las rutas vinculadas a tiendas:",
          error
        );
      }
    };

    fetchRutas();
  }, [toast]);

  const toggleUsuarioEstado = async (usuarioId, estaActivo) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/usuarios/estado/${usuarioId}`,
        {
          estaActivo: !estaActivo,
        }
      );

      const usuarioActualizado = response.data.usuario;
      setUsuarios((prevUsuarios) =>
        prevUsuarios.map((usuario) =>
          usuario.id === usuarioId ? usuarioActualizado : usuario
        )
      );

      toast({
        title: `Usuario ${
          !estaActivo ? "activado" : "desactivado"
        } correctamente`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error al actualizar el estado del usuario:", error);
      toast({
        title: "Error al actualizar el estado",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const asignarRutas = async (usuarioId) => {
    try {
      if (selectedRoutes.length === 0) {
        toast({
          title: "Selecciona al menos una ruta",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      await axios.post(`${BASE_URL}/usuarios/${usuarioId}/asignar-ruta`, {
        rutaId: selectedRoutes,
      });

      setUsuarios((prevUsuarios) =>
        prevUsuarios.map((usuario) =>
          usuario.id === usuarioId
            ? {
                ...usuario,
                rutas: [...new Set([...usuario.rutas, ...selectedRoutes])].map(
                  (rutaId) => ({ id: rutaId })
                ),
              }
            : usuario
        )
      );

      toast({
        title: "Rutas asignadas correctamente",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      onClose();
    } catch (error) {
      console.error("Error al asignar rutas:", error);
      toast({
        title: "Error al asignar rutas",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const fetchCiudadesYPaises = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/ciudad/todos`);
      console.log("Respuesta de la API de ciudades:", response.data);
      if (response.data && Array.isArray(response.data)) {
        return response.data;
      } else {
        console.error("No se encontraron ciudades en la respuesta de la API");
        return [];
      }
    } catch (error) {
      console.error("Error al obtener las ciudades y países:", error);
      return [];
    }
  };

  const handleOpenAssignRutas = async (usuario) => {
    setSelectedUser(usuario.id);
    setSelectedRoutes(
      usuario.rutas ? usuario.rutas.map((ruta) => ruta.id) : []
    );

    const ciudades = await fetchCiudadesYPaises();

    console.log("Ciudades recibidas:", ciudades);

    if (!ciudades || ciudades.length === 0) {
      toast({
        title: "Error al obtener ciudades",
        description: "No se encontraron ciudades.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const rutasConPais =
      rutas && rutas.length > 0
        ? rutas.map((ruta) => {
            const ciudad = ciudades.find((c) => c.id === ruta.ciudadId);
            return {
              ...ruta,
              paisId: ciudad ? ciudad.paisId : null,
            };
          })
        : [];

    const rutasFiltradas = Array.from(
      new Set(rutasConPais.map((ruta) => ruta.id))
    ).map((id) => rutasConPais.find((ruta) => ruta.id === id));

    setFilteredRutas(rutasFiltradas);
    onOpen();
  };

  const headingColor = useColorModeValue("green.600", "green.200");
  const containerBg = useColorModeValue("white", "gray.800");
  const tableHeaderBg = useColorModeValue("green.100", "green.700");
  const tableHeaderColor = useColorModeValue("green.700", "white");
  const rowHoverBg = useColorModeValue("green.50", "green.900");
  const inputBg = useColorModeValue("white", "gray.900");
  const inputPlaceholderColor = useColorModeValue("gray.400", "gray.500");
  const modalHeaderColor = useColorModeValue("green.600", "green.200");

  return (
    <>
      <Flex justify="space-between" align="center" mb={0} p={8}>
        <Heading size="lg" color={headingColor}>
          Lista de Usuarios
        </Heading>
        <Flex maxWidth="300px">
          <Input
            placeholder="Buscar usuario"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            borderRadius="full"
            bg={inputBg}
            boxShadow="sm"
            _placeholder={{ color: inputPlaceholderColor }}
          />
          <IconButton
            aria-label="Buscar"
            icon={<FiSearch />}
            ml={2}
            colorScheme="green"
          />
        </Flex>
      </Flex>

      <Box borderRadius="md" boxShadow="lg" p={8} bg={containerBg} mt={-8}>
        <Table variant="simple">
          <Thead bg={tableHeaderBg}>
            <Tr>
              <Th color={tableHeaderColor}>Nombre</Th>
              <Th color={tableHeaderColor}>Correo</Th>
              <Th color={tableHeaderColor}>Estado</Th>
              <Th color={tableHeaderColor}>Teléfono</Th>
              <Th color={tableHeaderColor}>Acciones</Th>
              <Th color={tableHeaderColor}>Roles Asignados</Th>
            </Tr>
          </Thead>
          <Tbody>
            {usuarios
              .filter((usuario) =>
                usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((usuario) => {
                const rolUsuario = allRoles.find(
                  (rol) => rol.id === usuario.roleId
                );
                const rolNombre = rolUsuario?.nombre || "Sin rol";

                return (
                  <Tr key={usuario.id} _hover={{ bg: rowHoverBg }}>
                    <Td>
                      {usuario.nombre} {usuario.apellido}
                    </Td>
                    <Td>{usuario.correo}</Td>
                    <Td>
                      <Switch
                        isChecked={usuario.estaActivo}
                        onChange={() =>
                          toggleUsuarioEstado(usuario.id, usuario.estaActivo)
                        }
                        colorScheme="green"
                      />
                    </Td>
                    <Td>{usuario.telefono}</Td>
                    <Td>
                      <Stack align="center" direction="row">
                        <Button
                          size="sm"
                          onClick={() => handleOpenAssignRutas(usuario)}
                          leftIcon={<FiUserPlus />}
                          colorScheme="green"
                          variant="solid"
                          _hover={{ bg: "green.300" }}
                        >
                          Asignar Rutas
                        </Button>
                      </Stack>
                    </Td>
                    <Td>
                      {roleIdLogueado === "1" ? (
                        <RolSelector usuario={usuario} allRoles={allRoles} />
                      ) : (
                        <Text fontSize="sm" color="gray.500">
                          {rolNombre}
                        </Text>
                      )}
                    </Td>
                  </Tr>
                );
              })}
          </Tbody>
        </Table>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader color={modalHeaderColor}>Asignar Rutas</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb={4}>Asignar rutas al usuario ID: {selectedUser}</Text>
            <RutaSelector
              selectedRoutes={selectedRoutes}
              setSelectedRoutes={setSelectedRoutes}
              usuarioId={selectedUser}
              filteredRutas={filteredRutas}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="green"
              onClick={() => asignarRutas(selectedUser)}
            >
              Asignar
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
