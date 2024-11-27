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
} from "@chakra-ui/react";
import { FiSearch } from "react-icons/fi";
import axios from "axios";
import RutaSelector from "./RutaSelector";

const BASE_URL = import.meta.env.VITE_API_URL;

export const TablaBusuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [rutas, setRutas] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRoutes, setSelectedRoutes] = useState([]);
  const [filteredRutas, setFilteredRutas] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // Fetch usuarios
  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/usuarios/todos`);
        setUsuarios(response.data.usuarios || []);
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
    fetchUsuarios();
  }, [toast]);

  // Fetch rutas
  useEffect(() => {
    const fetchRutas = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/tienda/todos`);
        const tiendas = Array.isArray(response.data) ? response.data : [];
        const rutasExtraidas = tiendas.map((tienda) => ({
          id: tienda.rutaId,
          nombre: tienda.nombreRuta,
          ciudadId: tienda.ciudadId,
          paisId: tienda.paisId,
        }));

        const rutasUnicas = rutasExtraidas.filter(
          (ruta, index, self) => index === self.findIndex((r) => r.id === ruta.id)
        );
        setRutas(rutasUnicas);
      } catch (error) {
        console.error("Error al obtener las rutas vinculadas a tiendas:", error);
      }
    };
    fetchRutas();
  }, [toast]);

  // Fetch ciudades y países
  const fetchCiudadesYPaises = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/ciudad/todos`);
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error("Error al obtener las ciudades y países:", error);
      return [];
    }
  };

  // Asignar rutas al usuario
  const asignarRutas = async (usuarioId) => {
    if (selectedRoutes.length === 0) {
      toast({
        title: "Selecciona al menos una ruta",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    try {
      await axios.post(`${BASE_URL}/usuarios/${usuarioId}/asignar-ruta`, {
        rutaId: selectedRoutes,
      });
      setUsuarios((prevUsuarios) =>
        prevUsuarios.map((usuario) =>
          usuario.id === usuarioId
            ? {
                ...usuario,
                rutas: selectedRoutes.map((rutaId) => ({ id: rutaId })),
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

  // Manejo de la apertura del modal para asignar rutas
  const handleOpenAssignRutas = async (usuario) => {
    setSelectedUser(usuario.id);
    setSelectedRoutes(usuario.rutas ? usuario.rutas.map((ruta) => ruta.id) : []);

    const ciudades = await fetchCiudadesYPaises();
    if (ciudades.length === 0) {
      toast({
        title: "Error al obtener ciudades",
        description: "No se encontraron ciudades.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Asignar el paisId a las rutas
    const rutasConPais = rutas.map((ruta) => {
      const ciudad = ciudades.find((c) => c.id === ruta.ciudadId);
      return {
        ...ruta,
        paisId: ciudad ? ciudad.paisId : null,
      };
    });

    // Filtrar las rutas que coincidan con el paisId del usuario
    const rutasFiltradas = rutasConPais.filter((ruta) => ruta.paisId === usuario.paisId);

    setFilteredRutas(rutasFiltradas); // Asegúrate de que se actualiza correctamente
  };

  useEffect(() => {
    if (filteredRutas.length > 0) {
      onOpen(); // Abre el modal solo después de que las rutas se hayan filtrado
    }
  }, [filteredRutas, onOpen]);

  // Toggle estado del usuario (activo/desactivado)
  const toggleUsuarioEstado = async (usuarioId, estaActivo) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/usuarios/estado/${usuarioId}`,
        { estaActivo: !estaActivo }
      );
      const usuarioActualizado = response.data.usuario;
      setUsuarios((prevUsuarios) =>
        prevUsuarios.map((usuario) =>
          usuario.id === usuarioId ? usuarioActualizado : usuario
        )
      );
      if (selectedUser === usuarioId) {
        setSelectedUser(usuarioActualizado);
      }
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

  return (
    <>
      <Flex justify="space-between" align="center" mb={4}>
        <Heading size="lg" color="green.600">
          Lista de Usuarios
        </Heading>
        <Flex maxWidth="300px">
          <Input
            placeholder="Buscar usuario"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            borderRadius="full"
            bg="white"
            boxShadow="sm"
            _placeholder={{ color: "gray.400" }}
          />
          <IconButton
            aria-label="Buscar"
            icon={<FiSearch />}
            ml={2}
            colorScheme="green"
          />
        </Flex>
      </Flex>

      <Box borderRadius="md" boxShadow="lg" p={4} bg="white">
        <Table variant="simple">
          <Thead bg="green.100">
            <Tr>
              <Th color="green.700">Nombre</Th>
              <Th color="green.700">Correo</Th>
              <Th color="green.700">Estado</Th>
              <Th color="green.700">Teléfono</Th>
              <Th color="green.700">Acciones</Th>
            </Tr>
          </Thead>
          <Tbody>
            {usuarios
              .filter((usuario) =>
                usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((usuario) => (
                <Tr key={usuario.id} _hover={{ bg: "green.50" }}>
                  <Td>
                    {usuario.nombre} {usuario.apellido}
                  </Td>
                  <Td>{usuario.correo}</Td>
                  <Td>
                    <Switch
                      isChecked={usuario.estaActivo}
                      onChange={() => toggleUsuarioEstado(usuario.id, usuario.estaActivo)}
                      colorScheme="green"
                    />
                  </Td>
                  <Td>{usuario.telefono}</Td>
                  <Td>
                    <Button
                      colorScheme="green"
                      size="sm"
                      onClick={() => handleOpenAssignRutas(usuario)}
                    >
                      Asignar rutas
                    </Button>
                  </Td>
                </Tr>
              ))}
          </Tbody>
        </Table>
      </Box>

      {/* Modal para asignar rutas */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Asignar Rutas a Usuario</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={4}>
              <Text fontSize="lg" fontWeight="bold">Rutas Disponibles</Text>
              {filteredRutas.length > 0 ? (
                <RutaSelector
                  rutas={filteredRutas}
                  selectedRoutes={selectedRoutes}
                  setSelectedRoutes={setSelectedRoutes}
                />
              ) : (
                <Text>No hay rutas disponibles para este usuario.</Text>
              )}
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="green" mr={3} onClick={() => asignarRutas(selectedUser)}>
              Asignar Rutas
            </Button>
            <Button variant="ghost" onClick={onClose}>Cancelar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

