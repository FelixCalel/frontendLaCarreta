import PropTypes from "prop-types";
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
  Flex,
  Stack,
  Icon,
  Divider,
  VStack,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { FaRegCommentDots, FaRegClock } from "react-icons/fa";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const BloqueComentario = ({ titulo, fecha, comentario, iconColor }) => {
  const border = useColorModeValue("gray.200", "gray.600");
  const bg = useColorModeValue("gray.50", "gray.700");
  const colorTxt = useColorModeValue("gray.700", "gray.300");

  return (
    <Box
      flex="1"
      minW={{ base: "100%", md: "260px" }}
      maxW={{ base: "100%", md: "320px" }}
      bg={bg}
      borderWidth="1px"
      borderColor={border}
      rounded="md"
      p={4}
    >
      <Flex align="center" mb={2} gap={2}>
        <Icon as={FaRegCommentDots} color={iconColor} />
        <Text fontWeight="semibold">{titulo}</Text>
      </Flex>

      {fecha && (
        <Flex align="center" mb={2} gap={2}>
          <Icon as={FaRegClock} color="teal.400" />
          <Text fontSize="sm">
            {format(new Date(fecha), "dd MMM yyyy HH:mm", { locale: es })}
          </Text>
        </Flex>
      )}

      <Text color={colorTxt}>
        {comentario?.trim() ? comentario : "— sin comentario —"}
      </Text>
    </Box>
  );
};

BloqueComentario.propTypes = {
  titulo: PropTypes.string.isRequired,
  fecha: PropTypes.string,
  comentario: PropTypes.string,
  iconColor: PropTypes.string,
};

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

  if (!pedido) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={{ base: "full", md: "2xl", lg: "4xl" }}
      motionPreset="slideInBottom"
      isCentered
    >
      <ModalOverlay bg="blackAlpha.600" />

      <ModalContent
        maxH="calc(100vh - 2rem)"
        overflowY="auto"
        mx={{ base: 2, md: "auto" }}
      >
        <ModalHeader textAlign="center">
          Detalles del Pedido&nbsp;
          <Text as="span" fontWeight="bold">
            #{pedido.id}
          </Text>
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          {isLoading ? (
            <Flex justify="center" py={10}>
              <Spinner size="lg" />
            </Flex>
          ) : detalles.length ? (
            <>
              <Box display={{ base: "none", md: "block" }}>
                <Table
                  variant="simple"
                  colorScheme={tableColorScheme}
                  size="sm"
                >
                  <Thead>
                    <Tr>
                      <Th>Código</Th>
                      <Th>Producto</Th>
                      <Th isNumeric>Cantidad</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {detalles.map((d) => (
                      <Tr key={d.id}>
                        <Td>{d.codigo || "—"}</Td>
                        <Td>{d.nombreProducto}</Td>
                        <Td isNumeric>{d.cantidad}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
              <Box display={{ base: "block", md: "none" }}>
                <VStack spacing={3} align="stretch">
                  {detalles.map((d) => (
                    <Box
                      key={d.id}
                      p={3}
                      borderWidth="1px"
                      borderColor={cardBorderColor}
                      rounded="md"
                      bg={cardBg}
                      shadow="sm"
                    >
                      <Text>
                        <strong>Código:</strong> {d.codigo || "—"}
                      </Text>
                      <Text>
                        <strong>Producto:</strong> {d.nombreProducto}
                      </Text>
                      <Text>
                        <strong>Cantidad:</strong> {d.cantidad}
                      </Text>
                    </Box>
                  ))}
                </VStack>
              </Box>
            </>
          ) : (
            <Box textAlign="center" color={emptyColor} py={8}>
              No hay detalles disponibles para este pedido.
            </Box>
          )}
          <Divider mb={4} />
          <Stack
            direction={{ base: "column", md: "row" }}
            spacing={6}
            justify="center"
            mb={6}
          >
            <BloqueComentario
              titulo="Comentario del Display"
              fecha={pedido.fechaOrdenDisplay}
              comentario={pedido.comentarioDisplay}
              iconColor="orange.300"
            />
            <BloqueComentario
              titulo="Comentario Ventas"
              fecha={pedido.fechaOrden}
              comentario={pedido.comentario}
              iconColor="teal.500"
            />
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="green" variant="outline" onClick={onClose}>
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
    comentario: PropTypes.string,
    comentarioDisplay: PropTypes.string,
    fechaOrden: PropTypes.string,
    fechaOrdenDisplay: PropTypes.string,
  }),
  detalles: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      codigo: PropTypes.string,
      nombreProducto: PropTypes.string.isRequired,
      cantidad: PropTypes.number.isRequired,
    })
  ),
  isLoading: PropTypes.bool,
};

DetallesPedidoModal.defaultProps = {
  pedido: null,
  detalles: [],
  isLoading: false,
};

export default DetallesPedidoModal;
