import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Flex,
  FormControl,
  Box,
  Text,
  IconButton,
  HStack,
  useColorModeValue
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import { useSelector, useDispatch } from "react-redux";
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList,
} from "@choc-ui/chakra-autocomplete";
import { tablaItems } from "../../../../store/items/thunks";

const ProductoSelector = ({ onSelect, reset }) => {
  const dispatch = useDispatch();
  const [inputValue, setInputValue] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [error, setError] = useState("");
  const items = useSelector((state) => state.items.items);

  // Colores para modo claro/oscuro
  const listBg = useColorModeValue("white", "gray.800");
  const listBorderColor = useColorModeValue("gray.200", "gray.600");
  const itemHoverBg = useColorModeValue("gray.100", "gray.600");

  // Carga inicial de items
  useEffect(() => {
    dispatch(tablaItems());
  }, [dispatch]);

  // Al seleccionar un item
  const handleSelectItem = (item) => {
    setInputValue(`${item.nombre}`);
    setSelectedItem(item);

    onSelect(item.id, item.nombre, item.cantidadDisponible, item.codigo);

    // Muestra error si no hay stock
    if (item.cantidadDisponible === 0) {
      setError("Cantidad disponible: 0");
    } else {
      setError("");
    }
  };

  // Cambio en el campo
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  // Limpiar campo
  const handleClearInput = () => {
    setInputValue("");
    setSelectedItem(null);
    setError("");
  };

  // Resetea cuando `reset` cambia
  useEffect(() => {
    if (reset) {
      handleClearInput();
    }
  }, [reset]);

  return (
    <Flex pt="2" justify="start" align="center" w="full" flexDir="column">
      <FormControl>
        <HStack
          spacing={2}
          w="full"
          align="center"
          position="relative"
        >
          <Box flex="1" position="relative">
            <AutoComplete openOnFocus>
              <AutoCompleteInput
                variant="outline"
                placeholder="Seleccione un item"
                value={inputValue}
                onChange={handleInputChange}
                size="sm"
                w="full"
              />
              <AutoCompleteList
                // Posición absoluta debajo del input
                position="relative"
                top="100%"
                left="0"
                zIndex="popover"
                bg={listBg}
                borderColor={listBorderColor}
                borderWidth="1px"
                borderRadius="md"
                boxShadow="md"

                // Limita ancho y alto para no desplazar la página
                minW="300px"
                maxW="calc(100vw - 20px)"
                maxHeight="50vh"

                // Evita scroll horizontal y permite vertical
                overflowY="auto"
                overflowX="hidden"
              >
                {items.map((item) => (
                  <AutoCompleteItem
                    key={`option-${item.id}`}
                    value={`${item.codigo} - ${item.nombre}`}
                    textTransform="capitalize"
                    onClick={() => handleSelectItem(item)}
                    _hover={{ bg: itemHoverBg }}
                    // Fuerza quiebre de línea
                    sx={{
                      whiteSpace: "normal",
                      wordBreak: "break-word",
                    }}
                  >
                    <Text fontSize="sm">
                      {`${item.nombre}`}
                    </Text>
                  </AutoCompleteItem>
                ))}
              </AutoCompleteList>
            </AutoComplete>
          </Box>
          <IconButton
            aria-label="Limpiar campo"
            icon={<CloseIcon />}
            size="sm"
            onClick={handleClearInput}
            colorScheme="red"
            variant="outline"
          />
        </HStack>
      </FormControl>

      {selectedItem && (
        <FormControl mt="4">
          {error && <Text color="red.500">{error}</Text>}
        </FormControl>
      )}
    </Flex>
  );
};

ProductoSelector.propTypes = {
  onSelect: PropTypes.func.isRequired,
  reset: PropTypes.bool.isRequired,
};

export default ProductoSelector;
