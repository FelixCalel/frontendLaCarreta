import { useEffect, useState, useRef } from "react";
import React from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Collapse,
  IconButton,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useToast,
  Tooltip,
  Spinner,
  FormControl,
  FormLabel,
  Input,
  Select
} from "@chakra-ui/react";
import {
  DeleteIcon,
  AddIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@chakra-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import DeuSelector from "./componentes/DeuSelector";
import CiudadSelector from "./componentes/CiudadSelector";
import TiendaSelector from "./componentes/tiendaSelector";
import ProductosTable from "./componentes/detallesPedidosTable";
import {
  addNewPedido,
  tablaPedidos,
  deletePedido,
  togglePedidoStatus,
} from "../../store/Pedidos/thunks";

const DetallePedidoForm = () => {
  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isDialogOpen,
    onOpen: onDialogOpen,
    onClose: onDialogClose,
  } = useDisclosure();
  const cancelRef = useRef();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Obtener pedidos desde Redux
  const pedidos = useSelector((state) => state.pedidos.data);
  const usuarioId = localStorage.getItem("usuarioId");

  // Estado del pedido actual
  const [currentPedido, setCurrentPedido] = useState({
    ciudadId: 0,
    deudorId: 0,
    tiendaId: 0,
    usuarioId: parseInt(usuarioId),
    estadoId: 1, // Estado inicial predeterminado
  });

  const [isPedidoFinalizado, setIsPedidoFinalizado] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState({});
  const [pedidoIdGuardado, setPedidoIdGuardado] = useState(null);
  const [selectedPedidoId, setSelectedPedidoId] = useState(null);

  // Cargar los pedidos al iniciar
  useEffect(() => {
    dispatch(tablaPedidos());
  }, [dispatch]);

  // Cambios en los selectores
  const handleCiudadChange = (e) => {
    setCurrentPedido((prev) => ({ ...prev, ciudadId: parseInt(e.target.value) }));
  };

  const handleDeudorSelect = (deudorId) => {
    setCurrentPedido((prev) => ({ ...prev, deudorId }));
  };

  const handleTiendaChange = (value) => {
    setCurrentPedido((prev) => ({ ...prev, tiendaId: value }));
  };

  // Validar campos del formulario
  const validateFields = () => {
    let formErrors = {};
    if (!currentPedido.ciudadId && !isPedidoFinalizado)
      formErrors.ciudadId = "La ciudad es obligatoria";
    if (!currentPedido.deudorId && !isPedidoFinalizado)
      formErrors.deudorId = "El deudor es obligatorio";
    if (!currentPedido.tiendaId && !isPedidoFinalizado)
      formErrors.tiendaId = "La tienda es obligatoria";
    return formErrors;
  };

  // Guardar pedido nuevo
  const handleSubmit = async () => {
    const formErrors = validateFields();
    if (Object.keys(formErrors).length > 0) {
      toast({
        title: "Error",
        description: "Faltan campos obligatorios",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true); // Activar el spinner mientras se guarda el pedido

    if (!isPedidoFinalizado) {
      const newPedido = { ...currentPedido };
      try {
        const pedidoGuardado = await dispatch(addNewPedido(newPedido)).unwrap();
        setPedidoIdGuardado(pedidoGuardado.id);
        setIsPedidoFinalizado(true);
        dispatch(tablaPedidos());
        toast({
          title: "Pedido creado",
          description: "El pedido ha sido guardado correctamente",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        console.error("Error al guardar el pedido:", error);
      } finally {
        setIsLoading(false); // Detener el spinner
      }
    }
    onClose();
    resetForm(); // Limpiar el formulario después de cerrar el modal
  };

  // Resetear el formulario cuando se cierra el modal
  const resetForm = () => {
    setCurrentPedido({
      ciudadId: 0,
      deudorId: 0,
      tiendaId: 0,
      usuarioId: parseInt(usuarioId),
      estadoId: 1,
    });
    setIsPedidoFinalizado(false);
    setPedidoIdGuardado(null);
  };

  // Confirmar la acción de realizar el pedido
  const handleRealizarPedido = async () => {
    try {
      await dispatch(togglePedidoStatus({ id: selectedPedidoId, estadoId: 2 })).unwrap();
      dispatch(tablaPedidos());
      onDialogClose();
      toast({
        title: "Pedido realizado",
        description: "El pedido ha sido actualizado a estado 2",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error al actualizar el estado del pedido:", error);
    }
  };

  // Mostrar alerta de confirmación para realizar el pedido
  const showRealizarPedidoConfirmation = (pedidoId) => {
    setSelectedPedidoId(pedidoId);
    onDialogOpen();
  };

  // Manejo del colapso de detalles
  const handleToggleDetails = (pedidoId) => {
    setIsDetailsOpen((prev) => ({ ...prev, [pedidoId]: !prev[pedidoId] }));
  };

  // Manejo de la eliminación del pedido
  const handleDeletePedido = async (pedidoId) => {
    try {
      await dispatch(deletePedido(pedidoId)).unwrap();
      dispatch(tablaPedidos());
      toast({
        title: "Pedido eliminado",
        description: "El pedido ha sido eliminado correctamente",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error al eliminar el pedido:", error);
    }
  };

  // Filtrar los pedidos del usuario
  const pedidosUsuario = pedidos
    .filter((pedido) => pedido.usuarioId === parseInt(usuarioId))
    .filter((pedido) => pedido.estadoId === 1);

  return (
    <Box bg="gray.50" p={6} rounded="md" boxShadow="md">
      <Button
        onClick={onOpen}
        colorScheme="green"
        mb={4}
        leftIcon={<AddIcon />}
        _hover={{ transform: "scale(1.05)", transition: "0.2s" }}
      >
        Crear Pedido
      </Button>

      <Table variant="simple" size="md" colorScheme="gray">
        <Thead bg="gray.200">
          <Tr>
            <Th>ID</Th>
            <Th>Ciudad</Th>
            <Th>Deudor</Th>
            <Th>Tienda</Th>
            <Th>Estado</Th>
            <Th>Detalles</Th>
            <Th>Acciones</Th>
          </Tr>
        </Thead>
        <Tbody>
          {pedidosUsuario.length > 0 ? (
            pedidosUsuario.map((pedido) => (
              <React.Fragment key={pedido.id}>
                <Tr _hover={{ bg: "gray.100" }}>
                  <Td>{pedido.id}</Td>
                  <Td>{pedido.nombreCiudad || "N/A"}</Td>
                  <Td>{`${pedido.nombreCorrelativo || ""} - ${pedido.nombreDeu || "N/A"}`}</Td>
                  <Td>{pedido.nombreTienda || "N/A"}</Td>
                  <Td>{pedido.estadoId || "N/A"}</Td>
                  <Td>
                    <Button
                      size="sm"
                      colorScheme="blue"
                      onClick={() => handleToggleDetails(pedido.id)}
                    >
                      {isDetailsOpen[pedido.id] ? <ChevronUpIcon /> : <ChevronDownIcon />}
                    </Button>
                  </Td>
                  <Td>
                    <IconButton
                      icon={<DeleteIcon />}
                      colorScheme="red"
                      onClick={() => handleDeletePedido(pedido.id)}
                      size="sm"
                      _hover={{ bg: "red.500" }}
                    />
                    <Button
                      ml={2}
                      size="sm"
                      colorScheme="teal"
                      onClick={() => showRealizarPedidoConfirmation(pedido.id)}
                      isDisabled={pedido.estadoId === 2}
                      _hover={{ transform: "scale(1.05)", transition: "0.2s" }}
                    >
                      Realizar Pedido
                    </Button>
                  </Td>
                </Tr>
                <Tr>
                  <Td colSpan={8}>
                    <Collapse in={isDetailsOpen[pedido.id]}>
                      <ProductosTable pedidoId={pedido.id} />
                    </Collapse>
                  </Td>
                </Tr>
              </React.Fragment>
            ))
          ) : (
            <Tr>
              <Td colSpan="8" textAlign="center" py={10}>
                No hay pedidos disponibles
              </Td>
            </Tr>
          )}
        </Tbody>
      </Table>

      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{isPedidoFinalizado ? "Agregar Productos" : "Agregar Pedido"}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {!isPedidoFinalizado ? (
              <>
                <CiudadSelector value={currentPedido.ciudadId} onChange={handleCiudadChange} />
                <DeuSelector ciudadId={currentPedido.ciudadId} onSelect={handleDeudorSelect} />
                <TiendaSelector
                  ciudadId={currentPedido.ciudadId}
                  deudorId={currentPedido.deudorId}
                  value={currentPedido.tiendaId}
                  onChange={handleTiendaChange}
                />
              </>
            ) : (
              <ProductosTable pedidoId={pedidoIdGuardado} />
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="green"
              mr={3}
              onClick={handleSubmit}
              isLoading={isLoading}
              spinner={<Spinner size="sm" />}
              _hover={{ transform: "scale(1.05)", transition: "0.2s" }}
            >
              {isPedidoFinalizado ? "Agregar" : "Guardar"}
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <AlertDialog isOpen={isDialogOpen} leastDestructiveRef={cancelRef} onClose={onDialogClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Confirmar Pedido
            </AlertDialogHeader>
            <AlertDialogBody>¿Estás seguro de que quieres realizar este pedido?</AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onDialogClose}>
                No
              </Button>
              <Button
                colorScheme="green"
                onClick={handleRealizarPedido}
                ml={3}
                _hover={{ transform: "scale(1.05)", transition: "0.2s" }}
              >
                Sí
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default DetallePedidoForm;
