import PropTypes from "prop-types";
import { FormControl, FormLabel } from "@chakra-ui/react";
import { AsyncPaginate } from "react-select-async-paginate";

export const MaterialSelector = ({
  selectedItem,
  handleItemChange,
  loadOptions,
  customStyles,
}) => {
  return (
    <FormControl isRequired>
      <FormLabel>Buscar Item</FormLabel>
      <AsyncPaginate
        value={selectedItem}
        loadOptions={loadOptions}
        onChange={handleItemChange}
        additional={{ page: 1 }}
        debounceTimeout={300}
        placeholder="Escriba código o nombre..."
        noOptionsMessage={() => "No se encontraron resultados"}
        loadingMessage={() => "Buscando..."}
        styles={customStyles}
      />
    </FormControl>
  );
};

MaterialSelector.propTypes = {
  selectedItem: PropTypes.object,
  handleItemChange: PropTypes.func.isRequired,
  loadOptions: PropTypes.func.isRequired,
  customStyles: PropTypes.object.isRequired,
};

export default MaterialSelector;
