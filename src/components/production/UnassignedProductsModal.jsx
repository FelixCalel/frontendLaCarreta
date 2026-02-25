import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Text,
  Box,
  useColorModeValue,
} from "@chakra-ui/react";
import { useGetUnassignedOrdersQuery } from "../../services/pedidoProductionApi";

export const UnassignedProductsModal = ({ isOpen, onClose }) => {
  const { data: unassignedGroups = [], isLoading } =
    useGetUnassignedOrdersQuery();
  const theadBg = useColorModeValue("gray.50", "gray.700");

  const unassignedItems = unassignedGroups.flatMap((g) =>
    g.items.map((item) => ({
      ...item,
      pedidoId: g.pedidoId,
      tienda: g.tienda,
      deudorCodigo: g.deudorCodigo,
      deudorNombre: g.deudorNombre,
    })),
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="5xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader bg="orange.500" color="white">
          <Text fontWeight="bold">⚠️ Productos Sin Asignar en Mesa</Text>
        </ModalHeader>
        <ModalCloseButton color="white" />
        <ModalBody p={0}>
          {isLoading ? (
            <Text p={6} textAlign="center">
              Cargando productos huérfanos...
            </Text>
          ) : unassignedItems.length === 0 ? (
            <Text p={6} textAlign="center">
              No hay productos sin asignar en esta etapa. Todo está fluyendo
              bien.
            </Text>
          ) : (
            <Box maxH="60vh" overflowY="auto">
              <Table variant="simple" size="sm">
                <Thead bg={theadBg} position="sticky" top={0} zIndex={1}>
                  <Tr>
                    <Th>Pedido</Th>
                    <Th>Cliente</Th>
                    <Th>Item</Th>
                    <Th>Cant. / Unidad</Th>
                    <Th>Estado</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {unassignedItems.map((item, idx) => (
                    <Tr key={`${item.id}-${idx}`}>
                      <Td fontWeight="bold">#{item.pedidoId}</Td>
                      <Td>
                        {item.deudorCodigo
                          ? `${item.deudorCodigo} - ${item.deudorNombre}`
                          : item.tienda}
                      </Td>
                      <Td>
                        <Text fontWeight="semibold">
                          {item.itemCode || "N/A"}
                        </Text>
                        <Text fontSize="xs" color="gray.500">
                          {item.productoNombre || "N/A"}
                        </Text>
                      </Td>
                      <Td>
                        {item.cantidadUnidad} {item.unidadMedida || "N/A"}
                      </Td>
                      <Td>
                        <Badge colorScheme="red">Falta Asignar Área</Badge>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          )}
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Cerrar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
