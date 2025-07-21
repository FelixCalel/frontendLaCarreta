import PropTypes from "prop-types";
import { useMemo } from "react";
import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Table,
  Tbody,
  Th,
  Thead,
  Td,
  Tr,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";

const DetallesPedidoModal = ({
  isOpen,
  onClose,
  pedido,
  detalles,
  isLoading,
}) => {
  const cardBg = useColorModeValue("white", "gray.700");
  const cardBorderColor = useColorModeValue("gray.200", "gray.600");
  const emptyColor = useColorModeValue("gray.500", "gray.400");
  const tableColorScheme = useColorModeValue("gray", "blue");

  const sortedDetalles = useMemo(
    () =>
      [...detalles].sort((a, b) =>
        a.nombreProducto.localeCompare(b.nombreProducto)
      ),
    [detalles]
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Detalles del Pedido {pedido?.id}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {isLoading ? (
            <Box display="flex" justifyContent="center" alignItems="center">
              <Spinner size="lg" />
            </Box>
          ) : sortedDetalles.length > 0 ? (
            <>
              <Box display={{ base: "none", md: "block" }}>
                <Table variant="simple" colorScheme={tableColorScheme}>
                  <Thead>
                    <Tr>
                      <Th>Código</Th>
                      <Th>Producto</Th>
                      <Th>Cantidad</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {sortedDetalles.map((detalle) => (
                      <Tr key={detalle.id}>
                        <Td>{detalle.codigo || "N/A"}</Td>
                        <Td>{detalle.nombreProducto}</Td>
                        <Td>{detalle.cantidad}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>

              <Box display={{ base: "block", md: "none" }}>
                <VStack spacing={4} align="stretch">
                  {sortedDetalles.map((detalle) => (
                    <Box
                      key={detalle.id}
                      p={3}
                      borderWidth="1px"
                      borderColor={cardBorderColor}
                      rounded="md"
                      bg={cardBg}
                      shadow="sm"
                    >
                      <Text>
                        <strong>Código:</strong> {detalle.codigo || "N/A"}
                      </Text>
                      <Text>
                        <strong>Producto:</strong> {detalle.nombreProducto}
                      </Text>
                      <Text>
                        <strong>Cantidad:</strong> {detalle.cantidad}
                      </Text>
                    </Box>
                  ))}
                </VStack>
              </Box>
            </>
          ) : (
            <Box textAlign="center" color={emptyColor}>
              No hay detalles disponibles para este pedido.
            </Box>
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

DetallesPedidoModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  pedido: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }),
  detalles: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      codigo: PropTypes.string,
      nombreProducto: PropTypes.string.isRequired,
      cantidad: PropTypes.number.isRequired,
    })
  ).isRequired,
  isLoading: PropTypes.bool.isRequired,
};

export default DetallesPedidoModal;
