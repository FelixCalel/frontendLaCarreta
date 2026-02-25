import PropTypes from "prop-types";
import { Box, Text, Badge, useColorModeValue, Icon } from "@chakra-ui/react";
import { CheckIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";

const countStage3 = (items) => items.filter((it) => it.etapaId === 3).length;

export const GroupCard = ({ group, IconComponent, title }) => {
  const { pedidoId, items } = group;
  const navigate = useNavigate();
  const stage3Items = countStage3(items);
  const allStage3Complete = items
    .filter((it) => it.etapaId === 3)
    .every((it) => it.completo);

  const cardBg = useColorModeValue("gray.100", "gray.700");
  const hoverBg = useColorModeValue("gray.200", "gray.600");
  const accent = useColorModeValue("green.500", "green.300");
  const iconBg = useColorModeValue("gray.200", "gray.600");

  return (
    <Box
      p={4}
      bg={cardBg}
      borderRadius="md"
      cursor="pointer"
      onClick={() => navigate(`/detalleFabricacion/${pedidoId}`)}
      _hover={{
        bg: hoverBg,
        transform: "translateY(-2px)",
        boxShadow: "lg",
      }}
      transition="all 0.15s"
      position="relative"
    >
      {allStage3Complete && (
        <Icon
          as={CheckIcon}
          bg={accent}
          color="white"
          borderRadius="full"
          boxSize={4}
          p="2px"
          position="absolute"
          top={1.5}
          left={1.5}
          boxShadow="0 0 0 2px white"
        />
      )}

      <Box
        w="full"
        h="80px"
        display="flex"
        alignItems="center"
        justifyContent="center"
        bg={iconBg}
        borderRadius="sm"
        mb={3}
      >
        <Icon as={IconComponent} boxSize={8} color="gray.500" />
      </Box>

      <Text fontWeight="bold" noOfLines={1}>
        {title}
      </Text>
      <Text fontSize="sm" color="gray.600">
        Pedido&nbsp;#{pedidoId}
      </Text>

      <Badge mt={2} px={2} colorScheme="green">
        {stage3Items} {stage3Items === 1 ? "ítem" : "ítems"} en etapa&nbsp;3
      </Badge>
    </Box>
  );
};

GroupCard.propTypes = {
  group: PropTypes.shape({
    pedidoId: PropTypes.number.isRequired,
    items: PropTypes.array.isRequired,
  }).isRequired,
  IconComponent: PropTypes.elementType.isRequired,
  title: PropTypes.string.isRequired,
};
