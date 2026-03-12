import PropTypes from "prop-types";
import { useModalAuthError } from "../../../../hooks/useAuthError";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  Flex,
  Icon,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { FaBoxOpen } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import PedidoInfoDisplay from "./PedidoInfoDisplay";
import AgregarProductoBar from "./AgregarProductoBar";
import DetallesProductosTable from "./DetallesProductosTable";

const EMPTY_ARRAY = [];

const DetallesModal = ({
  isOpen,
  onClose,
  detalles = EMPTY_ARRAY,
  pedido = null,
}) => {
  const location = useLocation();
  const isEditable = location.pathname === "/pedidos/entrantes";
  
  const {
    newProducto, setNewProducto,
    cantidadAgregar, setCantidadAgregar,
    loading, loadingDetalle,
    resetFields, detallesLocal,
    editCantidad, setEditCantidad,
    handleAddProducto, handleCantidadConfirm, handleRemoveProducto
  } = useDetallesModal(pedido, detalles, onClose);

  const bg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  if (!pedido) return null;

  const handleCantidadChange = (detalleId, cantidad) => {
    setEditCantidad((prev) => ({ ...prev, [detalleId]: cantidad }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" isCentered motionPreset="slideInBottom">
      <ModalOverlay bg="blackAlpha.600" />
      <ModalContent bg={bg} borderRadius="lg" boxShadow="xl" border="1px solid" borderColor={borderColor}>
        <ModalHeader>
          <Flex align="center" gap={2}>
            <Icon as={FaBoxOpen} w={6} h={6} />
            <Text>Detalles del Pedido&nbsp;</Text>
            <Text as="span" fontWeight="bold">#{pedido.id}</Text>
          </Flex>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={0} align="stretch">
            <PedidoInfoDisplay pedido={pedido} />
            {isEditable && (
              <AgregarProductoBar
                newProducto={{ ...newProducto, deudorId: pedido.deudorId }}
                setNewProducto={setNewProducto}
                cantidadAgregar={cantidadAgregar}
                setCantidadAgregar={setCantidadAgregar}
                handleAddProducto={handleAddProducto}
                loading={loading}
                resetFields={resetFields}
              />
            )}
            <DetallesProductosTable
              detallesLocal={detallesLocal}
              editCantidad={editCantidad}
              handleCantidadChange={isEditable ? handleCantidadChange : () => {}}
              handleCantidadConfirm={isEditable ? handleCantidadConfirm : () => {}}
              handleRemoveProducto={isEditable ? handleRemoveProducto : () => {}}
              loadingDetalle={loadingDetalle}
              isEditable={isEditable}
            />
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose} colorScheme="green" variant="outline">Cerrar</Button>
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
    }),
  ),
  pedido: PropTypes.shape({
    id: PropTypes.number,
    fechaOrden: PropTypes.string,
    comentario: PropTypes.string,
    fechaOrdenDisplay: PropTypes.string,
    comentarioDisplay: PropTypes.string,
    deudorId: PropTypes.number,
    tiendaId: PropTypes.number,
  }),
};

export default DetallesModal;
