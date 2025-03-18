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
  Text,
} from "@chakra-ui/react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const DetallesModal = ({ isOpen, onClose, pedido = null }) => {
  if (!pedido) {
    return null;
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Detalles del Pedido {pedido.id}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {pedido.items && pedido.items.length > 0 ? (
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
                  {pedido.items.map((item) => (
                    <Tr key={item.id}>
                      <Td>{item.codigo || "Sin código"}</Td>
                      <Td>{item.nombre}</Td>
                      <Td>{item.cantidad}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
              <Box mt={4}>
                <Heading size="md">Fecha de Entrega</Heading>
                <Text>
                  {pedido.fechaEntrega
                    ? format(
                        new Date(pedido.fechaEntrega),
                        "dd 'de' MMMM 'de' yyyy",
                        { locale: es }
                      )
                    : "Sin fecha"}
                </Text>
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
  pedido: PropTypes.shape({
    id: PropTypes.number.isRequired,
    fechaEntrega: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        codigo: PropTypes.string,
        nombre: PropTypes.string.isRequired,
        cantidad: PropTypes.number.isRequired,
      })
    ),
  }),
};

export default DetallesModal;
