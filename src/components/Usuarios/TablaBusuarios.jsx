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
  IconButton,
  Switch,
  useColorModeValue,
} from "@chakra-ui/react";
import { FiUserPlus, FiSearch } from "react-icons/fi";
import axios from "axios";
import RolSelector from "./componentes/RolSelector";
import AsignarRutasModal from "./componentes/AsignarRutasModal";
import { useDispatch } from "react-redux";
import { setRutas } from "../../store/auth/authSlice";
import { tablaPedidos } from "../../store/Pedidos/thunks";
import Pagination from "../../components/pagination";

const BASE_URL = import.meta.env.VITE_API_URL;

export const TablaBusuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch = useDispatch();
  const [allRoles, setAllRoles] = useState([]);
  const toast = useToast();
  const roleIdLogueado = localStorage.getItem("roleId");
  const [rutas, setRutasLocal] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [isAssigning, setIsAssigning] = useState(false);

  const usuariosFiltrados = usuarios.filter((u) => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return true;

    const nombre = (u.nombre ?? "").toLowerCase();
    const apellido = (u.apellido ?? "").toLowerCase();
    const correo = (u.correo ?? "").toLowerCase();
    const nombreCompleto = `${nombre} ${apellido}`.trim();

    return (
      nombre.includes(term) ||
      apellido.includes(term) ||
      nombreCompleto.includes(term) ||
      correo.includes(term)
    );
  });

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const usuariosPagina = usuariosFiltrados.slice(indexOfFirst, indexOfLast);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/usuarios/todos`);
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

        const rutasExtraidas = tiendas.map((tienda) => ({
          id: tienda.rutaId,
          nombre: tienda.nombreRuta,
          ciudadId: tienda.ciudadId,
          paisId: tienda.paisId,
        }));

        // Eliminar duplicados si es necesario, aunque la lógica original no lo hacía explícitamente aquí
        // Pero para el selector es mejor tener rutas únicas
        const uniqueRutas = Array.from(new Set(rutasExtraidas.map(r => r.id)))
            .map(id => rutasExtraidas.find(r => r.id === id));

        setRutasLocal(uniqueRutas);
      } catch (error) {
        console.error("Error al obtener las rutas vinculadas a tiendas:", error);
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
        title: `Usuario ${!estaActivo ? "activado" : "desactivado"} correctamente`,
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

  const handleAssignRutas = async (usuarioId, selectedRoutes) => {
    setIsAssigning(true);
    try {
      if (selectedRoutes.length === 0) {
        // Opcional: Permitir desasignar todo (array vacío)
        // Si el backend lo soporta, enviamos array vacío.
        // Si no, mostramos warning. Asumiremos que se puede limpiar.
      }

      const { data } = await axios.post(
        `${BASE_URL}/usuarios/${usuarioId}/asignar-ruta`,
        { rutaId: selectedRoutes }
      );

      setUsuarios((prev) =>
        prev.map((u) =>
          u.id === usuarioId ? { ...u, rutas: data.usuario.rutas } : u
        )
      );

      const currentUid = Number(localStorage.getItem("usuarioId") ?? 0);

      if (usuarioId === currentUid) {
        const ids = data.usuario.rutas.map((r) => r.id);
        dispatch(setRutas({ ids, objetos: data.usuario.rutas }));
        dispatch(tablaPedidos());
      }

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
    } finally {
        setIsAssigning(false);
    }
  };

  const handleOpenAssignRutas = (usuario) => {
    setSelectedUser(usuario);
    onOpen();
  };

  const headingColor = useColorModeValue("green.600", "green.200");
  const containerBg = useColorModeValue("white", "gray.800");
  const tableHeaderBg = useColorModeValue("green.100", "green.700");
  const tableHeaderColor = useColorModeValue("green.700", "white");
  const rowHoverBg = useColorModeValue("green.50", "green.900");
  const inputBg = useColorModeValue("white", "gray.900");
  const inputPlaceholderColor = useColorModeValue("gray.400", "gray.500");

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
            {usuariosPagina.map((usuario) => {
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
      <Box mb={8}>
        <Pagination
          currentPage={currentPage}
          totalItems={usuariosFiltrados.length}
          itemsPerPage={itemsPerPage}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </Box>
      
      <AsignarRutasModal 
        isOpen={isOpen}
        onClose={onClose}
        usuario={selectedUser}
        rutas={rutas}
        onAssign={handleAssignRutas}
        isLoading={isAssigning}
      />
    </>
  );
};
