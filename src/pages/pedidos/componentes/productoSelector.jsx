import { useEffect } from "react";
import PropTypes from "prop-types";
import { Flex, FormHelperText } from "@chakra-ui/react";
import { useSelector, useDispatch } from "react-redux";
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList,
} from "@choc-ui/chakra-autocomplete";

import { tablaItems } from "../../../store/items/thunks";  // Importa el thunk correcto

const ProductoSelector = ({ onSelect }) => {
  const dispatch = useDispatch();
  
  // Accedemos al estado `items` en lugar de `productos`
  const items = useSelector((state) => state.items.items);  // Cambiamos de `productos` a `items`

  useEffect(() => {
    dispatch(tablaItems());  // Despachamos el thunk para obtener los items
  }, [dispatch]);

  const handleSelectItem = (item) => {
    onSelect(item.id);  // Cambiamos de `producto` a `item`
  };

  return (
    <Flex pt="4" justify="start" align="center" w="full" flexDir="column">
      <AutoComplete openOnFocus>
        <AutoCompleteInput variant="outline" placeholder="Seleccione un item" />  {/* Cambiamos el texto */}
        <AutoCompleteList>
          {items.map((item) => (  // Iteramos sobre `items` en lugar de `productos`
            <AutoCompleteItem
              key={`option-${item.id}`}
              value={item.nombre}  // Cambiamos de `prod` a `item`
              textTransform="capitalize"
              onClick={() => handleSelectItem(item)}  // Cambiamos de `prod` a `item`
            >
              {item.nombre}  {/* Cambiamos de `prod` a `item` */}
            </AutoCompleteItem>
          ))}
        </AutoCompleteList>
      </AutoComplete>
      <FormHelperText mt="2">Seleccione el item para el pedido</FormHelperText>  {/* Cambiamos el texto */}
    </Flex>
  );
};

ProductoSelector.propTypes = {
  onSelect: PropTypes.func.isRequired,
};

export default ProductoSelector;
