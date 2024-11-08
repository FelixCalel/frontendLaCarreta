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
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";
import {
  DeleteIcon,
  AddIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@chakra-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import DeuSelector from "./componentes/pageFormPedidos/DeuSelector";
import CiudadSelector from "./componentes/pageFormPedidos/CiudadSelector";
import TiendaSelector from "./componentes/pageFormPedidos/tiendaSelector";
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
  const [isDetailsOpen, setIsDetailsOpen] = useState(null);
  const [selectedPedidoId, setSelectedPedidoId] = useState(null);
  const [productos, setProductos] = useState([]); // Asegúrate de que este estado se maneje aquí

  const pedidos = useSelector((state) => state.pedidos.data);
  const usuarioId = Number(localStorage.getItem("usuarioId"));

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
    tiendaId: 0,
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
    setIsTienda2Disabled(!!value);
  };

  const handleTiendaChange2 = (value) => {
    setCurrentPedido((prev) => ({ ...prev, tiendaId: value }));
    setIsTienda1Disabled(!!value);
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

    const today = new Date().toISOString().split("T")[0];

    const pedidosHoy = pedidos.filter(
      (pedido) =>
        pedido.usuarioId === parseInt(usuarioId) &&
        pedido.tiendaId === currentPedido.tiendaId &&
        pedido.fecha?.split("T")[0] === today
    );

    if (pedidosHoy.length > 0) {
      toast({
        title: "Pedido duplicado",
        description:
          "Ya has hecho un pedido en esta tienda hoy. No puedes realizar otro pedido en el mismo día.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);

    if (!isPedidoFinalizado) {
      const newPedido = { ...currentPedido, fecha: new Date().toISOString() };
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
      const detalles = await dispatch(
        getDetalleOrdenByPedidoId(selectedPedidoId)
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
        onDialogClose();
        return;
      }

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
        return;
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
    setIsDetailsOpen(isDetailsOpen === pedidoId ? null : pedidoId);
    if (isDetailsOpen !== pedidoId) cargarDetalles(pedidoId);
  };

  const cargarDetalles = async (pedidoId) => {
    try {
      setIsLoading(true);
      const detalles = await dispatch(
        getDetalleOrdenByPedidoId(pedidoId)
      ).unwrap();
      setProductos(detalles); // Cambia setProductos aquí para usar el estado adecuado
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

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

      {pedidosUsuario.length > 0 ? (
        isMobile ? (
          <VStack spacing={4} align="stretch">
            {pedidosUsuario.map((pedido) => (
              <Box
                key={pedido.id}
                p={3}
                borderWidth="1px"
                borderColor="gray.200"
                rounded="md"
                bg="white"
                _hover={{
                  boxShadow: "md",
                  transition: "0.2s",
                }}
              >
                <Stack direction="row" justifyContent="space-between">
                  <Text fontWeight="bold">Pedido ID: {pedido.id}</Text>
                  <Badge colorScheme={pedido.estadoId === 1 ? "green" : "gray"}>
                    {pedido.estadoId === 1 ? "Creado" : "Realizado"}
                  </Badge>
                </Stack>
                <Text>
                  <strong>Ciudad:</strong> {pedido.nombreCiudad || "N/A"}
                </Text>
                <Text>
                  <strong>Deudor:</strong> {pedido.nombreCorrelativo} -{" "}
                  {pedido.nombreDeu || "N/A"}
                </Text>
                <Text>
                  <strong>Tienda:</strong> {pedido.nombreTienda || "N/A"}
                </Text>
                <HStack spacing={3} mt={2}>
                  <Tooltip label="Ver Detalles" hasArrow>
                    <IconButton
                      icon={
                        isDetailsOpen === pedido.id ? (
                          <ChevronUpIcon />
                        ) : (
                          <ChevronDownIcon />
                        )
                      }
                      onClick={() => handleToggleDetails(pedido.id)}
                      colorScheme="blue"
                      size="sm"
                    />
                  </Tooltip>
                  <Tooltip label="Eliminar Pedido" hasArrow>
                    <IconButton
                      icon={<DeleteIcon />}
                      colorScheme="red"
                      onClick={() => handleDeletePedido(pedido.id)}
                      size="sm"
                    />
                  </Tooltip>
                  <Button
                    colorScheme="teal"
                    onClick={() => showRealizarPedidoConfirmation(pedido.id)}
                    isDisabled={pedido.estadoId === 2}
                    size="sm"
                  >
                    Realizar Pedido
                  </Button>
                </HStack>
                {isDetailsOpen === pedido.id && (
                  <Box mt={2}>
                    <ProductosTable
                      pedidoId={pedido.id}
                      usuarioId={usuarioId}
                    />
                  </Box>
                )}
              </Box>
            ))}
          </VStack>
        ) : (
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>ID</Th>
                <Th>Ciudad</Th>
                <Th>Deudor</Th>
                <Th>Tienda</Th>
                <Th>Acciones</Th>
              </Tr>
            </Thead>
            <Tbody>
              {pedidosUsuario.map((pedido) => (
                <Tr key={pedido.id}>
                  <Td>{pedido.id}</Td>
                  <Td>{pedido.nombreCiudad || "N/A"}</Td>
                  <Td>
                    {pedido.nombreCorrelativo} - {pedido.nombreDeu || "N/A"}
                  </Td>
                  <Td>{pedido.nombreTienda || "N/A"}</Td>
                  <Td>
                    <HStack spacing={3}>
                      <Tooltip label="Ver Detalles" hasArrow>
                        <IconButton
                          icon={
                            isDetailsOpen === pedido.id ? (
                              <ChevronUpIcon />
                            ) : (
                              <ChevronDownIcon />
                            )
                          }
                          onClick={() => handleToggleDetails(pedido.id)}
                          colorScheme="blue"
                          size="sm"
                        />
                      </Tooltip>
                      <Tooltip label="Eliminar Pedido" hasArrow>
                        <IconButton
                          icon={<DeleteIcon />}
                          colorScheme="red"
                          onClick={() => handleDeletePedido(pedido.id)}
                          size="sm"
                        />
                      </Tooltip>
                      <Button
                        colorScheme="teal"
                        onClick={() =>
                          showRealizarPedidoConfirmation(pedido.id)
                        }
                        isDisabled={pedido.estadoId === 2}
                        size="sm"
                      >
                        Realizar Pedido
                      </Button>
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )
      ) : (
        <Text>No hay pedidos disponibles</Text>
      )}

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
              <ProductosTable
                pedidoId={pedidoIdGuardado}
                usuarioId={usuarioId}
              />
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

