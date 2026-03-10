import PropTypes from "prop-types";
import { Box, VStack, HStack, Text, Badge } from "@chakra-ui/react";
import { WarningIcon } from "@chakra-ui/icons";

export const StockInfoCard = ({
  selectedItem,
  almacenId,
  stockStatus,
  stockRedBg,
  stockGreenBg,
  stockGrayBg,
  isFetchingStock,
  currentStockInfo,
  selectedWarehouseName,
  stockOnHand,
  stockCommited,
  reqQty,
}) => {
  if (!selectedItem || !almacenId) return null;

  return (
    <Box
      p={4}
      borderWidth="1px"
      borderRadius="lg"
      borderColor={`${stockStatus}.300`}
      bg={
        stockStatus === "red"
          ? stockRedBg
          : stockStatus === "green"
            ? stockGreenBg
            : stockGrayBg
      }
      w="100%"
      shadow="sm"
      transition="all 0.2s"
    >
      {isFetchingStock ? (
        <Text
          color={`${stockStatus}.500`}
          fontWeight="semibold"
          fontSize="sm"
        >
          Consultando stock en SAP...
        </Text>
      ) : currentStockInfo ? (
        <VStack align="start" spacing={2}>
          <Text
            color={`${stockStatus}.600`}
            fontWeight="bold"
            fontSize="md"
          >
            Disponibilidad en Almacén ({selectedWarehouseName})
          </Text>
          <HStack spacing={4}>
            <Badge
              colorScheme={stockStatus}
              px={2}
              py={1}
              borderRadius="md"
              fontSize="sm"
            >
              Stock: {parseFloat(stockOnHand).toFixed(2)}
            </Badge>
            <Badge
              colorScheme="orange"
              px={2}
              py={1}
              borderRadius="md"
              fontSize="sm"
            >
              Comprometido: {parseFloat(stockCommited).toFixed(2)}
            </Badge>
          </HStack>
          {reqQty > 0 && stockOnHand < reqQty && (
            <Text
              color="red.500"
              fontSize="sm"
              fontWeight="semibold"
              display="flex"
              alignItems="center"
            >
              <WarningIcon mr={2} /> Stock insuficiente para requerir {reqQty}
            </Text>
          )}
        </VStack>
      ) : (
        <Text color="red.500" fontSize="sm" fontWeight="bold">
          No hay información de stock para este ítem en el almacén seleccionado.
        </Text>
      )}
    </Box>
  );
};

StockInfoCard.propTypes = {
  selectedItem: PropTypes.object,
  almacenId: PropTypes.string,
  stockStatus: PropTypes.string.isRequired,
  stockRedBg: PropTypes.string.isRequired,
  stockGreenBg: PropTypes.string.isRequired,
  stockGrayBg: PropTypes.string.isRequired,
  isFetchingStock: PropTypes.bool.isRequired,
  currentStockInfo: PropTypes.object,
  selectedWarehouseName: PropTypes.string,
  stockOnHand: PropTypes.number.isRequired,
  stockCommited: PropTypes.number.isRequired,
  reqQty: PropTypes.number.isRequired,
};

export default StockInfoCard;
