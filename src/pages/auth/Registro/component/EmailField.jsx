import PropTypes from "prop-types";
import { FormControl, FormLabel, Input, Text } from "@chakra-ui/react";

export default function EmailField({ value, onChange, error }) {
  return (
    <FormControl id="correo" isInvalid={!!error} isRequired>
      <FormLabel>Correo Electrónico</FormLabel>
      <Input
        name="correo"
        type="email"
        placeholder="Ingresa tu correo electrónico"
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

EmailField.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
};

EmailField.defaultProps = {
  error: "",
};
