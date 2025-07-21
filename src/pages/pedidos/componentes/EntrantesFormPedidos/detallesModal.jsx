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
  Text,
  Flex,
  Icon,
  Divider,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { FaCalendarAlt, FaCommentDots, FaBoxOpen } from "react-icons/fa";

const DetallesModal = ({ isOpen, onClose, detalles, pedido }) => {
  const bg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const rowHoverBg = useColorModeValue("gray.50", "gray.700");
  const commentTextColor = useColorModeValue("gray.700", "gray.300");

  if (!pedido) return null;

  const fechaIso = pedido.fechaOrden.slice(0, 10);
  const [year, month, day] = fechaIso.split("-");
  const sortedDetalles = [...detalles].sort((a, b) =>
    a.nombreProducto.localeCompare(b.nombreProducto)
  );

  if (!pedido) return null;

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
          <Flex align="center">
            <Icon as={FaBoxOpen} w={6} h={6} mr={3} />
            Detalles del Pedido{" "}
            <Text as="span" fontWeight="bold">
              #{pedido.id}
            </Text>
          </Flex>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={5} align="stretch">
            <Box>
              <Text fontSize="lg" fontWeight="semibold" mb={2}>
                Productos
              </Text>
              <Table variant="simple" size="sm">
                <Thead bg={borderColor}>
                  <Tr>
                    <Th>Código</Th>
                    <Th>Producto</Th>
                    <Th textAlign="right">Cantidad</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {sortedDetalles.map((item) => (
                    <Tr key={item.id} _hover={{ bg: rowHoverBg }}>
                      <Td>{item.codigo}</Td>
                      <Td>{item.nombreProducto}</Td>
                      <Td textAlign="right">{item.cantidad}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>

            <Divider borderColor={borderColor} />

            <Flex align="center">
              <Icon as={FaCalendarAlt} w={5} h={5} mr={2} color="teal.500" />
              <Text>
                Fecha de entrega:{" "}
                <Text as="span" fontWeight="bold">
                  {day}/{month}/{year}
                </Text>
              </Text>
            </Flex>

            <Divider borderColor={borderColor} />

            <Flex align="flex-start">
              <Icon as={FaCommentDots} w={5} h={5} mr={2} color="orange.400" />
              <Box>
                <Text fontWeight="semibold" mb={1}>
                  Comentario
                </Text>
                <Text color={commentTextColor}>
                  {pedido.comentario && pedido.comentario.trim()
                    ? pedido.comentario
                    : "— sin comentario —"}
                </Text>
              </Box>
            </Flex>
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
  }),
};

DetallesModal.defaultProps = {
  detalles: [],
  pedido: null,
};

export default DetallesModal;
