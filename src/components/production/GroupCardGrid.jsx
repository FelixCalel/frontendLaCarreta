import PropTypes from "prop-types";
import {
  SimpleGrid,
  Box,
  Text,
  Badge,
  useColorModeValue,
} from "@chakra-ui/react";
import { CheckCircleIcon, WarningIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";

export const GroupCardGrid = ({ pedidos }) => {
  const navigate = useNavigate();

  const cardBg = useColorModeValue("gray.100", "gray.700");
  const cardHoverBg = useColorModeValue("gray.200", "gray.600");
  const subTextColor = useColorModeValue("gray.600", "gray.400");

  return (
    <SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 5 }} spacing={4} mb={6}>
      {pedidos.map(({ pedidoId, tienda, pais, items }) => {
        const total = items.length;
        const doneCount = items.filter((i) => i.completo).length;
        const anyProgress = items.some((i) => Number(i.cantidad ?? 0) > 0);
        const status =
          doneCount === total
            ? "completed"
            : anyProgress
            ? "in-progress"
            : "pending";

        const Icon = status === "completed" ? CheckCircleIcon : WarningIcon;
        const iconColor = status === "completed" ? "green.400" : "yellow.400";

        return (
          <Box
            key={pedidoId}
            position="relative"
            p={4}
            bg={cardBg}
            borderRadius="md"
            cursor="pointer"
            _hover={{ bg: cardHoverBg }}
            transition="background 0.15s"
            onClick={() => navigate(`/despacho/orden/${pedidoId}`)}
          >
            <Box position="absolute" top={2} right={2}>
              <Icon boxSize={5} color={iconColor} />
            </Box>

            <Text fontSize="lg" fontWeight="bold" mb={1}>
              Pedido #{pedidoId}
            </Text>

            <Text fontSize="sm">{tienda}</Text>

            <Text fontSize="xs" color={subTextColor} mb={2}>
              {pais}
            </Text>

            <Badge colorScheme="blue">
              {items.length} ÍTEM{items.length > 1 ? "S" : ""}
            </Badge>
          </Box>
        );
      })}
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
