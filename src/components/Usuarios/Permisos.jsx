import { PermisosHeader } from "./PermisosComps/PermisosHeader";
import { PermisosMatrix } from "./PermisosComps/PermisosMatrix";
import { PermisosSuccessDialog } from "./PermisosComps/PermisosSuccessDialog";

export const Permisos = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const { uid } = useSelector((state) => state.auth);
  const { modulosTabla = [] } = useSelector((state) => state.modulos);
  const { Permisos: permisosList = [] } = useSelector((state) => state.Permisos);
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

  // Color tokens
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
            permisosList.forEach((permiso) => {
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
  }, [selectedModulo, selectedOpcion, dispatch, permisosList, roles]);

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
      const createPayload = [];
      const deletePayload = [];

      Object.keys(accessMatrix).forEach((roleId) => {
        const role = accessMatrix[roleId];
        permisosList.forEach((permiso) => {
          const permisoState = role.permisos[permiso.nombre];

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
          } else if (!permisoState.isAssigned && permisoState.id) {
            const permisoExistente = permisosRoles.find(
              (pr) =>
                pr.role_id === parseInt(roleId) &&
                pr.modulo_id === parseInt(selectedModulo) &&
                pr.opcion_id === parseInt(selectedOpcion) &&
                pr.permiso_id === parseInt(permiso.id),
            );

            if (permisoExistente) {
              deletePayload.push(permisoExistente.id);
            }
          }
        });
      });

      if (createPayload.length === 0 && deletePayload.length === 0) {
        throw new Error("No hay cambios para guardar.");
      }

      if (deletePayload.length > 0) {
        await Promise.all(
          deletePayload.map((id) =>
            dispatch(deleteasignacionPermisosRoles(id)).unwrap(),
          ),
        );
      }

      if (createPayload.length > 0) {
        await dispatch(
          createasignacionPermisosRoles({
            accessMatrix: createPayload,
            selectedModulo,
            selectedOpcion,
            Permisos: permisosList,
          }),
        ).unwrap();
      }

      if (uid) dispatch(fetchModulos(uid));

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
    } finally {
      setState({ isSaving: false });
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

      <PermisosHeader
        modulosTabla={modulosTabla}
        selectedModulo={selectedModulo}
        onModuloChange={(val) => setState({ selectedModulo: val, selectedOpcion: null, accessMatrix: {} })}
        selectedOpcion={selectedOpcion}
        onOpcionChange={(val) => setState({ selectedOpcion: val })}
        opciones={opciones}
        asignacionMO={asignacionMO}
        textColor={textColor}
        selectBg={selectBg}
        selectBorderBg={selectBorderBg}
        optBg={optBg}
        optColor={optColor}
        optionBgColor={optionBgColor}
        optionTextColor={optionTextColor}
      />

      {selectedOpcion && (
        <PermisosMatrix
          Permisos={permisosList}
          roles={roles}
          accessMatrix={accessMatrix}
          onAccessChange={handleAccessChange}
          textColor={textColor}
          tableBgColor={tableBgColor}
          tableHeaderBg={tableHeaderBg}
          tableRowBg={tableRowBg}
          tableRowBgAlt={tableRowBgAlt}
          selectBorderBg={selectBorderBg}
        />
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

      <PermisosSuccessDialog
        isOpen={isDialogOpen}
        onClose={() => setState({ isDialogOpen: false })}
        dialogRef={dialogRef}
      />
    </VStack>
  );
};
