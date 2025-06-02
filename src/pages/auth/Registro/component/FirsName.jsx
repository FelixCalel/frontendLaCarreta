import { FormControl, FormLabel, Input, Text } from "@chakra-ui/react";
import PropTypes from "prop-types";

export default function FirstNameField({ value, onChange, error }) {
  return (
    <FormControl id="nombre" isInvalid={!!error} isRequired>
      <FormLabel>Nombre</FormLabel>
      <Input
        name="nombre"
        type="text"
        placeholder="Ingresa tu nombre"
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

FirstNameField.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
};
