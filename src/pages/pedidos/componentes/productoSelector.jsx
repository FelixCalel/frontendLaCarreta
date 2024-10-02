import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Flex, FormControl, FormHelperText } from "@chakra-ui/react";
import { useSelector, useDispatch } from "react-redux";
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList,
} from "@choc-ui/chakra-autocomplete";

import { tablaItems } from "../../../store/items/thunks"; // Importa el thunk correcto

const ProductoSelector = ({ onSelect }) => {
  const dispatch = useDispatch();
  const [inputValue, setInputValue] = useState(""); // Estado para controlar el valor del input

  // Accedemos al estado `items` en lugar de `productos`
  const items = useSelector((state) => state.items.items);

  useEffect(() => {
    dispatch(tablaItems()); // Despachamos el thunk para obtener los items
  }, [dispatch]);

  // Función para manejar la selección de un producto
  const handleSelectItem = (item) => {
    setInputValue(item.nombre); // Actualizamos el valor del input con el nombre del producto seleccionado
    onSelect(item.id, item.nombre); // Pasamos el ID y el nombre del producto seleccionado al componente padre
  };

  // Función para manejar los cambios en el input manualmente
  const handleInputChange = (e) => {
    setInputValue(e.target.value); // Actualizamos el valor del input cuando el usuario escribe
  };

  // Función para limpiar el input cuando el usuario borra manualmente
  const handleClearInput = () => {
    setInputValue(""); // Limpia el valor del input
    onSelect(null, ""); // Resetea la selección en el componente padre
  };

  return (
    <Flex pt="4" justify="start" align="center" w="full" flexDir="column">
      <FormControl>
        <AutoComplete openOnFocus>
          <AutoCompleteInput
            variant="outline"
            placeholder="Seleccione un item"
            value={inputValue} // Controlamos el valor del input
            onChange={handleInputChange} // Controlamos los cambios en el input
            onBlur={() => {
              if (!inputValue) handleClearInput(); // Limpiamos el input si está vacío cuando se sale del campo
            }}
          />
          <AutoCompleteList>
            {items.map((item) => (
              <AutoCompleteItem
                key={`option-${item.id}`}
                value={item.nombre}
                textTransform="capitalize"
                onClick={() => handleSelectItem(item)} // Selecciona el item
              >
                {item.nombre}
              </AutoCompleteItem>
            ))}
          </AutoCompleteList>
        </AutoComplete>
        <FormHelperText mt="2">
          Seleccione el item para el pedido
        </FormHelperText>
      </FormControl>
    </Flex>
  );
};

ProductoSelector.propTypes = {
  onSelect: PropTypes.func.isRequired,
};

export default ProductoSelector;
