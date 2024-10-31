import { useEffect, useState, useRef } from "react";
import {
  VStack,
  Text,
  Stack,
  Badge,
  HStack,
  Tooltip,
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
  IconButton,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  FormControl,
  FormLabel,
  useToast,
  Spinner,
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
import { getDetalleOrdenByPedidoId } from "../../store/Pedidos/DetallePedidos/thunks";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

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
  const [isPedidoFinalizado, setIsPedidoFinalizado] = useState(false);
  const [pedidoIdGuardado, setPedidoIdGuardado] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState({});
  const [selectedPedidoId, setSelectedPedidoId] = useState(null);
  const [setProductos] = useState([]); // Añade esta línea en DetallePedidoForm

  const pedidos = useSelector((state) => state.pedidos.data);
  const usuarioId = localStorage.getItem("usuarioId");

  const [paisId, setPaisId] = useState(null);

  useEffect(() => {
    const paisIdFromStorage = localStorage.getItem("paisId");
    if (paisIdFromStorage) {
      setPaisId(parseInt(paisIdFromStorage, 10));
    } else {
      console.error("No se encontró el paisId en el localStorage");
    }
  }, []);

  const [usuarioRutas, setUsuarioRutas] = useState([]);
  const [currentPedido, setCurrentPedido] = useState({
    ciudadId: 0,
    deudorId: 0,
    tiendaId: 0, // Solo se usará un campo para la tienda seleccionada
    usuarioId: parseInt(usuarioId),
    estadoId: 1,
  });

  const [isTienda1Disabled, setIsTienda1Disabled] = useState(false);
  const [isTienda2Disabled, setIsTienda2Disabled] = useState(false);

  useEffect(() => {
    dispatch(tablaPedidos());
  }, [dispatch]);

  useEffect(() => {
    const fetchUsuarioRutas = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/usuarios/todos`);
        const usuario = response.data.usuarios.find(
          (u) => u.id === parseInt(usuarioId)
        );
        if (usuario && Array.isArray(usuario.rutas)) {
          const rutasAsignadas = usuario.rutas.map((ruta) => ruta.id);
          setUsuarioRutas(rutasAsignadas);
        } else {
          setUsuarioRutas([]);
        }
      } catch (error) {
        console.error("Error al obtener rutas del usuario:", error);
        setUsuarioRutas([]);
      }
    };
    fetchUsuarioRutas();
  }, [usuarioId]);

  const handleCiudadChange = (e) => {
    setCurrentPedido((prev) => ({
      ...prev,
      ciudadId: parseInt(e.target.value),
    }));
  };

  const handleDeudorSelect = (deudorId) => {
    setCurrentPedido((prev) => ({ ...prev, deudorId }));
  };

  const handleTiendaChange = (value) => {
    setCurrentPedido((prev) => ({ ...prev, tiendaId: value }));
    setIsTienda2Disabled(!!value); // Deshabilitar el segundo selector si se selecciona una tienda en el primero
  };

  const handleTiendaChange2 = (value) => {
    setCurrentPedido((prev) => ({ ...prev, tiendaId: value }));
    setIsTienda1Disabled(!!value); // Deshabilitar el primer selector si se selecciona una tienda en el segundo
  };

  const validateFields = () => {
    let formErrors = {};
    if (!currentPedido.ciudadId && !isPedidoFinalizado)
      formErrors.ciudadId = "La ciudad es obligatoria";
    if (!currentPedido.deudorId && !isPedidoFinalizado)
      formErrors.deudorId = "El deudor es obligatorio";
    if (!currentPedido.tiendaId && !isPedidoFinalizado)
      formErrors.tiendaId = "Debe seleccionar una tienda";
    return formErrors;
  };

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

    // Obtener la fecha de hoy en formato "YYYY-MM-DD"
    const today = new Date().toISOString().split("T")[0];

    // Filtrar los pedidos del usuario en la misma tienda y en la fecha actual
    const pedidosHoy = pedidos.filter(
      (pedido) =>
        pedido.usuarioId === parseInt(usuarioId) && // Validar por usuario
        pedido.tiendaId === currentPedido.tiendaId && // Validar la misma tienda
        pedido.fecha?.split("T")[0] === today // Validar si la fecha coincide con hoy
    );

    // Si ya hay un pedido con la misma tienda hoy, mostrar mensaje de error
    if (pedidosHoy.length > 0) {
      toast({
        title: "Pedido duplicado",
        description:
          "Ya has hecho un pedido en esta tienda hoy. No puedes realizar otro pedido en el mismo día.",
        status: "error",
        duration: 4000, // Aumentar la duración para que el usuario vea el mensaje
        isClosable: true,
      });
      return;
    }

    // Si no hay pedidos duplicados, continuar con la creación del pedido
    setIsLoading(true);

    if (!isPedidoFinalizado) {
      const newPedido = { ...currentPedido, fecha: new Date().toISOString() }; // Añadir fecha actual
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
        toast({
          title: "Error",
          description:
            "Hubo un error al guardar el pedido. Inténtalo de nuevo.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    }
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setCurrentPedido({
      ciudadId: 0,
      deudorId: 0,
      tiendaId: 0,
      usuarioId: parseInt(usuarioId),
      estadoId: 1,
    });
    setIsPedidoFinalizado(false);
    setIsTienda1Disabled(false);
    setIsTienda2Disabled(false);
  };

  const handleRealizarPedido = async () => {
    try {
      // Verificar si hay productos asociados al pedido
      const detalles = await dispatch(
        getDetalleOrdenByPedidoId(selectedPedidoId)
      ).unwrap();

      if (!detalles || detalles.length === 0) {
        // Si no hay productos, mostrar un mensaje de error
        toast({
          title: "Error",
          description:
            "Debe agregar al menos un producto antes de realizar el pedido.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        onDialogClose(); // Cierra el diálogo si no hay productos
        return;
      }

      // Si hay productos, proceder con el cambio de estado del pedido
      await dispatch(
        togglePedidoStatus({ id: selectedPedidoId, estadoId: 2 })
      ).unwrap();
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
      toast({
        title: "Error",
        description: "Hubo un problema al realizar el pedido.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const showRealizarPedidoConfirmation = async (pedidoId) => {
    try {
      const detalles = await dispatch(
        getDetalleOrdenByPedidoId(pedidoId)
      ).unwrap();

      if (!detalles || detalles.length === 0) {
        toast({
          title: "Error",
          description:
            "Debe agregar al menos un producto antes de realizar el pedido.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return; // Detener la ejecución si no hay productos
      }

      setSelectedPedidoId(pedidoId);
      onDialogOpen();
    } catch (error) {
      console.error("Error al verificar productos:", error);
      toast({
        title: "Error",
        description:
          "No se encontraron detalles para este pedido. Agregue al menos un producto.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleToggleDetails = (pedidoId) => {
    setIsDetailsOpen((prev) => ({ ...prev, [pedidoId]: !prev[pedidoId] }));

    // Si el pedido se está abriendo, forzamos la recarga de los productos
    if (!isDetailsOpen[pedidoId]) {
      cargarDetalles(pedidoId);
    }
  };

  // Mover la carga de detalles fuera del efecto en ProductosTable y pasarlo a una función
  const cargarDetalles = async (pedidoId) => {
    try {
      setIsLoading(true);
      const detalles = await dispatch(
        getDetalleOrdenByPedidoId(pedidoId)
      ).unwrap();
      setProductos(detalles);
    } catch (error) {
      console.error("Error al cargar los detalles del pedido:", error);
    } finally {
      setIsLoading(false);
    }
  };

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

  const pedidosUsuario = pedidos
    .filter((pedido) => pedido.usuarioId === parseInt(usuarioId))
    .filter((pedido) => pedido.estadoId === 1);

  return (
    <Box mt={-8} p={-4}>
      <Button
        onClick={onOpen}
        colorScheme="green"
        mb={4}
        leftIcon={<AddIcon />}
        _hover={{
          transform: "scale(1.1)",
          transition: "0.2s",
          boxShadow: "lg",
        }}
        _active={{ transform: "scale(0.95)", transition: "0.1s" }}
        shadow="md"
      >
        Crear Pedido
      </Button>

      <VStack spacing={4} w="100%" maxW="600px">
        {pedidosUsuario.length > 0 ? (
          pedidosUsuario.map((pedido) => (
            <Box
              key={pedido.id}
              bg="white"
              p={4}
              rounded="md"
              shadow="md"
              w="100%"
              border="1px solid"
              borderColor="gray.200"
              _hover={{
                boxShadow: "xl",
                transform: "scale(1.02)",
                transition: "0.2s",
              }}
            >
              <Stack direction="row" justifyContent="space-between">
                <Text fontSize="lg" fontWeight="bold">
                  Pedido ID: {pedido.id}
                </Text>
                <Badge colorScheme={pedido.estadoId === 1 ? "green" : "gray"}>
                  {pedido.estadoId === 1 ? "Pendiente" : "Realizado"}
                </Badge>
              </Stack>
              <Text mt={2}>
                <strong>Ciudad:</strong> {pedido.nombreCiudad || "N/A"}
              </Text>
              <Text>
                <strong>Deudor:</strong> {pedido.nombreCorrelativo} -{" "}
                {pedido.nombreDeu || "N/A"}
              </Text>
              <Text>
                <strong>Tienda:</strong> {pedido.nombreTienda || "N/A"}
              </Text>
              <HStack spacing={3} mt={4}>
                <Tooltip
                  label="Ver Detalles"
                  hasArrow
                  bg="gray.800"
                  color="white"
                  shadow="lg"
                >
                  <Button
                    size="sm"
                    colorScheme="blue"
                    onClick={() => handleToggleDetails(pedido.id)}
                    _hover={{ transform: "scale(1.05)", transition: "0.2s" }}
                  >
                    {isDetailsOpen[pedido.id] ? (
                      <ChevronUpIcon />
                    ) : (
                      <ChevronDownIcon />
                    )}
                  </Button>
                </Tooltip>
                <Tooltip
                  label="Eliminar Pedido"
                  hasArrow
                  bg="red.600"
                  color="white"
                  shadow="lg"
                >
                  <IconButton
                    icon={<DeleteIcon />}
                    colorScheme="red"
                    onClick={() => handleDeletePedido(pedido.id)}
                    size="sm"
                    _hover={{ transform: "scale(1.1)", transition: "0.2s" }}
                  />
                </Tooltip>

                <Button
  size="sm"
  colorScheme="teal"
  onClick={() => showRealizarPedidoConfirmation(pedido.id)}
  isDisabled={pedido.estadoId === 2}
  _hover={{
    transform: "scale(1.05)",
    transition: "0.2s",
    boxShadow: "lg",
    zIndex: isDetailsOpen[pedido.id] ? "1" : "-1", // Reducir zIndex si está abierta la lista
  }}
  _active={{ transform: "scale(0.95)", transition: "0.1s" }}
  shadow="md"
>
  Realizar Pedido
</Button>

              </HStack>
              {isDetailsOpen[pedido.id] && (
                <Box>
                  <ProductosTable pedidoId={pedido.id} />
                </Box>
              )}
            </Box>
          ))
        ) : (
          <Text>No hay pedidos disponibles</Text>
        )}
      </VStack>

      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {isPedidoFinalizado ? "Agregar Productos" : "Agregar Pedido"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody bg="gray.50" borderRadius="md">
            {!isPedidoFinalizado ? (
              <VStack spacing={4}>
                <CiudadSelector
                  value={
                    currentPedido.ciudadId ? String(currentPedido.ciudadId) : ""
                  }
                  onChange={handleCiudadChange}
                />
                <DeuSelector
                  ciudadId={currentPedido.ciudadId}
                  onSelect={handleDeudorSelect}
                />
                <FormControl isDisabled={isTienda2Disabled}>
                  <FormLabel>Tiendas asignadas</FormLabel>
                  <TiendaSelector
                    rutaIds={usuarioRutas || []}
                    paisId={Number(paisId)}
                    value={currentPedido.tiendaId}
                    onChange={handleTiendaChange}
                    isRutaFilter={true}
                  />
                </FormControl>
                <FormControl isDisabled={isTienda1Disabled}>
                  <FormLabel>Todas las tiendas</FormLabel>
                  <TiendaSelector
                    rutaIds={[]}
                    paisId={Number(paisId)}
                    value={currentPedido.tiendaId2}
                    onChange={handleTiendaChange2}
                    isRutaFilter={false}
                  />
                </FormControl>
              </VStack>
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
              spinner={<Spinner size="sm" color="white" />}
              _hover={{
                transform: "scale(1.05)",
                transition: "0.2s",
                boxShadow: "lg",
              }}
            >
              {isPedidoFinalizado ? "Agregar" : "Guardar"}
            </Button>

            <Button variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <AlertDialog
        isOpen={isDialogOpen}
        leastDestructiveRef={cancelRef}
        onClose={onDialogClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Confirmar Pedido
            </AlertDialogHeader>
            <AlertDialogBody>
              ¿Estás seguro de que quieres realizar este pedido?
            </AlertDialogBody>
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
