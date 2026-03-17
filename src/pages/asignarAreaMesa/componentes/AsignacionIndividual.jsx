import { Box, Flex, Button } from "@chakra-ui/react";
import Select from "react-select";

export const AsignacionIndividual = ({
  selectedProducto,
  setSelectedProducto,
  productOptions,
  handleInputChange,
  handleScrollToBottom,
  isLoadingProducts,
  customSelectStyles,
  handleAsignar,
  listBg,
  borderColor,
}) => {
  return (
    <Flex
      align="center"
      gap={3}
      wrap="wrap"
      p={3}
      borderWidth={1}
      borderColor={borderColor}
      borderRadius="lg"
      bg={listBg}
      mt={3}
    >
      <Box flex="1" minW="250px">
        <Select
          placeholder="Buscar línea de producción por código o nombre..."
          value={selectedProducto}
          onChange={setSelectedProducto}
          options={productOptions}
          onInputChange={handleInputChange}
          onMenuScrollToBottom={handleScrollToBottom}
          isLoading={isLoadingProducts}
          isClearable
          filterOption={null}
          menuPlacement="top"
          noOptionsMessage={() =>
            isLoadingProducts ? "Buscando..." : "No se encontraron opciones"
          }
          styles={customSelectStyles}
        />
      </Box>
      <Button
        colorScheme="blue"
        onClick={handleAsignar}
        isDisabled={!selectedProducto}
        px={8}
        boxShadow="sm"
      >
        Asignar Línea
      </Button>
    </Flex>
  );
};
