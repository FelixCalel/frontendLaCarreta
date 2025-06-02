// src/components/PhoneField.jsx
import PropTypes from "prop-types";
import { FormControl, FormLabel, Input, Text } from "@chakra-ui/react";

export default function PhoneField({ value, onChange, error }) {
  return (
    <FormControl id="telefono" isInvalid={!!error} isRequired>
      <FormLabel>Teléfono</FormLabel>
      <Input
        name="telefono"
        type="tel"
        placeholder="Ingresa tu teléfono o correo"
        value={value}
        onChange={onChange}
        focusBorderColor="green.500"
        borderRadius="md"
        size="lg"
      />
      {error && (
        <Text color="red.500" fontSize="sm" mt={1}>
          {error}
        </Text>
      )}
    </FormControl>
  );
}

PhoneField.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
};

PhoneField.defaultProps = {
  error: "",
};
