import PropTypes from "prop-types";
import { Box, Checkbox, Text, Badge } from "@chakra-ui/react";

export const PedidoCard = ({ pedido, isSelected, onToggle }) => (
  <Box
    w="200px"
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
    <Text fontWeight="bold" fontSize="lg">
      Pedido #{pedido.pedidoId}
    </Text>
    <Text fontSize="sm" color="gray.600" noOfLines={1}>
      {pedido.tienda}
    </Text>
    <Text fontSize="sm" color="gray.600" noOfLines={1}>
      {pedido.pais}
    </Text>
    <Badge mt={2} colorScheme="blue">
      {pedido.items.length} ítems
    </Badge>
  </Box>
);

PedidoCard.propTypes = {
  pedido: PropTypes.shape({
    pedidoId: PropTypes.number.isRequired,
    tienda: PropTypes.string.isRequired,
    pais: PropTypes.string.isRequired,
    items: PropTypes.array.isRequired,
  }).isRequired,
  isSelected: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
};
