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
  const handleInputChange = (e) => {
    const inputValue = parseFloat(e.target.value);
    if (inputValue > max) {
      onChange({ target: { value: max } }); // Ajustar al máximo permitido
    } else {
      onChange(e);
    }
  };

  return (
    <HStack spacing={2} align="start">
      <FormControl mb={2} isInvalid={error}>
        <Input
          name="cantidad"
          type="number"
          value={value}
          onChange={handleInputChange}
          onBlur={() => {
            if (value > max) {
              onChange({ target: { value: max } }); // Ajustar al máximo permitido
              alert(`La cantidad máxima permitida es ${max}`);
            }
            onBlur && onBlur(value);
          }}
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
  max: PropTypes.number,
};

export default CantidadInput;
