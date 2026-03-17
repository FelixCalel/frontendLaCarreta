import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Input,
  Button,
  Stack,
  Text,
  Box,
  Flex,
  Heading,
  IconButton,
  Switch,
  useColorModeValue,
  Spinner,
} from "@chakra-ui/react";
import { FiUserPlus, FiSearch } from "react-icons/fi";
import RolSelector from "./componentes/RolSelector";
import AsignarRutasModal from "./componentes/AsignarRutasModal";
import Pagination from "../../components/pagination";
import { useUsuariosTable } from "./hooks/useUsuariosTable";

export const TablaBusuarios = () => {
  const {
    searchTerm,
    setSearchTerm,
    isOpen,
    onOpen,
    onClose,
    allRoles,
    rutasLocal: rutas,
    currentPage,
    setCurrentPage,
    isAssigning,
    status,
    usuariosPagina,
    roleIdLogueado,
    toggleUsuarioEstado,
    handleAssignRutas,
    setSelectedUser,
    selectedUser,
    usuariosFiltrados,
    itemsPerPage,
  } = useUsuariosTable();

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
                  const rolesDisponibles = Array.isArray(allRoles)
                    ? allRoles
                    : [];
                  const rolUsuario = rolesDisponibles.find(
                    (rol) => rol.id === usuario.roleId,
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
                            roles={rolesDisponibles}
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
