import {
  Flex,
  FormControl,
  Box,
  HStack,
  useColorModeValue,
  IconButton,
  Text,
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList,
} from "@choc-ui/chakra-autocomplete";
import PropTypes from "prop-types";
import { useProductoSelector } from "./useProductoSelector";

const ProductoSelector = ({ deudorId, pedidoId, tiendaId, onSelect, reset }) => {
  const {
    inputValue,
    setInputValue,
    selectedItem,
    error,
    renderItems,
    handleSelectItem,
    loadMoreItems,
    handleClearInput,
  } = useProductoSelector(deudorId, pedidoId, tiendaId, onSelect, reset);

  const listBg = useColorModeValue("white", "gray.800");
  const listBorderColor = useColorModeValue("gray.200", "gray.600");
  const itemHoverBg = useColorModeValue("gray.100", "gray.600");

  const handleInputChange = (event) => setInputValue(event.target.value);

  const handleScroll = (event) => {
    const { scrollTop, scrollHeight, clientHeight } = event.target;
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      loadMoreItems();
    }
  };

  const disabled = !deudorId;

  return (
    <Flex w="100%" flexDir="column">
      <FormControl w="100%">
        <HStack spacing={2} w="100%" align="center" position="relative">
          <Box position="relative" flex="1" minW={0}>
            <AutoComplete openOnFocus filter={() => true}>
              <AutoCompleteInput
                variant="outline"
                placeholder={
                  disabled
                    ? "Seleccione un deudor primero"
                    : "Seleccione un item"
                }
                value={inputValue}
                onChange={handleInputChange}
                size={{ base: "md", md: "lg" }}
                w="100%"
                isDisabled={disabled}
                spellCheck={false}
                autoComplete="off"
              />

              <AutoCompleteList
                onScroll={handleScroll}
                bg={listBg}
                borderColor={listBorderColor}
                borderWidth="1px"
                borderRadius="md"
                boxShadow="md"
                maxHeight="50vh"
                overflowY="auto"
                w={{ base: "calc(100% + 155px)", md: "100%" }}
              >
                {renderItems.length === 0 ? (
                  <Box px={3} py={2}>
                    <Text fontSize="sm" color="gray.500">
                      {disabled
                        ? "Seleccione un deudor para ver sus items."
                        : "Sin resultados para este deudor."}
                    </Text>
                  </Box>
                ) : (
                  renderItems.map((item) => {
                    const itemId = item?.id ?? item?.productoId;
                    const itemNombre =
                      item?.nombre ?? item?.nombreProducto ?? "";
                    const itemCodigo = item?.codigo ?? "";

                    return (
                      <AutoCompleteItem
                        key={`option-${itemId}`}
                        value={`${itemCodigo} - ${itemNombre}`}
                        onClick={() => handleSelectItem(item)}
                        _hover={{ bg: itemHoverBg }}
                        sx={{ whiteSpace: "normal", wordBreak: "break-word" }}
                      >
                        <Text fontSize="sm">{itemNombre}</Text>
                      </AutoCompleteItem>
                    );
                  })
                )}
              </AutoCompleteList>
            </AutoComplete>
          </Box>

          <IconButton
            aria-label="Limpiar campo"
            icon={<CloseIcon />}
            size={{ base: "sm", md: "sm" }}
            onClick={handleClearInput}
            colorScheme="red"
            variant="outline"
            isDisabled={disabled}
          />
        </HStack>
      </FormControl>

      {selectedItem && error && (
        <FormControl mt="2">
          <Text color="red.500" fontSize="sm">
            {error}
          </Text>
        </FormControl>
      )}
    </Flex>
  );
};

ProductoSelector.propTypes = {
  deudorId: PropTypes.number,
  pedidoId: PropTypes.number,
  tiendaId: PropTypes.number,
  onSelect: PropTypes.func.isRequired,
  reset: PropTypes.bool,
};

export default ProductoSelector;
