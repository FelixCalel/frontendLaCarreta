import { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Heading,
  VStack,
  HStack,
  Button,
  useToast,
  useColorModeValue,
  Select,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Switch,
  Text,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Icon,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { fetchModulosTabla } from "../../store/Modulos/thunks";
import { fetchPermisos } from "../../store/Permisos/thunks";
import {
  fetchPermisosRoles,
  createasignacionPermisosRoles,
  deleteasignacionPermisosRoles,
  fetchAsignacionMO,
} from "../../store/AsignarPermisosAroles/thunks";
import { fetchrole } from "../../store/PaginaRole/thunks";
import { fetchOpciones } from "../../store/Opciones/thunks";
import iconCatalog from "./../Iconos/IconCatalog";

export const Permisos = () => {
  const dispatch = useDispatch();
  const toast = useToast();

  const { modulosTabla = [] } = useSelector((state) => state.modulos);
  const { Permisos = [] } = useSelector((state) => state.Permisos);
  const { roles = [] } = useSelector((state) => state.roles);
  const { opciones = [] } = useSelector((state) => state.opciones);
  const { asignacionMO = [] } = useSelector((state) => state.PermisosRoles);
  // Estado local para almacenar los permisosRoles que obtenemos
  const [permisosRoles, setPermisosRoles] = useState([]);

  const [selectedModulo, setSelectedModulo] = useState(null);
  const [selectedOpcion, setSelectedOpcion] = useState(null);
  const [accessMatrix, setAccessMatrix] = useState({});
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogRef] = useState();

  const bgColor = useColorModeValue("#f9f9f9", "#1A202C");
  const tableHeaderBg = useColorModeValue("#e5e5e5", "#1A202C");
  const tableRowBg = useColorModeValue("#ffffff", "#2D3748");
  const tableRowBgAlt = useColorModeValue("#f7f7f7", "#3E4A5A");
  const tableBgColor = useColorModeValue("#ffffff", "#2D3748");
  const textColor = useColorModeValue("#1c1c1e", "#f1f1f1");

  // Cargar datos iniciales
  useEffect(() => {
    dispatch(fetchModulosTabla());
    dispatch(fetchPermisos());
    dispatch(fetchrole());
    dispatch(fetchOpciones());
    dispatch(fetchAsignacionMO());
  }, [dispatch]);

  // Manejo de permisos basados en el módulo y la opción seleccionados
  useEffect(() => {
    if (selectedModulo && selectedOpcion) {
      dispatch(fetchPermisosRoles({ selectedModulo, selectedOpcion }))
        .then((response) => {
          const permisosRolesData = response.payload || [];
          setPermisosRoles(permisosRolesData); // Aquí almacenamos los permisosRoles obtenidos

          const matrix = {};
          roles.forEach((role) => {
            matrix[role.id] = { nombre: role.nombre, permisos: {} };
            Permisos.forEach((permiso) => {
              const isAssigned = permisosRolesData.some(
                (pr) =>
                  pr.role_id === role.id &&
                  parseInt(pr.modulo_id) === parseInt(selectedModulo) &&
                  parseInt(pr.opcion_id) === parseInt(selectedOpcion) &&
                  parseInt(pr.permiso_id) === parseInt(permiso.id)
              );
              matrix[role.id].permisos[permiso.nombre] = {
                isAssigned: isAssigned,
                id: isAssigned
                  ? permisosRolesData.find(
                      (pr) =>
                        pr.permiso_id === permiso.id && pr.role_id === role.id
                    )?.id
                  : null,
              };
            });
          });
          setAccessMatrix(matrix);
        })
        .catch((error) =>
          console.error("Error al obtener permisosRoles:", error)
        );
    }
  }, [selectedModulo, selectedOpcion, dispatch, Permisos, roles]);

  const handleAccessChange = (permisoNombre, roleId) => {
    setAccessMatrix((prevMatrix) => {
      const currentAssignedState =
        prevMatrix[roleId]?.permisos?.[permisoNombre]?.isAssigned || false;
      const updatedMatrix = {
        ...prevMatrix,
        [roleId]: {
          ...prevMatrix[roleId],
          permisos: {
            ...prevMatrix[roleId].permisos,
            [permisoNombre]: {
              ...prevMatrix[roleId].permisos[permisoNombre],
              isAssigned: !currentAssignedState, // Alterna el estado aquí
            },
          },
        },
      };
      return updatedMatrix;
    });
    setHasChanges(true); // Esto asegura que los cambios se marquen
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      console.log("Iniciando la operación de guardado...");

      const createPayload = [];
      const deletePayload = [];
      const permisosCreados = [];
      const permisosEliminados = [];

      // Recorrer la matriz de acceso para verificar cambios
      Object.keys(accessMatrix).forEach((roleId) => {
        const role = accessMatrix[roleId];
        Permisos.forEach((permiso) => {
          const permisoState = role.permisos[permiso.nombre];

          console.log(
            `Revisando permiso: ${permiso.nombre} para el rol: ${roleId}`
          );
          console.log("Estado del permiso:", permisoState.isAssigned);

          if (permisoState.isAssigned && !permisoState.id) {
            // Crear asignaciones nuevas si el permiso está activado y no existe en la DB
            createPayload.push({
              role_id: parseInt(roleId),
              modulo_id: parseInt(selectedModulo),
              opcion_id: parseInt(selectedOpcion),
              permiso_id: parseInt(permiso.id),
              created_by: 1, // Asume un ID de usuario de prueba
              updated_by: 1, // Asume un ID de usuario de prueba
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            });
            permisosCreados.push(permiso.nombre); // Log de permisos creados
          } else if (!permisoState.isAssigned && permisoState.id) {
            // Si el permiso fue desactivado y tiene ID, agregar a eliminación
            const permisoExistente = permisosRoles.find(
              (pr) =>
                pr.role_id === parseInt(roleId) &&
                pr.modulo_id === parseInt(selectedModulo) &&
                pr.opcion_id === parseInt(selectedOpcion) &&
                pr.permiso_id === parseInt(permiso.id)
            );

            // Si se encuentra el permiso exacto, agregar a la lista de eliminación
            if (permisoExistente) {
              console.log(`Eliminar permiso con id: ${permisoExistente.id}`);
              deletePayload.push(permisoExistente.id); // Agregar a la lista de eliminaciones
              permisosEliminados.push(permiso.nombre); // Log de permisos eliminados
            }
          }
        });
      });

      // Mostrar logs en la consola para ver qué se ha hecho
      console.log("Permisos a crear:", createPayload);
      console.log("Permisos a eliminar:", permisosEliminados);

      // Validación extra para asegurar que hay cambios para guardar
      if (createPayload.length === 0 && deletePayload.length === 0) {
        throw new Error("No hay cambios para guardar.");
      }

      // Ejecutar eliminaciones primero
      if (deletePayload.length > 0) {
        await Promise.all(
          deletePayload.map((id) =>
            dispatch(deleteasignacionPermisosRoles(id)).unwrap()
          )
        );
        console.log("Permisos eliminados exitosamente:", permisosEliminados);
      }

      // Si hay asignaciones nuevas, hacer la petición de creación
      if (createPayload.length > 0) {
        await dispatch(
          createasignacionPermisosRoles({
            accessMatrix: createPayload,
            selectedModulo,
            selectedOpcion,
            Permisos,
          })
        ).unwrap();
        console.log("Permisos creados exitosamente:", permisosCreados);
      }

      // Abre el diálogo después de guardar exitosamente
      setIsDialogOpen(true);
    } catch (error) {
      toast({
        title: "Error al guardar permisos.",
        description:
          error.message || "Hubo un problema al guardar los permisos.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      console.error("Error al guardar permisos:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <VStack
      spacing={2}
      align="stretch"
      p={0}
      bg={bgColor}
      borderRadius="lg"
      boxShadow="lg"
    >
      <Heading
        size="lg"
        color={textColor}
        textAlign="center"
        mb={6}
        fontWeight="bold"
        letterSpacing="wide"
      >
        Gestión de Permisos
      </Heading>

      <HStack spacing={8} align="center" justify="center" w="100%" mb={6}>
        <Flex align="center" justify="center" w="50%">
          <Text fontWeight="bold" color={textColor} mr={2}>
            Módulo:
          </Text>
          <Select
            placeholder="Selecciona un módulo"
            onChange={(e) => setSelectedModulo(e.target.value)}
            bg="white"
            borderColor="#673ab7"
            color={textColor}
            borderRadius="md"
            w="450px"
          >
            {modulosTabla
              .slice()
              .sort((a, b) => a.nombre.localeCompare(b.nombre))
              .map((modulo) => {
                const IconComponent = iconCatalog[modulo.icono]; // Obtiene el icono del módulo

                return (
                  <option key={modulo.id} value={modulo.id}>
                    {IconComponent && <Icon as={IconComponent} mr={2} />}
                    {modulo.nombre}
                  </option>
                );
              })}
          </Select>
        </Flex>

        <Flex align="center" justify="center" w="50%">
          <Select
            placeholder="Selecciona una opción"
            value={selectedOpcion || ""}
            onChange={(e) => setSelectedOpcion(e.target.value)}
            bg="white"
            border="1px solid"
            borderColor="#673ab7"
            color={textColor}
            borderRadius="md"
            w="450px"
            fontWeight="bold"
            transition="all 0.2s ease-in-out"
            _hover={{ borderColor: "#512da8" }}
            _focus={{ borderColor: "#311b92", boxShadow: "0 0 5px #673ab7" }}
            isDisabled={!selectedModulo}
          >
            {opciones
              .filter((opcion) =>
                asignacionMO.some(
                  (a) =>
                    Number(a.modulo_id) === Number(selectedModulo) &&
                    Number(a.opcion_id) === Number(opcion.id)
                )
              )
              .sort((a, b) => a.nombre.localeCompare(b.nombre))
              .map((opcion) => {
                const IconComponent = iconCatalog[opcion.icono]; // Obtiene el icono de la opción

                return (
                  <option key={opcion.id} value={opcion.id}>
                    {IconComponent && <Icon as={IconComponent} mr={2} />}
                    {opcion.nombre}
                  </option>
                );
              })}
          </Select>
        </Flex>
      </HStack>

      {selectedOpcion && (
        <Box
          overflowX="auto"
          borderRadius="lg"
          boxShadow="lg"
          border="0.5px solid"
          borderColor="#673ab7"
        >
          <Table variant="simple" borderRadius="md" bg={tableBgColor}>
            <Thead bg={tableHeaderBg}>
              <Tr>
                <Th color={textColor}>Roles</Th>
                {Permisos.slice() // Copiar el array para prevenir mutaciones
                  .sort((a, b) => a.nombre.localeCompare(b.nombre)) // Orden superficial de los permisos
                  .map((permiso) => (
                    <Th key={permiso.id} color={textColor}>
                      {permiso.nombre}
                    </Th>
                  ))}
              </Tr>
            </Thead>
            <Tbody>
              {roles
                .slice() // Copiar el array para prevenir mutaciones
                .sort((a, b) => a.nombre.localeCompare(b.nombre)) // Orden superficial de los roles
                .map((role, index) => (
                  <Tr
                    key={role.id}
                    bg={index % 2 === 0 ? tableRowBg : tableRowBgAlt}
                  >
                    <Td color={textColor}>{role.nombre}</Td>
                    {Permisos.map((permiso) => (
                      <Td key={permiso.id}>
                        <Switch
                          isChecked={
                            accessMatrix[role.id]?.permisos?.[permiso.nombre]
                              ?.isAssigned || false
                          }
                          onChange={() =>
                            handleAccessChange(permiso.nombre, role.id)
                          }
                          colorScheme="green"
                        />
                      </Td>
                    ))}
                  </Tr>
                ))}
            </Tbody>
          </Table>
        </Box>
      )}

      {hasChanges && (
        <Button
          colorScheme="green"
          onClick={handleSaveChanges}
          isLoading={isSaving}
          loadingText="Guardando"
          size="lg"
          borderRadius="12px"
          mt={4}
          boxShadow="lg"
          bgGradient="linear(to-r, green.400, green.500)"
          color="white"
          fontWeight="bold"
        >
          Guardar Cambios
        </Button>
      )}

      {/* Dialogo para confirmar y recargar */}
      <AlertDialog
        isOpen={isDialogOpen}
        leastDestructiveRef={dialogRef}
        onClose={() => setIsDialogOpen(false)}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Cambios guardados
            </AlertDialogHeader>

            <AlertDialogBody>
              Los permisos se han guardado exitosamente.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button
                colorScheme="green"
                onClick={() => {
                  window.location.reload();
                }}
                ml={3}
              >
                Aceptar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </VStack>
  );
};
