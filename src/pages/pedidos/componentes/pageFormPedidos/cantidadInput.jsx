import PropTypes from "prop-types";
import { FormControl, Input, FormErrorMessage, HStack } from "@chakra-ui/react";

const CantidadInput = ({
  value,
  max,
  onChange,
  onBlur,
  error,
  placeholder,
  width,
}) => {
  const handleInputChange = (e) => {
    const inputValue = e.target.value;

    // Permitir valores numéricos y vacíos
    if (!isNaN(inputValue) || inputValue === "") {
      const parsedValue = parseFloat(inputValue) || 0;

      // Validar que no exceda la cantidad máxima
      if (parsedValue > max) {
        onChange({ target: { value: max } }); // Limitar al valor máximo permitido
        return;
      }

      onChange({ target: { value: inputValue } });
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
          onBlur={onBlur}
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
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  max: PropTypes.number,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  error: PropTypes.string,
  placeholder: PropTypes.string,
  width: PropTypes.string,
};

export default CantidadInput;
