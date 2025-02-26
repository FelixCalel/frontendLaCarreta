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

  // Carga inicial de los items
  useEffect(() => {
    dispatch(tablaItems());
  }, [dispatch]);

  // Maneja la selección de un item
  const handleSelectItem = (item) => {
    setInputValue(`${item.codigo} - ${item.nombre}`);
    setSelectedItem(item);
    onSelect(item.id, item.nombre, item.cantidadDisponible, item.codigo);

    // Muestra error si la cantidad disponible es cero
    if (item.cantidadDisponible === 0) {
      setError("Cantidad disponible: 0");
    } else {
      setError("");
    }
  };

  // Maneja cambios en el campo de texto
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  // Limpia el campo de texto y resetea los datos seleccionados
  const handleClearInput = () => {
    setInputValue("");
    setSelectedItem(null);
    setError("");
  };

  // Resetea el selector cuando el prop `reset` cambia
  useEffect(() => {
    if (reset) {
      handleClearInput();
    }
  }, [reset]);

  return (
    <Flex pt="2" justify="start" align="center" w="full" flexDir="column">
      <FormControl>
        {/*
          1) Quitar maxW="300px" en móvil.
          2) position="relative" en un contenedor lo suficientemente grande
        */}
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
                // 2) Ajustar posición absoluta con top y ancho total
                position="absolute"
                top="100%"
                left="0"
                right="0"
                zIndex="popover"
                bg={listBg}
                borderColor={listBorderColor}
                borderWidth="1px"
                borderRadius="md"
                boxShadow="md"
                // 3) Dar un maxHeight grande y scroll
                maxHeight="60vh"
                overflowY="auto"
                // Si el modal no es muy alto, podrías usar:
                // maxHeight="calc(100vh - 100px)"
              >
                {items.map((item) => (
                  <AutoCompleteItem
                    key={`option-${item.id}`}
                    value={`${item.codigo} - ${item.nombre}`}
                    textTransform="capitalize"
                    onClick={() => handleSelectItem(item)}
                    _hover={{ bg: itemHoverBg }}
                    // Permitir salto de línea
                    sx={{
                      whiteSpace: "normal",
                      overflowWrap: "break-word",
                    }}
                  >
                    <Text noOfLines={2} fontSize="sm">
                      {`${item.codigo} - ${item.nombre}`}
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
