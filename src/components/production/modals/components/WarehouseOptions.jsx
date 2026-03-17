import PropTypes from "prop-types";
import {
  Box,
  Flex,
  Text,
  Spinner,
  Button,
  VStack,
  HStack,
} from "@chakra-ui/react";
import { WarningTwoIcon } from "@chakra-ui/icons";

export const WarehouseOptions = ({
  isFetchingStock,
  stockData,
  selectedItem,
  subTextColor,
  almacenes,
  almacenId,
  setAlmacenId,
  greenHoverBg,
  isStockError,
  isStockSuccess,
}) => {
  const sapRows = Array.isArray(stockData) ? stockData : [];
  const matchedOptions = sapRows
    .map((stock) => {
      const matchedWarehouse = almacenes?.find(
        (warehouse) => warehouse.name === stock.almacen,
      );
      if (!matchedWarehouse) return null;
      return { stock, matchedWarehouse };
    })
    .filter(Boolean);

  const notFoundInSAP =
    !isFetchingStock &&
    selectedItem &&
    (isStockError ||
      (isStockSuccess &&
        (!Array.isArray(stockData) ||
          sapRows.length === 0 ||
          matchedOptions.length === 0)));

  if (!selectedItem || (!isFetchingStock && !isStockError && !isStockSuccess)) {
    return null;
  }

  return (
    <Box w="100%">
      <Flex align="center" mb={2}>
        <Text fontSize="sm" fontWeight="semibold" color={subTextColor}>
          Opciones de Almacén desde SAP:
        </Text>
        {isFetchingStock && (
          <Spinner
            size="sm"
            ml={3}
            thickness="2px"
            color="blue.500"
            emptyColor="gray.200"
          />
        )}
      </Flex>
      {notFoundInSAP && (
        <HStack
          spacing={2}
          px={3}
          py={2}
          borderRadius="md"
          bg="orange.50"
          borderWidth="1px"
          borderColor="orange.300"
          _dark={{ bg: "orange.900", borderColor: "orange.600" }}
        >
          <WarningTwoIcon color="orange.400" boxSize={4} flexShrink={0} />
          <Text
            fontSize="xs"
            color="orange.700"
            fontWeight="medium"
            _dark={{ color: "orange.200" }}
          >
            Este ítem no se encontró en SAP. No hay datos de stock disponibles.
          </Text>
        </HStack>
      )}
      {!isFetchingStock && matchedOptions.length > 0 && (
        <Flex wrap="wrap" gap={2}>
          {matchedOptions.map(({ stock, matchedWarehouse }) => {
            const s = stock;

            const hasStock = Number(s.stock) > 0;
            const isSelected = almacenId === matchedWarehouse.id.toString();

            return (
              <Button
                key={s.almacen}
                size="sm"
                variant={isSelected ? "solid" : hasStock ? "outline" : "ghost"}
                colorScheme={isSelected ? "blue" : hasStock ? "green" : "gray"}
                onClick={() => setAlmacenId(matchedWarehouse.id.toString())}
                opacity={hasStock ? 1 : 0.6}
                borderWidth={isSelected ? "2px" : "1px"}
                _hover={{
                  bg: hasStock && !isSelected ? greenHoverBg : undefined,
                }}
                h="auto"
                py={1}
                px={3}
              >
                <VStack spacing={0} align="center">
                  <Text fontWeight="bold" fontSize="xs">
                    {s.almacen}
                  </Text>
                  <Text fontSize="2xs">
                    Stock: {Number(s.stock).toFixed(2)}
                  </Text>
                </VStack>
              </Button>
            );
          })}
        </Flex>
      )}
    </Box>
  );
};

WarehouseOptions.propTypes = {
  isFetchingStock: PropTypes.bool.isRequired,
  stockData: PropTypes.array,
  selectedItem: PropTypes.object,
  subTextColor: PropTypes.string.isRequired,
  almacenes: PropTypes.array,
  almacenId: PropTypes.string.isRequired,
  setAlmacenId: PropTypes.func.isRequired,
  greenHoverBg: PropTypes.string.isRequired,
  isStockError: PropTypes.bool,
  isStockSuccess: PropTypes.bool,
};
