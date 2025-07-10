import PropTypes from "prop-types";
import { SimpleGrid, Box, Text, Badge } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export const GroupCardGrid = ({ pedidos }) => {
  const navigate = useNavigate();

  return (
    <SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 5 }} spacing={4} mb={6}>
      {pedidos.map(({ pedidoId, tienda, pais, items }) => (
        <Box
          key={pedidoId}
          p={4}
          bg="gray.100"
          borderRadius="md"
          cursor="pointer"
          _hover={{ bg: "gray.200" }}
          onClick={() => navigate(`/mesa/produccion/${pedidoId}`)}
        >
          <Text fontSize="lg" fontWeight="bold">
            Pedido #{pedidoId}
          </Text>
          <Text>{tienda}</Text>
          <Text fontSize="sm" color="gray.600">
            {pais}
          </Text>
          <Badge mt={2} colorScheme="blue">
            {items.length} ÍTEMS
          </Badge>
        </Box>
      ))}
    </SimpleGrid>
  );
};

GroupCardGrid.propTypes = {
  pedidos: PropTypes.arrayOf(
    PropTypes.shape({
      pedidoId: PropTypes.number.isRequired,
      tienda: PropTypes.string.isRequired,
      pais: PropTypes.string.isRequired,
      items: PropTypes.array.isRequired,
    })
  ).isRequired,
};
