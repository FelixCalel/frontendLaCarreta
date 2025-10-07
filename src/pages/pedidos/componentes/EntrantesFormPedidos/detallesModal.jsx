import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useToast } from "@chakra-ui/react";
import ProductoSelector from "../../componentes/pageFormPedidos/productoSelector";
import {
  addNewDetalleOrden,
  updateDetalleOrden,
  deleteDetalleOrden,
  getDetalleOrdenByPedidoId,
} from "../../../../store/Pedidos/DetallePedidos/thunks";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Box,
  Text,
  Flex,
  Icon,
  Divider,
  Badge,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { FaCalendarAlt, FaCommentDots, FaBoxOpen } from "react-icons/fa";

const DetallesModal = ({ isOpen, onClose, detalles = [], pedido = null }) => {
  const dispatch = useDispatch();
  const toast = useToast();

  // Estado para nuevo producto
  const [newProducto, setNewProducto] = useState({
    productoId: null,
    nombreProducto: "",
    cantidad: "",
    cantidadDisponible: 0,
    codigo: "",
    precio: 0,
  });
  const [cantidadAgregar, setCantidadAgregar] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetFields, setResetFields] = useState(false);
  const [detallesLocal, setDetallesLocal] = useState(detalles);
  const [editCantidad, setEditCantidad] = useState({});

  // Sincronizar detalles locales cuando cambian los detalles externos
  useEffect(() => {
    setDetallesLocal(detalles);
  }, [detalles]);

  // Handlers CRUD
  const handleAddProducto = async () => {
    if (!newProducto.productoId || !cantidadAgregar || cantidadAgregar <= 0) {
      toast({
        title: "Completa los datos del producto y cantidad",
        status: "warning",
      });
      return;
    }
    setLoading(true);
    try {
      await dispatch(
        addNewDetalleOrden({
          pedidoId: pedido.id,
          productoId: newProducto.productoId,
          cantidad: Number(cantidadAgregar),
          precio: newProducto.precio,
          codigo: newProducto.codigo,
          nombreProducto: newProducto.nombreProducto,
          cantidadDisponible: newProducto.cantidadDisponible,
          deudorId: pedido.deudorId,
          tiendaId: pedido.tiendaId,
        })
      ).unwrap();
      toast({ title: "Producto agregado", status: "success" });
      setNewProducto({
        productoId: null,
        nombreProducto: "",
        cantidad: "",
        cantidadDisponible: 0,
        codigo: "",
        precio: 0,
      });
      setCantidadAgregar("");
      setResetFields(true);
      setTimeout(() => setResetFields(false), 200);
      // Recargar detalles dinámicamente
      const nuevosDetalles = await dispatch(
        getDetalleOrdenByPedidoId(pedido.id)
      ).unwrap();
      setDetallesLocal(nuevosDetalles);
    } catch (err) {
      toast({
        title: "Error al agregar",
        description: err?.message || "",
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCantidadChange = async (detalleId, cantidad) => {
    setEditCantidad((prev) => ({ ...prev, [detalleId]: cantidad }));
  };

  // Confirmar edición de cantidad (Enter o blur)
  const handleCantidadConfirm = async (detalleId) => {
    const cantidad = Number(editCantidad[detalleId]);
    if (!cantidad || cantidad <= 0) return;
    setLoading(true);
    try {
      await dispatch(
        updateDetalleOrden({
          id: detalleId,
          pedidoId: pedido.id,
          cantidad,
        })
      ).unwrap();
      toast({ title: "Cantidad actualizada", status: "success" });
      // Recargar detalles dinámicamente
      const nuevosDetalles = await dispatch(
        getDetalleOrdenByPedidoId(pedido.id)
      ).unwrap();
      setDetallesLocal(nuevosDetalles);
      setEditCantidad((prev) => ({ ...prev, [detalleId]: undefined }));
    } catch (err) {
      toast({
        title: "Error al actualizar",
        description: err?.message || "",
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveProducto = async (detalleId) => {
    setLoading(true);
    try {
      await dispatch(deleteDetalleOrden(detalleId)).unwrap();
      toast({ title: "Producto eliminado", status: "info" });
      // Recargar detalles dinámicamente
      const nuevosDetalles = await dispatch(
        getDetalleOrdenByPedidoId(pedido.id)
      ).unwrap();
      setDetallesLocal(nuevosDetalles);
    } catch (err) {
      toast({
        title: "Error al eliminar",
        description: err?.message || "",
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };
  const bg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const commentTextC = useColorModeValue("gray.700", "gray.300");
  const badgeBgDisplay = useColorModeValue("purple.500", "purple.400");
  const bgPurple = useColorModeValue("#F3E8FF", "#6B21A8");

  if (!pedido) return null;

  let fechaDisplay = null;
  if (pedido.fechaOrdenDisplay) {
    const [yy, mm, dd] = pedido.fechaOrdenDisplay.slice(0, 10).split("-");
    fechaDisplay = `${dd}/${mm}/${yy}`;
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="2xl"
      isCentered
      motionPreset="slideInBottom"
    >
      <ModalOverlay bg="blackAlpha.600" />
      <ModalContent
        bg={bg}
        borderRadius="lg"
        boxShadow="xl"
        border="1px solid"
        borderColor={borderColor}
      >
        <ModalHeader>
          <Flex align="center" gap={2}>
            <Icon as={FaBoxOpen} w={6} h={6} />
            <Text>Detalles del Pedido&nbsp;</Text>
            <Text as="span" fontWeight="bold">
              #{pedido.id}
            </Text>
          </Flex>
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <VStack spacing={5} align="stretch">
            {pedido.comentarioDisplay || pedido.fechaOrdenDisplay ? (
              <>
                <Flex
                  px={4}
                  py={2}
                  border="1px solid"
                  borderColor={borderColor}
                  borderRadius="md"
                  bg={bgPurple}
                  direction="column"
                  gap={2}
                >
                  <Flex align="center" gap={2}>
                    <Badge colorScheme="purple" bg={badgeBgDisplay}>
                      Display
                    </Badge>
                    {fechaDisplay && (
                      <>
                        <Icon as={FaCalendarAlt} />
                        <Text fontSize="sm">{fechaDisplay}</Text>
                      </>
                    )}
                  </Flex>
                  {pedido.comentarioDisplay && (
                    <Flex align="flex-start" gap={2}>
                      <Icon as={FaCommentDots} />
                      <Text fontSize="sm" color={commentTextC}>
                        {pedido.comentarioDisplay.trim()}
                      </Text>
                    </Flex>
                  )}
                </Flex>
                <Divider borderColor={borderColor} />
              </>
            ) : null}

            {/* Sección para agregar producto */}
            <Flex
              direction={{ base: "column", md: "row" }}
              gap={3}
              align="center"
              mb={2}
            >
              <Box minW={{ base: "100%", md: "350px" }}>
                <ProductoSelector
                  deudorId={pedido.deudorId}
                  onSelect={(
                    productoId,
                    nombreProducto,
                    cantidadDisponible,
                    codigo
                  ) => {
                    setNewProducto((prev) => ({
                      ...prev,
                      productoId,
                      nombreProducto,
                      cantidadDisponible,
                      codigo,
                    }));
                  }}
                  reset={resetFields}
                />
              </Box>
              <Box minW={{ base: "100%", md: "120px" }}>
                <input
                  type="number"
                  min={1}
                  max={newProducto.cantidadDisponible || undefined}
                  value={cantidadAgregar}
                  onChange={(e) => setCantidadAgregar(e.target.value)}
                  placeholder="Cantidad"
                  style={{
                    width: "100%",
                    padding: "6px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                  }}
                  disabled={!newProducto.productoId}
                />
              </Box>
              <Button
                colorScheme="teal"
                onClick={handleAddProducto}
                isLoading={loading}
                disabled={!newProducto.productoId || !cantidadAgregar}
              >
                Agregar producto
              </Button>
            </Flex>

            {/* Lista editable de productos */}
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Código</Th>
                  <Th>Producto</Th>
                  <Th>Cantidad</Th>
                  <Th>Acciones</Th>
                </Tr>
              </Thead>
              <Tbody>
                {detallesLocal.map((producto) => (
                  <Tr key={producto.id}>
                    <Td>{producto.codigo || "Sin código"}</Td>
                    <Td>{producto.nombreProducto}</Td>
                    <Td>
                      <input
                        type="number"
                        min={1}
                        value={
                          editCantidad[producto.id] !== undefined
                            ? editCantidad[producto.id]
                            : producto.cantidad
                        }
                        onChange={(e) =>
                          handleCantidadChange(producto.id, e.target.value)
                        }
                        onBlur={() => handleCantidadConfirm(producto.id)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter")
                            handleCantidadConfirm(producto.id);
                        }}
                        style={{
                          width: "70px",
                          padding: "4px",
                          borderRadius: "6px",
                          border: "1px solid #ccc",
                        }}
                      />
                    </Td>
                    <Td>
                      <Button
                        colorScheme="red"
                        size="xs"
                        onClick={() => handleRemoveProducto(producto.id)}
                        isLoading={loading}
                      >
                        Eliminar
                      </Button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button onClick={onClose} colorScheme="green" variant="outline">
            Cerrar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

DetallesModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  detalles: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      codigo: PropTypes.string,
      nombreProducto: PropTypes.string,
      cantidad: PropTypes.number,
    })
  ),
  pedido: PropTypes.shape({
    id: PropTypes.number,
    fechaOrden: PropTypes.string,
    comentario: PropTypes.string,
    fechaOrdenDisplay: PropTypes.string,
    comentarioDisplay: PropTypes.string,
  }),
};

export default DetallesModal;
