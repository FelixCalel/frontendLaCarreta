import PropTypes from "prop-types";
import { FormControl, FormLabel, Input, FormErrorMessage, HStack } from "@chakra-ui/react";

const CantidadInput = ({ value, onChange, error, placeholder, width }) => {
  return (
    <HStack spacing={2} align="start"> {/* Usa HStack para alinear el selector y cantidad horizontalmente */}
      <FormControl mb={2} isInvalid={error} isRequired>
        <FormLabel fontSize="sm" mb={1}>Cantidad</FormLabel>
        <Input
          name="cantidad"
          type="number"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          width={width || "60px"}  // Usa el ancho pasado como prop o un valor predeterminado
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
  error: PropTypes.string,
  placeholder: PropTypes.string,
  width: PropTypes.string,  // Prop para permitir ajustar el ancho
};

export default CantidadInput;
