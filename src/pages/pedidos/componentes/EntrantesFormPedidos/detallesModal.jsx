import PropTypes from "prop-types";
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
} from "@chakra-ui/react";

const DetallesModal = ({ isOpen, onClose, detalles, pedidoId }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Detalles del Pedido {pedidoId}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {detalles && detalles.length > 0 ? (
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Código</Th>
                  <Th>Producto</Th>
                  <Th>Cantidad</Th>
                </Tr>
              </Thead>
              <Tbody>
                {detalles.map((detalle) => (
                  <Tr key={detalle.id}>
                  <Td>{detalle.codigo || "Sin código"}</Td>
                  <Td>{detalle.nombreProducto || "Sin nombre"}</Td>
                  <Td>{detalle.cantidad}</Td>
                </Tr>
                ))}
              </Tbody>
            </Table>
          ) : (
            <Box>No hay detalles disponibles</Box>
          )}
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={onClose}>
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
      id: PropTypes.number.isRequired,
      codigo: PropTypes.string,
      nombreProducto: PropTypes.string.isRequired,
      cantidad: PropTypes.number.isRequired,
    })
  ),
  pedidoId: PropTypes.number,
};

DetallesModal.defaultProps = {
  pedidoId: null,
};

export default DetallesModal;
