import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Flex, FormControl, Box, Text } from "@chakra-ui/react";
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

  useEffect(() => {
    dispatch(tablaItems());
  }, [dispatch]);

  const handleSelectItem = (item) => {
    setInputValue(`${item.codigo} - ${item.nombre}`);
    setSelectedItem(item); // Guardamos el item seleccionado
    onSelect(item.id, `${item.codigo} - ${item.nombre}`);
    
    // Verificamos la cantidad disponible y actualizamos el mensaje de error si es necesario
    if (item.cantidadDisponible === 0) {
      setError("Cantidad máxima disponible: 0");
    } else {
      setError(""); // Reiniciar el error si hay cantidad disponible
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  useEffect(() => {
    if (reset) {
      setInputValue("");
      setSelectedItem(null);
      setError("");
    }
  }, [reset]);

  return (
    <Flex pt="2" justify="start" align="center" w="full" flexDir="column">
      <FormControl>
        <Box
          w={{ base: "150px", md: "500px", lg: "600px" }}
          maxW="600px"
          position="relative"
        >
          <AutoComplete openOnFocus>
            <AutoCompleteInput
              variant="outline"
              placeholder="Seleccione un item"
              value={inputValue}
              onChange={handleInputChange}
              size="sm"
              zIndex="1000"
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
      </FormControl>

      {selectedItem && (
        <FormControl mt="4">
          <Text>
            La cantidad máxima permitida es {selectedItem.cantidadDisponible}
          </Text>
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
