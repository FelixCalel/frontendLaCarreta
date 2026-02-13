import PropTypes from "prop-types";
import { Box, Text, Badge, useColorModeValue, Icon } from "@chakra-ui/react";
import { CheckIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import { FaTruckLoading } from "react-icons/fa";

const countStage2 = (items) => items.filter((it) => it.etapaId === 3).length;

export const GroupCard = ({ group }) => {
  const { pedidoId, tienda, pais, items } = group;
  const navigate = useNavigate();
  const stage2Items = countStage2(items);
  const allStage2Complete = items
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
      {allStage2Complete && (
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
        <Icon as={FaTruckLoading} boxSize={8} color="gray.500" />
      </Box>

      <Text fontWeight="bold" noOfLines={1}>
        Pedido&nbsp;#{pedidoId}
      </Text>
      <Text fontSize="sm" color="gray.600" noOfLines={1}>
        {tienda}
      </Text>
      <Text fontSize="sm" color="gray.600" noOfLines={1}>
        {pais}
      </Text>

      <Badge mt={2} px={2} colorScheme="green">
        {stage2Items} {stage2Items === 1 ? "ítem" : "ítems"} en etapa&nbsp;3
      </Badge>
    </Box>
  );
};

GroupCard.propTypes = {
  group: PropTypes.shape({
    pedidoId: PropTypes.number.isRequired,
    tienda: PropTypes.string.isRequired,
    pais: PropTypes.string.isRequired,
    items: PropTypes.array.isRequired,
  }).isRequired,
};
