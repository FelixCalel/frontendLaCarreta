import PropTypes from "prop-types";
import { FormControl, FormLabel, Input, FormErrorMessage, HStack } from "@chakra-ui/react";

const CantidadInput = ({ value, onChange, onBlur, error, placeholder, width }) => {
  return (
    <HStack spacing={2} align="start">
      <FormControl mb={2} isInvalid={error} isRequired>
        <FormLabel fontSize="sm" mb={1}>Cantidad</FormLabel>
        <Input
          name="cantidad"
          type="number"
          value={value}
          onChange={onChange}
          onBlur={onBlur}  // Llamará a la función `onBlur` pasada como prop cuando el usuario pierda el foco
          placeholder={placeholder}
          width={width || "60px"}
          size="sm"
        />
        {error && <FormErrorMessage>{error}</FormErrorMessage>}
      </FormControl>
    </HStack>
  );
};

CantidadInput.propTypes = {
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,  // Agregar `onBlur` como prop opcional
  error: PropTypes.string,
  placeholder: PropTypes.string,
  width: PropTypes.string,
};

export default CantidadInput;
