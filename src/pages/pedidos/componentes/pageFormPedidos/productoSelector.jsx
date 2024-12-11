import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Flex,
  FormControl,
  Box,
  Text,
  IconButton,
  HStack,
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

  // Carga inicial de los items
  useEffect(() => {
    dispatch(tablaItems());
  }, [dispatch]);

  // Maneja la selección de un item
  const handleSelectItem = (item) => {
    setInputValue(`${item.codigo} - ${item.nombre}`);
    setSelectedItem(item);

    // Callback para enviar el item seleccionado al componente padre
    onSelect(
      item.id,
      item.nombre,
      item.cantidadDisponible,
      item.codigo
    );

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
        {/* Contenedor horizontal para el campo de texto y el botón de limpiar */}
        <HStack spacing={2} w="100%" maxW="300px" align="center">
          <Box flex="1">
            <AutoComplete openOnFocus>
              <AutoCompleteInput
                variant="outline"
                placeholder="Seleccione un item"
                value={inputValue}
                onChange={handleInputChange}
                size="sm"
                zIndex="1000"
                w="100%" // Ajusta el ancho del input aquí
              />
              <AutoCompleteList zIndex="1000">
                {items.map((item) => (
                  <AutoCompleteItem
                    key={`option-${item.id}`}
                    value={`${item.codigo} - ${item.nombre}`}
                    textTransform="capitalize"
                    onClick={() => handleSelectItem(item)}
                  >
                    {`${item.codigo} - ${item.nombre}`}
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

      {/* Mensaje de error y detalles del producto seleccionado */}
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
