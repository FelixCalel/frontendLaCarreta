import PropTypes from "prop-types";
import { FormControl, FormLabel, Input, Text } from "@chakra-ui/react";

export default function SurnameField({ value, onChange, error }) {
  return (
    <FormControl id="apellido" isInvalid={!!error} isRequired>
      <FormLabel>Apellido</FormLabel>
      <Input
        name="apellido"
        type="text"
        placeholder="Ingresa tu apellido"
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

SurnameField.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
};

SurnameField.defaultProps = {
  error: "",
};
