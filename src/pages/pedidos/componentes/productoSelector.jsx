import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Flex, FormControl, Box, Input, Text } from "@chakra-ui/react";
import { useSelector, useDispatch } from "react-redux";
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList,
} from "@choc-ui/chakra-autocomplete";
import { tablaItems } from "../../../store/items/thunks";

const ProductoSelector = ({ onSelect, reset }) => {
  const dispatch = useDispatch();
  const [inputValue, setInputValue] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [cantidad, setCantidad] = useState(0);
  const [error, setError] = useState("");

  const items = useSelector((state) => state.items.items);

  useEffect(() => {
    dispatch(tablaItems());
  }, [dispatch]);

  const handleSelectItem = (item) => {
    setInputValue(`${item.codigo} - ${item.nombre}`);
    setSelectedItem(item); // Guardamos el item seleccionado
    onSelect(item.id, `${item.codigo} - ${item.nombre}`);
    setCantidad(item.cantidadDisponible > 0 ? 0 : item.cantidadDisponible); // Si la cantidad máxima es 0, fijarla en 0
    setError(item.cantidadDisponible === 0 ? "Cantidad máxima disponible: 0" : ""); // Mostrar mensaje de advertencia si es 0
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleCantidadChange = (e) => {
    const cantidadIngresada = parseInt(e.target.value, 10);
    
    if (selectedItem && cantidadIngresada > selectedItem.cantidadDisponible) {
      setError(`La cantidad máxima permitida es ${selectedItem.cantidadDisponible}`);
    } else {
      setError("");
    }

    setCantidad(Math.min(cantidadIngresada, selectedItem ? selectedItem.cantidadDisponible : cantidadIngresada));
  };

  useEffect(() => {
    if (reset) {
      setInputValue("");
      setSelectedItem(null);
      setCantidad(0);
      setError("");
    }
  }, [reset]);

  return (
    <Flex pt="2" justify="start" align="center" w="full" flexDir="column">
      <FormControl>
        <Box w="150px" maxW="250px" position="relative">
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
          <Text>La cantidad máxima permitida es {selectedItem.cantidadDisponible}</Text>
          <Input
            type="number"
            value={cantidad}
            onChange={handleCantidadChange}
            placeholder="Cantidad"
            isDisabled={selectedItem.cantidadDisponible === 0} // Deshabilitar si la cantidad máxima es 0
          />
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
