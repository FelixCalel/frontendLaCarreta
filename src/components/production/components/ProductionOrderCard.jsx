import PropTypes from "prop-types";
import {
  Box,
  Flex,
  VStack,
  HStack,
  Text,
  Heading,
  Icon,
  Badge,
  Divider,
} from "@chakra-ui/react";
import { CheckCircleIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";

export const ProductionOrderCard = ({
  group,
  cardBg,
  cardBorder,
  cardHoverShadow,
}) => {
  const navigate = useNavigate();

  const doneCount = group.items.filter((i) => i.completo).length;
  const anyProgress = group.items.some((i) => Number(i.cantidad ?? 0) > 0);
  const allDone = doneCount === group.items.length;

  let statusColor = "yellow.400";
  if (allDone) {
    statusColor = "green.400";
  } else if (anyProgress) {
    statusColor = "blue.400";
  }

  const deudorCode = group.deudorCodigo || "N/A";

  return (
    <Box
      position="relative"
      bg={cardBg}
      border="1px solid"
      borderColor={cardBorder}
      borderRadius="lg"
      overflow="hidden"
      cursor="pointer"
      transition="all 0.2s"
      _hover={{
        shadow: cardHoverShadow,
        transform: "translateY(-2px)",
      }}
      onClick={() => navigate(`/mesa/produccion/${group.pedidoId}`)}
      role="group"
    >
      <Box h="4px" bg={statusColor} w="100%" />
      <Box p={4}>
        <Flex justify="space-between" align="start" mb={2}>
          <VStack align="start" spacing={0}>
            <Text
              fontSize="xs"
              color="gray.500"
              fontWeight="bold"
              letterSpacing="wide"
              textTransform="uppercase"
            >
              Pedido #{group.pedidoId}
            </Text>
            <Heading size="sm" noOfLines={2} title={group.tienda}>
              {group.tienda}
            </Heading>
          </VStack>
          <Icon
            as={
              allDone || anyProgress ? CheckCircleIcon : CheckCircleIcon
            }
            color={statusColor}
            boxSize={5}
          />
        </Flex>

        <HStack mt={2} mb={3}>
          <Badge colorScheme="blue" variant="subtle" fontSize="0.7em">
            {deudorCode}
          </Badge>
          <Badge variant="outline" fontSize="0.7em">
            {group.pais}
          </Badge>
        </HStack>

        <Divider mb={3} borderColor="gray.100" />

        <Flex justify="space-between" align="center">
          <Text fontSize="xs" color="gray.500">
            {doneCount} / {group.items.length} Completados
          </Text>
          <Badge
            colorScheme={allDone ? "green" : "gray"}
            variant="solid"
            borderRadius="full"
            px={2}
          >
            {group.items.length} ÍTEM{group.items.length !== 1 ? "S" : ""}
          </Badge>
        </Flex>
      </Box>
    </Box>
  );
};

ProductionOrderCard.propTypes = {
  group: PropTypes.object.isRequired,
  cardBg: PropTypes.string.isRequired,
  cardBorder: PropTypes.string.isRequired,
  cardHoverShadow: PropTypes.string.isRequired,
};

