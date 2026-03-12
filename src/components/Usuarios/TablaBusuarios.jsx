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
  Spinner,
} from "@chakra-ui/react";
import { FiUserPlus, FiSearch } from "react-icons/fi";
import RolSelector from "./componentes/RolSelector";
import AsignarRutasModal from "./componentes/AsignarRutasModal";
import { useDispatch, useSelector } from "react-redux";
import { setRutas } from "../../store/auth/authSlice";
import { tablaPedidos } from "../../store/Pedidos/thunks";
import Pagination from "../../components/pagination";
import {
  fetchRoles,
  toggleUserStatus,
  assignUserRoutes,
} from "../../store/usuarios/thunks";
import { fetchUsuarios } from "../../store/usuarios/usuariosSlice";
import { tablaTienda } from "../../store/Tienda/thunks";
import { tablaRuta } from "../../store/Ruta/thunks";

export const TablaBusuarios = () => {
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
  const { items: usuarios, status } = useSelector((state) => state.usuarios);
  const tiendas = useSelector((state) => state.tiendas.tiendas);
  const rutasData = useSelector((state) => state.rutas.data);

  useEffect(() => {
    const usuarioId = localStorage.getItem("usuarioId");
    dispatch(fetchUsuarios({ id: usuarioId }));
    dispatch(tablaTienda());
    dispatch(tablaRuta());

    const getRoles = async () => {
      try {
        const resultAction = await dispatch(fetchRoles());
        if (fetchRoles.fulfilled.match(resultAction)) {
          setAllRoles(resultAction.payload);
        }
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };
    getRoles();
  }, [dispatch]);

  useEffect(() => {
    if (rutasData) {
      setRutasLocal(rutasData);
    }
  }, [rutasData]);

  const usuariosFiltrados = (Array.isArray(usuarios) ? usuarios : [])
    .filter((u) => {
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
    })
    .sort((a, b) => {
      const nombreA = (a.nombre ?? "").toLowerCase();
      const nombreB = (b.nombre ?? "").toLowerCase();
      return nombreA.localeCompare(nombreB);
    });

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const usuariosPagina = usuariosFiltrados.slice(indexOfFirst, indexOfLast);

  const toggleUsuarioEstado = async (usuarioId, estaActivo) => {
    try {
      const resultAction = await dispatch(
        toggleUserStatus({ usuarioId, estaActivo })
      );

      if (toggleUserStatus.fulfilled.match(resultAction)) {
        toast({
          title: `Usuario ${
            !estaActivo ? "activado" : "desactivado"
          } correctamente`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        dispatch(fetchUsuarios({ id: localStorage.getItem("usuarioId") }));
      } else {
        toast({
          title: "Error al actualizar el estado",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
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
      const resultAction = await dispatch(
        assignUserRoutes({ usuarioId, selectedRoutes })
      );

      if (assignUserRoutes.fulfilled.match(resultAction)) {
        toast({
          title: "Rutas asignadas correctamente",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        dispatch(fetchUsuarios({ id: localStorage.getItem("usuarioId") }));
        onClose();
      } else {
        toast({
          title: "Error al asignar rutas",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
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
        {status === "loading" ? (
          <Box textAlign="center" py={10}>
            <Spinner
              size="xl"
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="green.500"
            />
            <Text mt={4} fontWeight="medium" color={headingColor}>
              Cargando usuarios...
            </Text>
          </Box>
        ) : (
          <>
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
                          <RolSelector
                            usuarioId={usuario.id}
                            currentRoleId={usuario.roleId}
                            roles={allRoles}
                          />
                        ) : (
                          <Text>{rolUsuario?.nombre || "Sin rol"}</Text>
                        )}
                      </Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>

            <Pagination
              currentPage={currentPage}
              totalItems={usuariosFiltrados.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </Box>

      {selectedUser && (
        <AsignarRutasModal
          key={selectedUser.id}
          isOpen={isOpen}
          onClose={onClose}
          usuario={selectedUser}
          rutas={rutas}
          onAssign={handleAssignRutas}
          isLoading={isAssigning}
        />
      )}
    </>
  );
};
