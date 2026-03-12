import { Box, Flex, VStack, Heading, Icon, Badge, HStack, Divider, Text, useColorModeValue } from "@chakra-ui/react";
import { CheckCircleIcon } from "@chakra-ui/icons";
import PropTypes from "prop-types";

export const SupervisorOrderCard = ({ g, onClick }) => {
  const cardBg = useColorModeValue("white", "gray.700");
  const cardBorder = useColorModeValue("gray.200", "gray.600");
  const cardHoverShadow = useColorModeValue("lg", "dark-lg");
  const doneCount = g.items.filter((i) => i.completo).length;
  const allDone = doneCount === g.items.length;
  const statusColor = allDone ? "green.400" : "yellow.400";
  const deudorCode = g.deudorCodigo || "N/A";

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
      onClick={onClick}
      role="group"
    >
      <Box h="4px" bg={statusColor} w="100%" />
      <Box p={4}>
        <Flex justify="space-between" align="start" mb={2}>
          <VStack align="start" spacing={0}>
            <Text fontSize="xs" color="gray.500" fontWeight="bold" letterSpacing="wide" textTransform="uppercase">
              Pedido #{g.pedidoId}
            </Text>
            <Heading size="sm" noOfLines={2} title={g.tienda}>
              {g.tienda}
            </Heading>
          </VStack>
          <Icon as={CheckCircleIcon} color={statusColor} boxSize={5} />
        </Flex>

        <HStack mt={2} mb={3}>
          <Badge colorScheme="blue" variant="subtle" fontSize="0.7em">
            DEU: {deudorCode}
          </Badge>
          <Badge variant="outline" fontSize="0.7em">
            {g.pais}
          </Badge>
        </HStack>

        <Divider mb={3} borderColor="gray.100" />

        <Flex justify="space-between" align="center">
          <Text fontSize="xs" color="gray.500">
            {doneCount} / {g.items.length} Completados
          </Text>
          <Badge colorScheme={allDone ? "green" : "gray"} variant="solid" borderRadius="full" px={2}>
            {g.items.length} ÍTEM{g.items.length !== 1 ? "S" : ""}
          </Badge>
        </Flex>
      </Box>
    </Box>
  );
};

SupervisorOrderCard.propTypes = {
  g: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
};
