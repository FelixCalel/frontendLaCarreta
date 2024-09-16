import PropTypes from "prop-types";
import { FormControl, FormLabel, Input, FormErrorMessage } from "@chakra-ui/react";

const CantidadInput = ({ value, onChange, error }) => {
  return (
    <FormControl mb={3} isInvalid={error} isRequired>
      <FormLabel>Cantidad</FormLabel>
      <Input
        name="cantidad"
        type="number"
        value={value}
        onChange={onChange}
      />
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
};

CantidadInput.propTypes = {
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
};

export default CantidadInput;
