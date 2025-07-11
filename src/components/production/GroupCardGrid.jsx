import PropTypes from "prop-types";
import {
  SimpleGrid,
  Box,
  Text,
  Badge,
  useColorModeValue,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export const GroupCardGrid = ({ pedidos }) => {
  const navigate = useNavigate();

  const cardBg = useColorModeValue("gray.100", "gray.700");
  const cardHoverBg = useColorModeValue("gray.200", "gray.600");
  const subTextColor = useColorModeValue("gray.600", "gray.400");

  return (
    <SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 5 }} spacing={4} mb={6}>
      {pedidos.map(({ pedidoId, tienda, pais, items }) => (
        <Box
          key={pedidoId}
          p={4}
          bg={cardBg}
          borderRadius="md"
          cursor="pointer"
          _hover={{ bg: cardHoverBg }}
          transition="background 0.15s"
          onClick={() => navigate(`/despacho/orden/${pedidoId}`)}
        >
          <Text fontSize="lg" fontWeight="bold">
            Pedido #{pedidoId}
          </Text>

          <Text>{tienda}</Text>

          <Text fontSize="sm" color={subTextColor}>
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
