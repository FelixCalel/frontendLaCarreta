import { Box, Text, Divider } from "@chakra-ui/react";

export default function usuarioNotificacion({ pedidos }) {
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
        Tienes <strong>{pedidos.length}</strong> pedidos pendientes.
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
          En Proceso: {pedidos.filter(pedido => pedido.estadoId === 1).length}
        </Text>
        <Text fontSize="sm" color="red.600">
          Cancelados: {pedidos.filter(pedido => pedido.estadoId === 4).length}
        </Text>
      </Box>
    </Box>
  );
}
