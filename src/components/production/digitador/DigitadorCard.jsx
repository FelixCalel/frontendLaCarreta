import PropTypes from "prop-types";
import { Box, Text, Badge, useColorModeValue, Icon } from "@chakra-ui/react";
import { CheckIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import { FaTruckLoading } from "react-icons/fa";

const countStage = (items, stageId) => items.filter((it) => it.etapaId === stageId).length;

export const GroupCard = ({ group, IconComponent, title }) => {
  const { pedidoId, tienda, pais, items } = group;
  const navigate = useNavigate();

  // Pick first item's SAP info if available
  const docNum = items[0]?.docNum;
  const docEntry = items[0]?.docEntry;
  const currentEtapaId = items[0]?.etapaId ?? 3;

  const stageItemsCount = countStage(items, currentEtapaId);
  const allComplete = items
    .filter((it) => it.etapaId === currentEtapaId)
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
      {allComplete && (
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
        <Icon as={IconComponent || FaTruckLoading} boxSize={8} color="gray.500" />
      </Box>

      <Text fontWeight="bold" noOfLines={1}>
        {title || `Pedido #${pedidoId}`}
      </Text>
      <Text fontSize="sm" color="gray.600" noOfLines={1}>
        {tienda}
      </Text>
      <Text fontSize="sm" color="gray.600" noOfLines={1}>
        {pais}
      </Text>

      {docNum && (
        <Text fontSize="xs" fontWeight="bold" color="blue.500" mt={1}>
          SAP: {docNum} {docEntry ? `(${docEntry})` : ""}
        </Text>
      )}

      <Badge mt={2} px={2} colorScheme={currentEtapaId === 5 ? "blue" : "green"}>
        {stageItemsCount} {stageItemsCount === 1 ? "ítem" : "ítems"} en{" "}
        {currentEtapaId === 5 ? "SAP / Finalizado" : `etapa ${currentEtapaId}`}
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
  IconComponent: PropTypes.elementType,
  title: PropTypes.string,
};
