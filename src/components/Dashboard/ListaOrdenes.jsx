import { Box, Heading, Table, Thead, Tbody, Tr, Th, Td, Badge } from '@chakra-ui/react';

export const ListaOrdenes = ({ orders }) => {
  return (
    <Box boxShadow="md" p="6" rounded="md" bg="white">
      <Heading size="md" mb="4">Órdenes de Compra</Heading>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Proveedor</Th>
            <Th isNumeric>Monto</Th>
            <Th>Estado</Th>
          </Tr>
        </Thead>
        <Tbody>
          {orders.map((order) => (
            <Tr key={order.id}>
              <Td>{order.id}</Td>
              <Td>{order.proveedor}</Td>
              <Td isNumeric>${order.monto}</Td>
              <Td><Badge colorScheme={order.estado === 'Completado' ? 'green' : 'orange'}>{order.estado}</Badge></Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};
