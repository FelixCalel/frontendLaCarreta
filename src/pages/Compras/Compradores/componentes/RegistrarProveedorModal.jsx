import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  useToast,
  Flex,
  Divider,
  SimpleGrid,
  Box,
  Stack,
} from "@chakra-ui/react";
import PropTypes from "prop-types";
import { useReducer, useEffect } from "react";
import { useDispatch } from "react-redux";
import HeaderInfo from "./registrarProveedorComponents/HeaderInfo";
import ConfigurationGrid from "./registrarProveedorComponents/ConfigurationGrid";
import CurrentAssignments from "./registrarProveedorComponents/CurrentAssignments";
import {
  asignarProveedor,
  desasignarProveedor,
  fetchCompras,
  actualizarFechaIngreso,
} from "../../../../store/Compras/thunks";

const initialState = {
  selectedProveedorName: "",
  proveedoresAsignados: [],
  selectedProveedorId: null,
  cantidadFaltante: 0,
  cantidadPactada: 0,
  fechaIngreso: "",
  initialFechaIngreso: "",
  assigning: false,
};

function modalReducer(state, action) {
  switch (action.type) {
    case "INIT_ITEM":
      return {
        ...state,
        cantidadFaltante: action.payload.faltante,
        fechaIngreso: action.payload.isoDate,
        initialFechaIngreso: action.payload.isoDate,
        proveedoresAsignados: action.payload.proveedores,
        selectedProveedorName: "",
        selectedProveedorId: null,
        cantidadPactada: 0,
        assigning: false,
      };
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "SET_PROVIDER":
      return {
        ...state,
        selectedProveedorId: action.payload.id,
        selectedProveedorName: action.payload.name,
      };
    case "ADD_PROVIDER": {
      const { id, name, cantidad } = action.payload;
      const prev = state.proveedoresAsignados;
      const existingIndex = prev.findIndex((p) => p.proveedorId === id);
      let newProveedores;
      if (existingIndex !== -1) {
        newProveedores = [...prev];
        newProveedores[existingIndex] = {
           ...newProveedores[existingIndex],
           cantidad: newProveedores[existingIndex].cantidad + cantidad
        };
      } else {
        newProveedores = [...prev, { proveedorId: id, nombre: name, cantidad }];
      }
      return {
        ...state,
        proveedoresAsignados: newProveedores,
        cantidadFaltante: state.cantidadFaltante - cantidad,
        cantidadPactada: 0,
        selectedProveedorId: null,
        selectedProveedorName: "",
      };
    }
    case "REMOVE_PROVIDER": {
      const id = action.payload;
      const eliminado = state.proveedoresAsignados.find((p) => p.proveedorId === id);
      const cantidadEliminada = eliminado?.cantidad || 0;
      return {
        ...state,
        proveedoresAsignados: state.proveedoresAsignados.filter((p) => p.proveedorId !== id),
        cantidadFaltante: state.cantidadFaltante + cantidadEliminada,
      };
    }
    case "RESET":
      return {
        ...state,
        cantidadPactada: 0,
        selectedProveedorId: null,
      };
    default:
      return state;
  }
}

const RegistrarProveedorModal = ({ isOpen, onClose, item }) => {
  const [state, dispatchAction] = useReducer(modalReducer, initialState);
  const dispatch = useDispatch();
  const toast = useToast();

  useEffect(() => {
    if (item && isOpen) {
      const totalAsignado =
        item.proveedoresAsignados?.reduce(
          (acc, prov) => acc + prov.cantidad,
          0,
        ) || 0;
      const faltante = Math.max(0, (item.cantidad || 0) - totalAsignado);
      
      let isoDate = new Date().toISOString().slice(0, 10);
      if (item.fechaIngreso) {
        const [dd, mm, yyyy] = item.fechaIngreso.split("/");
        if (dd && mm && yyyy) {
          isoDate = `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
        } else {
          isoDate = new Date(item.fechaIngreso).toISOString().slice(0, 10);
        }
      }

      dispatchAction({
        type: "INIT_ITEM",
        payload: {
          faltante,
          isoDate,
          proveedores: item.proveedoresAsignados || [],
        },
      });
    }
  }, [item, isOpen]);

  const showErrorToast = (description) => {
    toast({
      title: "Error",
      description,
      status: "error",
      duration: 3000,
      isClosable: true,
    });
  };

  const showSuccessToast = (description) => {
    toast({
      title: "Éxito",
      description,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  if (!item) return null;

  const handleGuardar = async () => {
    const hasDateChanged = state.fechaIngreso !== state.initialFechaIngreso;
    const hasProviderAssignment = state.selectedProveedorId && state.cantidadPactada > 0;

    if (!hasDateChanged && !hasProviderAssignment) {
      showErrorToast(
        "No se detectaron cambios (ni de fecha ni de nuevo proveedor).",
      );
      return;
    }

    if (hasProviderAssignment && state.cantidadPactada > state.cantidadFaltante) {
      showErrorToast("La cantidad pactada excede la cantidad faltante.");
      return;
    }

    dispatchAction({ type: "SET_FIELD", field: "assigning", value: true });

    let operationsSucceeded = 0;

    try {
      if (hasDateChanged) {
        const [yyyy, mm, dd] = state.fechaIngreso.split("-");
        const ddMmYyyy = `${dd}/${mm}/${yyyy}`;
        await dispatch(
          actualizarFechaIngreso({
            pedidoId: item.id,
            fechaIngreso: ddMmYyyy,
          }),
        ).unwrap();
        dispatchAction({ type: "SET_FIELD", field: "initialFechaIngreso", value: state.fechaIngreso });
        operationsSucceeded++;
      }

      if (hasProviderAssignment) {
        await dispatch(
          asignarProveedor({
            compraId: item.id,
            proveedorId: state.selectedProveedorId,
            cantidad: state.cantidadPactada,
          }),
        ).unwrap();

        dispatchAction({
          type: "ADD_PROVIDER",
          payload: {
            id: state.selectedProveedorId,
            name: state.selectedProveedorName,
            cantidad: state.cantidadPactada,
          },
        });
        operationsSucceeded++;
      }

      if (operationsSucceeded > 0) {
        showSuccessToast("Cambios guardados correctamente.");
        dispatch(fetchCompras());
        const roleId = parseInt(localStorage.getItem("roleId") || "0", 10);
        await dispatch(fetchCompras(roleId));
      }
    } catch (error) {
      showErrorToast(
        error?.message || "Ocurrió un error al guardar los cambios.",
      );
    } finally {
      dispatchAction({ type: "SET_FIELD", field: "assigning", value: false });
    }
  };

  const handleDesasignar = async (proveedorId) => {
    try {
      await dispatch(
        desasignarProveedor({ compraId: item.id, proveedorId }),
      ).unwrap();

      showSuccessToast("Proveedor desasignado correctamente.");

      dispatchAction({ type: "REMOVE_PROVIDER", payload: proveedorId });

      dispatch(fetchCompras());
      const roleId = parseInt(localStorage.getItem("roleId") || "0", 10);
      await dispatch(fetchCompras(roleId));
    } catch (error) {
      showErrorToast("No se pudo desasignar el proveedor.");
    }
  };

  const handleClose = () => {
    dispatchAction({ type: "RESET" });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="xl"
      motionPreset="slideInBottom"
      closeOnOverlayClick={false}
    >
      <ModalOverlay backdropFilter="blur(3px)" />
      <ModalContent bg="gray.50">
        <ModalHeader borderBottom="1px solid" borderColor="gray.200" pb={3}>
          <Text color="green.700" fontWeight="bold">
            Planificar Ingreso
          </Text>
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody py={6}>
          <HeaderInfo item={item} />
          <ConfigurationGrid state={state} dispatchAction={dispatchAction} />
          <Divider mb={5} />
          <CurrentAssignments
            proveedoresAsignados={state.proveedoresAsignados}
            handleDesasignar={handleDesasignar}
          />
        </ModalBody>

        <ModalFooter
          borderTop="1px solid"
          borderColor="gray.200"
          bg="white"
          borderBottomRadius="md"
        >
          <Button variant="ghost" mr={3} onClick={handleClose}>
            Cancelar
          </Button>
          <Button
            colorScheme="green"
            onClick={handleGuardar}
            isLoading={state.assigning}
          >
            Guardar Cambios
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

RegistrarProveedorModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  item: PropTypes.shape({
    id: PropTypes.number,
    codigo: PropTypes.string,
    nombre: PropTypes.string,
    cantidad: PropTypes.number,
    cantidadAsignada: PropTypes.number,
    fechaIngreso: PropTypes.string,
    proveedoresAsignados: PropTypes.arrayOf(
      PropTypes.shape({
        proveedorId: PropTypes.number,
        nombre: PropTypes.string,
        cantidad: PropTypes.number,
      }),
    ),
  }),
};

export default RegistrarProveedorModal;
