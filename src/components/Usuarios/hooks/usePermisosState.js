import { useReducer, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useToast, useColorModeValue } from "@chakra-ui/react";
import { fetchModulosTabla, fetchModulos } from "../../../store/Modulos/thunks";
import { fetchPermisos } from "../../../store/Permisos/thunks";
import { fetchrole } from "../../../store/PaginaRole/thunks";
import { fetchOpciones } from "../../../store/Opciones/thunks";
import {
  fetchPermisosRoles,
  fetchAsignacionMO,
  createasignacionPermisosRoles,
  deleteasignacionPermisosRoles,
} from "../../../store/AsignarPermisosAroles/thunks";

export const usePermisosState = () => {
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
    selectedModulo,
    selectedOpcion,
    accessMatrix,
    hasChanges,
    isSaving,
    isDialogOpen,
  } = state;

  const dialogRef = useRef();

  const normalizarAsignaciones = (items) => {
    if (!Array.isArray(items)) return [];

    const seen = new Map();
    items.forEach((item) => {
      const key = [
        Number(item.role_id),
        Number(item.modulo_id),
        Number(item.opcion_id),
        Number(item.permiso_id),
      ].join("-");

      if (!seen.has(key)) {
        seen.set(key, item);
      }
    });

    return Array.from(seen.values());
  };

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
          const permisosRolesData = normalizarAsignaciones(response.payload || []);
          setState({ permisosRoles: permisosRolesData });

          const matrix = {};
          roles.forEach((role) => {
            matrix[role.id] = { nombre: role.nombre, permisos: {} };
            permisosList.forEach((permiso) => {
              const isAssigned = permisosRolesData.some(
                (pr) =>
                  Number(pr.role_id) === Number(role.id) &&
                  Number.parseInt(pr.modulo_id) === Number.parseInt(selectedModulo) &&
                  Number.parseInt(pr.opcion_id) === Number.parseInt(selectedOpcion) &&
                  Number.parseInt(pr.permiso_id) === Number.parseInt(permiso.id),
              );
              matrix[role.id].permisos[permiso.nombre] = {
                isAssigned,
                id: isAssigned
                  ? permisosRolesData.find(
                    (pr) =>
                      Number(pr.permiso_id) === Number(permiso.id) &&
                      Number(pr.role_id) === Number(role.id) &&
                      Number(pr.modulo_id) === Number(selectedModulo) &&
                      Number(pr.opcion_id) === Number(selectedOpcion),
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
      const rawAsignaciones = await dispatch(
        fetchPermisosRoles({ selectedModulo, selectedOpcion }),
      ).unwrap();
      const asignacionesActuales = Array.isArray(rawAsignaciones)
        ? rawAsignaciones
        : [];

      const createPayload = [];
      const deletePayload = [];
      const deleteSet = new Set();
      const createSet = new Set();

      Object.keys(accessMatrix).forEach((roleId) => {
        const role = accessMatrix[roleId];
        permisosList.forEach((permiso) => {
          const permisoState = role.permisos[permiso.nombre];

          const roleIdNum = Number.parseInt(roleId);
          const moduloIdNum = Number.parseInt(selectedModulo);
          const opcionIdNum = Number.parseInt(selectedOpcion);
          const permisoIdNum = Number.parseInt(permiso.id);

          const matchingPermisos = asignacionesActuales.filter(
            (pr) =>
              Number(pr.role_id) === roleIdNum &&
              Number(pr.modulo_id) === moduloIdNum &&
              Number(pr.opcion_id) === opcionIdNum &&
              Number(pr.permiso_id) === permisoIdNum,
          );

          if (permisoState.isAssigned) {
            if (matchingPermisos.length === 0) {
              const createKey = `${roleIdNum}-${moduloIdNum}-${opcionIdNum}-${permisoIdNum}`;
              if (!createSet.has(createKey)) {
                createSet.add(createKey);
                createPayload.push({
                  role_id: roleIdNum,
                  modulo_id: moduloIdNum,
                  opcion_id: opcionIdNum,
                  permiso_id: permisoIdNum,
                  created_by: 1,
                  updated_by: 1,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                });
              }
            } else if (matchingPermisos.length > 1) {
              matchingPermisos.slice(1).forEach((permisoDuplicado) => {
                if (
                  permisoDuplicado?.id != null &&
                  !deleteSet.has(permisoDuplicado.id)
                ) {
                  deleteSet.add(permisoDuplicado.id);
                  deletePayload.push(permisoDuplicado.id);
                }
              });
            }
          } else {
            matchingPermisos.forEach((permisoExistente) => {
              if (
                permisoExistente?.id != null &&
                !deleteSet.has(permisoExistente.id)
              ) {
                deleteSet.add(permisoExistente.id);
                deletePayload.push(permisoExistente.id);
              }
            });
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

      if (selectedModulo && selectedOpcion) {
        const refreshed = await dispatch(
          fetchPermisosRoles({ selectedModulo, selectedOpcion }),
        ).unwrap();
        setState({
          permisosRoles: normalizarAsignaciones(refreshed),
        });
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
    } finally {
      setState({ isSaving: false });
    }
  };

  return {
    modulosTabla,
    permisosList,
    roles,
    opciones,
    asignacionMO,
    selectedModulo,
    selectedOpcion,
    accessMatrix,
    hasChanges,
    isSaving,
    isDialogOpen,
    setState,
    handleAccessChange,
    handleSaveChanges,
    dialogRef,
    bgColor,
    optionBgColor,
    optionTextColor,
    tableHeaderBg,
    tableRowBg,
    tableRowBgAlt,
    tableBgColor,
    textColor,
    selectBg,
    selectBorderBg,
    optBg,
    optColor,
  };
};
