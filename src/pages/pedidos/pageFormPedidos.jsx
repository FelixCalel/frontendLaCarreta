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
  FormControl,
  FormLabel,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { DeleteIcon, AddIcon, ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import DeuSelector from "./componentes/DeuSelector";
import CiudadSelector from "./componentes/CiudadSelector";
import TiendaSelector from "./componentes/tiendaSelector";
import ProductosTable from "./componentes/detallesPedidosTable";
import { addNewPedido, tablaPedidos, deletePedido, togglePedidoStatus } from "../../store/Pedidos/thunks";
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
    const today = new Date().toISOString().split('T')[0];
  
    // Filtrar los pedidos del usuario en la misma tienda y en la fecha actual
    const pedidosHoy = pedidos.filter(pedido => 
      pedido.usuarioId === parseInt(usuarioId) && // Validar por usuario
      pedido.tiendaId === currentPedido.tiendaId && // Validar la misma tienda
      pedido.fecha?.split('T')[0] === today // Validar si la fecha coincide con hoy
    );
  
    // Si ya hay un pedido con la misma tienda hoy, mostrar mensaje de error
    if (pedidosHoy.length > 0) {
      toast({
        title: "Pedido duplicado",
        description: "Ya has hecho un pedido en esta tienda hoy. No puedes realizar otro pedido en el mismo día.",
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
          description: "Hubo un error al guardar el pedido. Inténtalo de nuevo.",
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

  const showRealizarPedidoConfirmation = (pedidoId) => {
    setSelectedPedidoId(pedidoId);
    onDialogOpen();
  };

  const handleToggleDetails = (pedidoId) => {
    setIsDetailsOpen((prev) => ({ ...prev, [pedidoId]: !prev[pedidoId] }));
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
                  <Td>{`${pedido.nombreCorrelativo || ""} - ${
                    pedido.nombreDeu || "N/A"
                  }`}</Td>
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
          <ModalHeader>
            {isPedidoFinalizado ? "Agregar Productos" : "Agregar Pedido"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {!isPedidoFinalizado ? (
              <div>
                <CiudadSelector
                  value={currentPedido.ciudadId ? String(currentPedido.ciudadId) : ""}
                  onChange={handleCiudadChange}
                />
                <DeuSelector ciudadId={currentPedido.ciudadId} onSelect={handleDeudorSelect} />

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

                <FormControl isDisabled={isTienda1Disabled} mt={4}>
                  <FormLabel>Todas las tiendas</FormLabel>
                  <TiendaSelector
                    rutaIds={[]}
                    paisId={Number(paisId)}
                    value={currentPedido.tiendaId2}
                    onChange={handleTiendaChange2}
                    isRutaFilter={false}
                  />
                </FormControl>
              </div>
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
