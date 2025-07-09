// src/components/supervisor/OrderCard.jsx
import PropTypes from "prop-types";
import { Box, Checkbox, Text, Badge } from "@chakra-ui/react";

/**
 * pedido: { id, correlativo, cliente, fechaEntrega, estado }
 */
export const OrderCard = ({ pedido, isSelected, onToggle }) => {
  // Color del badge según estado
  const colorScheme =
    pedido.estado === "Completado"
      ? "green"
      : pedido.estado === "En Proceso"
      ? "yellow"
      : "gray";

  return (
    <Box
      w="180px"
      p={3}
      bg={isSelected ? "green.50" : "gray.100"}
      border="1px solid"
      borderColor="gray.300"
      borderRadius="md"
      cursor="pointer"
      _hover={{ shadow: "md", transform: "scale(1.02)" }}
      transition="all 0.2s"
      onClick={onToggle}
    >
      <Checkbox
        isChecked={isSelected}
        pointerEvents="none"
        colorScheme="green"
        mb={2}
      />
      <Badge colorScheme={colorScheme} variant="subtle" mb={2}>
        {pedido.estado}
      </Badge>
      <Text fontWeight="bold" noOfLines={1}>
        {pedido.correlativo}
      </Text>
      <Text fontSize="sm" noOfLines={1} color="gray.600">
        {pedido.cliente}
      </Text>
      <Text fontSize="xs" mt={2} color="gray.500">
        {new Date(pedido.fechaEntrega).toLocaleDateString()}
      </Text>
    </Box>
  );
};

OrderCard.propTypes = {
  pedido: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    correlativo: PropTypes.string.isRequired,
    cliente: PropTypes.string.isRequired,
    fechaEntrega: PropTypes.string.isRequired, // asume ISO date string
    estado: PropTypes.string.isRequired,
  }).isRequired,
  isSelected: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
};
