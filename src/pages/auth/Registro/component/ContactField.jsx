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

const phoneRegex = /^[\d\s()+-]+$/;

export default function ContactField({ value, onChange, error = "" }) {
  const { icon, placeholder } = useMemo(() => {
    const soloTelefono =
      value && phoneRegex.test(value) && !value.includes("@");
    if (soloTelefono) {
      return {
        icon: <PhoneIcon color="gray.400" />,
        placeholder: "Teléfono",
        label: "Teléfono",
      };
    }
    return {
      icon: <AtSignIcon color="gray.400" />,
      placeholder: "Correo",
      label: "Correo Electrónico",
    };
  }, [value]);

  return (
    <FormControl id="contact" isInvalid={!!error} isRequired>
      <FormLabel>Correo Electronico</FormLabel>

      <InputGroup>
        <InputLeftElement pointerEvents="none">{icon}</InputLeftElement>
        <Input
          name="contact"
          type="text"
          placeholder={`Ingresa tu ${placeholder.toLowerCase()}`}
          value={value}
          onChange={onChange}
          focusBorderColor="green.500"
          borderRadius="md"
          size="lg"
          pl="2.5rem"
          autoComplete="off"
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