import { useEffect, useReducer, useRef } from "react";
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
import { fetchModulos } from "../../store/RolPermisoUsuario/thunks";
import iconCatalog from "./../Iconos/IconCatalog";

export const Permisos = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const { uid } = useSelector((state) => state.auth);
  const { modulosTabla = [] } = useSelector((state) => state.modulos);
  const { Permisos = [] } = useSelector((state) => state.Permisos);
  const { roles = [] } = useSelector((state) => state.roles);
  const { opciones = [] } = useSelector((state) => state.opciones);
  const { asignacionMO = [] } = useSelector((state) => state.PermisosRoles);
  const [state, setState] = useReducer(
    (prevState, action) =>
      typeof action === "function"
        ? action(prevState)
        : { ...prevState, ...action },
    {
      permisosRoles: [],
      selectedModulo: null,
      selectedOpcion: null,
      accessMatrix: {},
      hasChanges: false,
      isSaving: false,
      isDialogOpen: false,
    },
  );

  const {
    permisosRoles,
    selectedModulo,
    selectedOpcion,
    accessMatrix,
    hasChanges,
    isSaving,
    isDialogOpen,
  } = state;

  const dialogRef = useRef();

  const bgColor = useColorModeValue("#f9f9f9", "#1A202C");
  const optionBgColor = useColorModeValue("white", "#2D3748");
  const optionTextColor = useColorModeValue("black", "white");
  const tableHeaderBg = useColorModeValue("#e5e5e5", "#1A202C");
  const tableRowBg = useColorModeValue("#ffffff", "#2D3748");
  const tableRowBgAlt = useColorModeValue("#f7f7f7", "#3E4A5A");
  const tableBgColor = useColorModeValue("#ffffff", "#2D3748");
  const textColor = useColorModeValue("#1c1c1e", "#f1f1f1");

  const selectBg = useColorModeValue("white", "gray.700");
  const selectBorderBg = useColorModeValue("#673ab7", "gray.600");
  const optBg = useColorModeValue("white", "#2D3748");
  const optColor = useColorModeValue("black", "white");

  useEffect(() => {
    dispatch(fetchModulosTabla());
    dispatch(fetchPermisos());
    dispatch(fetchrole());
    dispatch(fetchOpciones());
    dispatch(fetchAsignacionMO());
  }, [dispatch]);

  useEffect(() => {
    if (selectedModulo && selectedOpcion) {
      dispatch(fetchPermisosRoles({ selectedModulo, selectedOpcion }))
        .then((response) => {
          const permisosRolesData = response.payload || [];
          setState({ permisosRoles: permisosRolesData });

          const matrix = {};
          roles.forEach((role) => {
            matrix[role.id] = { nombre: role.nombre, permisos: {} };
            Permisos.forEach((permiso) => {
              const isAssigned = permisosRolesData.some(
                (pr) =>
                  pr.role_id === role.id &&
                  parseInt(pr.modulo_id) === parseInt(selectedModulo) &&
                  parseInt(pr.opcion_id) === parseInt(selectedOpcion) &&
                  parseInt(pr.permiso_id) === parseInt(permiso.id),
              );
              matrix[role.id].permisos[permiso.nombre] = {
                isAssigned: isAssigned,
                id: isAssigned
                  ? permisosRolesData.find(
                      (pr) =>
                        pr.permiso_id === permiso.id && pr.role_id === role.id,
                    )?.id
                  : null,
              };
            });
          });
          setState({ accessMatrix: matrix });
        })
        .catch((error) =>
          console.error("Error al obtener permisosRoles:", error),
        );
    }
  }, [selectedModulo, selectedOpcion, dispatch, Permisos, roles]);

  const handleAccessChange = (permisoNombre, roleId) => {
    setState((prevState) => {
      const prevMatrix = prevState.accessMatrix;
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
              isAssigned: !currentAssignedState,
            },
          },
        },
      };
      return { ...prevState, accessMatrix: updatedMatrix, hasChanges: true };
    });
  };

  const handleSaveChanges = async () => {
    setState({ isSaving: true });
    try {
      console.log("Iniciando la operación de guardado...");

      const createPayload = [];
      const deletePayload = [];
      const permisosCreados = [];
      const permisosEliminados = [];

      Object.keys(accessMatrix).forEach((roleId) => {
        const role = accessMatrix[roleId];
        Permisos.forEach((permiso) => {
          const permisoState = role.permisos[permiso.nombre];

          console.log(
            `Revisando permiso: ${permiso.nombre} para el rol: ${roleId}`,
          );
          console.log("Estado del permiso:", permisoState.isAssigned);

          if (permisoState.isAssigned && !permisoState.id) {
            createPayload.push({
              role_id: parseInt(roleId),
              modulo_id: parseInt(selectedModulo),
              opcion_id: parseInt(selectedOpcion),
              permiso_id: parseInt(permiso.id),
              created_by: 1,
              updated_by: 1,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            });
            permisosCreados.push(permiso.nombre);
          } else if (!permisoState.isAssigned && permisoState.id) {
            const permisoExistente = permisosRoles.find(
              (pr) =>
                pr.role_id === parseInt(roleId) &&
                pr.modulo_id === parseInt(selectedModulo) &&
                pr.opcion_id === parseInt(selectedOpcion) &&
                pr.permiso_id === parseInt(permiso.id),
            );

            if (permisoExistente) {
              console.log(`Eliminar permiso con id: ${permisoExistente.id}`);
              deletePayload.push(permisoExistente.id);
              permisosEliminados.push(permiso.nombre);
            }
          }
        });
      });

      console.log("Permisos a crear:", createPayload);
      console.log("Permisos a eliminar:", permisosEliminados);

      if (createPayload.length === 0 && deletePayload.length === 0) {
        throw new Error("No hay cambios para guardar.");
      }

      if (deletePayload.length > 0) {
        await Promise.all(
          deletePayload.map((id) =>
            dispatch(deleteasignacionPermisosRoles(id)).unwrap(),
          ),
        );
        console.log("Permisos eliminados exitosamente:", permisosEliminados);
      }

      if (createPayload.length > 0) {
        await dispatch(
          createasignacionPermisosRoles({
            accessMatrix: createPayload,
            selectedModulo,
            selectedOpcion,
            Permisos,
          }),
        ).unwrap();
        console.log("Permisos creados exitosamente:", permisosCreados);
      }

      if (uid) {
        console.log("Dispatching fetchModulos for uid:", uid);
        dispatch(fetchModulos(uid))
          .then((res) => console.log("fetchModulos result:", res))
          .catch((err) => console.error("fetchModulos error:", err));
      } else {
        console.warn("UID is missing, cannot refresh modules dynamically.");
      }

      setState({ isDialogOpen: true, hasChanges: false });
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
      setState({ isSaving: false });
    }
  };

  const getArray = (data) => {
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.data)) return data.data;
    return [];
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
            onChange={(e) => setState({ selectedModulo: e.target.value })}
            bg={selectBg}
            borderColor={selectBorderBg}
            color={textColor}
            borderRadius="md"
            w="450px"
            _hover={{ borderColor: "#512da8" }}
            _focus={{ borderColor: "#311b92", boxShadow: "0 0 5px #673ab7" }}
          >
            {getArray(modulosTabla)
              .slice()
              .sort((a, b) => a.nombre.localeCompare(b.nombre))
              .map((modulo) => {
                const IconComponent = iconCatalog[modulo.icono];

                return (
                  <option
                    key={modulo.id}
                    value={modulo.id}
                    style={{
                      backgroundColor: optBg,
                      color: optColor,
                    }}
                  >
                    {modulo.nombre}
                  </option>
                );
              })}
          </Select>
        </Flex>

        <Flex align="center" justify="center" w="50%">
          <Text fontWeight="bold" color={textColor} mr={2}>
            Opción:
          </Text>
          <Select
            placeholder="Selecciona una opción"
            value={selectedOpcion || ""}
            onChange={(e) => setState({ selectedOpcion: e.target.value })}
            bg={selectBg}
            border="1px solid"
            borderColor={selectBorderBg}
            color={textColor}
            borderRadius="md"
            w="450px"
            fontWeight="bold"
            transition="all 0.2s ease-in-out"
            _hover={{ borderColor: "#512da8" }}
            _focus={{ borderColor: "#311b92", boxShadow: "0 0 5px #673ab7" }}
            isDisabled={!selectedModulo}
          >
            {getArray(opciones)
              .filter((opcion) =>
                getArray(asignacionMO).some(
                  (a) =>
                    Number(a.modulo_id) === Number(selectedModulo) &&
                    Number(a.opcion_id) === Number(opcion.id),
                ),
              )
              .sort((a, b) => a.nombre.localeCompare(b.nombre))
              .map((opcion) => {
                const IconComponent = iconCatalog[opcion.icono];

                return (
                  <option
                    key={opcion.id}
                    value={opcion.id}
                    style={{
                      backgroundColor: optionBgColor,
                      color: optionTextColor,
                    }}
                  >
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
          borderColor={selectBorderBg}
        >
          <Table variant="simple" borderRadius="md" bg={tableBgColor}>
            <Thead bg={tableHeaderBg}>
              <Tr>
                <Th color={textColor}>Roles</Th>
                {Permisos.slice()
                  .sort((a, b) => a.nombre.localeCompare(b.nombre))
                  .map((permiso) => (
                    <Th key={permiso.id} color={textColor}>
                      {permiso.nombre}
                    </Th>
                  ))}
              </Tr>
            </Thead>
            <Tbody>
              {roles
                .slice()
                .sort((a, b) => a.nombre.localeCompare(b.nombre))
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

      <AlertDialog
        isOpen={isDialogOpen}
        leastDestructiveRef={dialogRef}
        onClose={() => setState({ isDialogOpen: false })}
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
                  setState({ isDialogOpen: false });
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
