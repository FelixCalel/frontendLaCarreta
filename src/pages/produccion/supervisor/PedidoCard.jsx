import PropTypes from "prop-types";
import { Box, Text, VStack, Badge } from "@chakra-ui/react";

export const PedidoCard = ({ pedido, onClick }) => {
  return (
    <Box
      borderWidth="1px"
      borderRadius="md"
      p={4}
      bg={pedido.completo ? "green.50" : "gray.100"}
      cursor="pointer"
      boxShadow="md"
      transition="all 0.2s"
      _hover={{ boxShadow: "xl", transform: "scale(1.02)" }}
      onClick={onClick}
    >
      <VStack align="start" spacing={2}>
        <Text fontWeight="bold">Producto:</Text>
        <Text>{pedido.productoNombre}</Text>

        <Text fontWeight="bold">Cliente:</Text>
        <Text>{pedido.tienda}</Text>

        <Text fontWeight="bold">Cantidad procesada:</Text>
        <Text>{pedido.cantidadProcesada}</Text>

        <Text fontWeight="bold">Solicitud:</Text>
        <Text>{pedido.solicitudVenta}</Text>

        <Badge colorScheme={pedido.completo ? "green" : "yellow"}>
          {pedido.completo ? "Completado" : "Pendiente"}
        </Badge>
      </VStack>
    </Box>
  );
};

PedidoCard.propTypes = {
  pedido: PropTypes.shape({
    id: PropTypes.number.isRequired,
    productoNombre: PropTypes.string.isRequired,
    tienda: PropTypes.string.isRequired,
    pais: PropTypes.string,
    cantidadProcesada: PropTypes.number.isRequired,
    solicitudVenta: PropTypes.number.isRequired,
    completo: PropTypes.bool.isRequired,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
};
