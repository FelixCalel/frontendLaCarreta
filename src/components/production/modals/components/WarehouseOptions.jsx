import PropTypes from "prop-types";
import { Box, Flex, Text, Spinner, Button, VStack } from "@chakra-ui/react";

export const WarehouseOptions = ({
  isFetchingStock,
  stockData,
  selectedItem,
  subTextColor,
  almacenes,
  almacenId,
  setAlmacenId,
  greenHoverBg,
}) => {
  if (!(isFetchingStock || (stockData && Array.isArray(stockData))) || !selectedItem) {
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
      {!isFetchingStock && stockData && (
        <Flex wrap="wrap" gap={2}>
          {stockData.map((s) => {
            const matchedWarehouse = almacenes?.find(
              (a) => a.name === s.almacen,
            );
            if (!matchedWarehouse) return null;

            const hasStock = Number(s.stock) > 0;
            const isSelected = almacenId === matchedWarehouse.id.toString();

            return (
              <Button
                key={s.almacen}
                size="sm"
                variant={
                  isSelected ? "solid" : hasStock ? "outline" : "ghost"
                }
                colorScheme={
                  isSelected ? "blue" : hasStock ? "green" : "gray"
                }
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
};

export default WarehouseOptions;
