import PropTypes from "prop-types";
import { FormControl, Input, FormErrorMessage, HStack } from "@chakra-ui/react";

const CantidadInput = ({
  value,
  onChange,
  onBlur,
  error,
  placeholder,
  width,
  max,
}) => {
  return (
    <HStack spacing={2} align="start">
      <FormControl mb={2} isInvalid={error}>
        <Input
          name="cantidad"
          type="number"
          value={value}
          onChange={onChange}
          onBlur={() => onBlur && onBlur(value)}
          placeholder={placeholder}
          width={width || "60px"}
          size="sm"
          max={max}
        />

        {error && <FormErrorMessage>{error}</FormErrorMessage>}
      </FormControl>
    </HStack>
  );
};

CantidadInput.propTypes = {
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  error: PropTypes.string,
  placeholder: PropTypes.string,
  width: PropTypes.string,
  max: PropTypes.number, // Definir el tipo de `max` como número
};

export default CantidadInput;
