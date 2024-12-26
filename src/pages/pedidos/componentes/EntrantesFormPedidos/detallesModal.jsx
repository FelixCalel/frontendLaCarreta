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
  Heading,
  Text
} from "@chakra-ui/react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const DetallesModal = ({ isOpen, onClose, detalles, pedido }) => {
  if(!pedido){
    return null; 
  }
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Detalles del Pedido {pedido.id}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {detalles && detalles.length > 0 ? (
        <>
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
        <Box mt={4}>
          <Heading size="md">Fecha de Entrega</Heading>
          <Text>{format(new Date(pedido.fechaOrden), "dd 'de' MMMM 'de' yyyy", { locale: es })}</Text>
        </Box>
      </>
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
  pedido: PropTypes.shape({
    id: PropTypes.number.isRequired,
    fechaOrden: PropTypes.string.isRequired,
    // Añade otras propiedades si es necesario
  }),
};


DetallesModal.defaultProps = {
  pedido: null,
};

export default DetallesModal;
