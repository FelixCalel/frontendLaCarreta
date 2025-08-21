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
  Badge,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { FaCalendarAlt, FaCommentDots, FaBoxOpen } from "react-icons/fa";

const DetallesModal = ({ isOpen, onClose, detalles = [], pedido = null }) => {
  const bg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const rowHoverBg = useColorModeValue("gray.50", "gray.700");
  const commentTextC = useColorModeValue("gray.700", "gray.300");
  const badgeBgDisplay = useColorModeValue("purple.500", "purple.400");
  const badgeBgUser = useColorModeValue("teal.600", "teal.500");

  if (!pedido) return null;

  const [y, m, d] = pedido.fechaOrden.slice(0, 10).split("-");
  const fechaUser = `${d}/${m}/${y}`;

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
                  bg={useColorModeValue("purple.50", "purple.900")}
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

            <Box>
              <Text fontSize="lg" fontWeight="semibold" mb={2}>
                Productos
              </Text>
              <Table variant="simple" size="sm">
                <Thead bg={borderColor}>
                  <Tr>
                    <Th>Código</Th>
                    <Th>Producto</Th>
                    <Th isNumeric>Cantidad</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {detalles.map((it) => (
                    <Tr key={it.id} _hover={{ bg: rowHoverBg }}>
                      <Td>{it.codigo}</Td>
                      <Td>{it.nombreProducto}</Td>
                      <Td isNumeric>{it.cantidad}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
            {/* 
            <Divider borderColor={borderColor} />

            <Flex align="center" gap={2}>
              <Badge colorScheme="teal" bg={badgeBgUser}>
                Entrega
              </Badge>
              <Icon as={FaCalendarAlt} />
              <Text fontWeight="bold">{fechaUser}</Text>
            </Flex>

            <Divider borderColor={borderColor} />

            <Flex align="flex-start" gap={2}>
              <Icon as={FaCommentDots} color="orange.400" />
              <Box>
                <Text fontWeight="semibold" mb={1}>
                  Comentario
                </Text>
                <Text color={commentTextC}>
                  {pedido.comentario?.trim() || "— sin comentario —"}
                </Text>
              </Box>
            </Flex> */}
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
