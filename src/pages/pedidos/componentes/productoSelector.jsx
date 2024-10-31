import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Flex, FormControl, Box } from "@chakra-ui/react";
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

  const items = useSelector((state) => state.items.items);

  useEffect(() => {
    dispatch(tablaItems());
  }, [dispatch]);

  const handleSelectItem = (item) => {
    setInputValue(`${item.codigo} - ${item.nombre}`);
    onSelect(item.id, `${item.codigo} - ${item.nombre}`);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  useEffect(() => {
    if (reset) {
      setInputValue("");
    }
  }, [reset]);

  return (
    <Flex pt="2" justify="start" align="center" w="full" flexDir="column" >
      <FormControl>
        <Box w="150px" maxW="250px" position="relative" > {/* Ajuste de posición y tamaño */}
          <AutoComplete openOnFocus >
            <AutoCompleteInput
              variant="outline"
              placeholder="Seleccione un item"
              value={inputValue}
              onChange={handleInputChange}
              size="sm"
              zIndex="1000"
            />
            <AutoCompleteList zIndex="1000"> {/* Asegura que esté encima */}
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
    </Flex>
  );
};

ProductoSelector.propTypes = {
  onSelect: PropTypes.func.isRequired,
  reset: PropTypes.bool.isRequired,
};

export default ProductoSelector;
