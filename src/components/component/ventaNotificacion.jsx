import { Box, Text, Divider } from "@chakra-ui/react";

export default function ventaNotificacion({ pedidos }) {
  const pedidosVentas = pedidos.filter(pedido => pedido.estadoId === 1); // Ejemplo: Pedidos en proceso para ventas

  return (
    <Box
      pos="absolute"
      top="60px"
      right="20px"
      w="320px"
      bg="white"
      boxShadow="lg"
      p={4}
      borderRadius="lg"
      zIndex="1000"
      backdropFilter="blur(10px)"
      border="1px solid #E2E8F0"
    >
      <Text fontWeight="medium" textAlign="center" color="gray.700" fontSize="sm">
        Tienes <strong>{pedidosVentas.length}</strong> pedidos en proceso.
      </Text>
      <Divider my={3} />
      <Text fontSize="md" color="gray.700" fontWeight="bold">
        Estado de tus pedidos:
      </Text>
      <Box mt={2}>
        <Text fontSize="sm" color="green.600">
          Aprobados: {pedidos.filter(pedido => pedido.estadoId === 3).length}
        </Text>
        <Text fontSize="sm" color="yellow.600">
          En Proceso: {pedidosVentas.length}
        </Text>
        <Text fontSize="sm" color="red.600">
          Cancelados: {pedidos.filter(pedido => pedido.estadoId === 4).length}
        </Text>
      </Box>
    </Box>
  );
}
