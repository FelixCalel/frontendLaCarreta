import PropTypes from "prop-types";
import { Box, Checkbox, Text, Badge } from "@chakra-ui/react";

/**
 * pedido: {
 *   id,
 *   productoNombre,
 *   tienda,
 *   pais,
 *   cantidadUnidad,
 *   unidadMedida,
 *   completo
 * }
 */
export const OrderCard = ({ pedido, isSelected, onToggle }) => {
  const colorScheme = pedido.completo ? "green" : "gray";
  const labelEstado = pedido.completo ? "Completado" : "Pendiente";

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
      <Checkbox isChecked={isSelected} pointerEvents="none" mb={2} />
      <Badge colorScheme={colorScheme} variant="subtle" mb={2}>
        {labelEstado}
      </Badge>
      <Text fontWeight="bold" noOfLines={1}>
        {pedido.productoNombre}
      </Text>
      <Text fontSize="sm" noOfLines={1} color="gray.600">
        {pedido.tienda}
      </Text>
      <Text fontSize="xs" mt={2} color="gray.500">
        {pedido.cantidadUnidad}{" "}
        {pedido.unidadMedida && `(${pedido.unidadMedida})`}
      </Text>
    </Box>
  );
};

OrderCard.propTypes = {
  pedido: PropTypes.shape({
    id: PropTypes.number.isRequired,
    productoNombre: PropTypes.string.isRequired,
    tienda: PropTypes.string.isRequired,
    pais: PropTypes.string,
    cantidadUnidad: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    unidadMedida: PropTypes.string,
    completo: PropTypes.bool.isRequired,
  }).isRequired,
  isSelected: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
};
