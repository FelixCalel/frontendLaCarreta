import PropTypes from "prop-types";
import { FormControl, FormLabel, Input, FormErrorMessage } from "@chakra-ui/react";

const PrecioInput = ({ value, onChange, error, placeholder }) => {
  return (
    <FormControl mb={3} isInvalid={error} isRequired>
      <FormLabel>Precio</FormLabel>
      <Input
        name="precio"
        type="number"
        value={value}
        onChange={onChange}
        placeholder={placeholder} // Agregado el placeholder aquí
      />
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
};

PrecioInput.propTypes = {
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
  placeholder: PropTypes.string, // Agregado PropType para placeholder
};

export default PrecioInput;
