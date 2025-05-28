// src/components/Register/component/ContactField.jsx
import { useMemo } from "react";
import {
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
} from "@chakra-ui/react";
import { AtSignIcon, PhoneIcon } from "@chakra-ui/icons";
import PropTypes from "prop-types";

function isEmail(value) {
  return /\S+@\S+\.\S+/.test(value);
}
function isPhone(value) {
  return /^[\d\s()+-]+$/.test(value);
}

export default function ContactField({ value, onChange, error }) {
  const { icon, placeholder } = useMemo(() => {
    if (isEmail(value)) {
      return { icon: <AtSignIcon color="gray.400" />, placeholder: "Correo" };
    }
    return { icon: <PhoneIcon color="gray.400" />, placeholder: "Teléfono" };
  }, [value]);

  return (
    <FormControl id="contact" isInvalid={!!error} isRequired>
      <FormLabel>Regístrate con correo o teléfono</FormLabel>

      <InputGroup>
        <InputLeftElement pointerEvents="none">{icon}</InputLeftElement>
        <Input
          name="contact" // ← campo único
          type="text"
          placeholder={`Ingresa tu ${placeholder.toLowerCase()}`}
          value={value}
          onChange={onChange}
          focusBorderColor="green.500"
          borderRadius="md"
          size="lg"
        />
      </InputGroup>

      {error && (
        <Text color="red.500" fontSize="sm" mt={1}>
          {error}
        </Text>
      )}
    </FormControl>
  );
}

ContactField.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
};
ContactField.defaultProps = { error: "" };
