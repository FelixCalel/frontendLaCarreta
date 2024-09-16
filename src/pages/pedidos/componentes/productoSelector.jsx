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

import { tablaProductos } from "../../../store/Pedidos/pedidoSlice";

const ProductoSelector = ({ onSelect }) => {
  const dispatch = useDispatch();
  const productos = useSelector((state) => state.productos);

  useEffect(() => {
    dispatch(tablaProductos());
  }, [dispatch]);

  const handleSelectProducto = (producto) => {
    onSelect(producto.id);
  };

  return (
    <Flex pt="4" justify="start" align="center" w="full" flexDir="column">
      <AutoComplete openOnFocus>
        <AutoCompleteInput variant="outline" placeholder="Seleccione un producto" />
        <AutoCompleteList>
          {productos.map((prod) => (
            <AutoCompleteItem
              key={`option-${prod.id}`}
              value={prod.nombre}
              textTransform="capitalize"
              onClick={() => handleSelectProducto(prod)}
            >
              {prod.nombre}
            </AutoCompleteItem>
          ))}
        </AutoCompleteList>
      </AutoComplete>
      <FormHelperText mt="2">Seleccione el producto para el pedido</FormHelperText>
    </Flex>
  );
};

ProductoSelector.propTypes = {
  onSelect: PropTypes.func.isRequired,
};

export default ProductoSelector;
