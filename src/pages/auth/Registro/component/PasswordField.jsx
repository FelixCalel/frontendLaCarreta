import React from "react";
import {
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Button,
  Text,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import PropTypes from "prop-types";

export default function PasswordField({
  label,
  name,
  value,
  onChange,
  error = "",
}) {
  const [show, setShow] = React.useState(false);
  return (
    <FormControl id={name} isInvalid={!!error} isRequired>
      <FormLabel>{label}</FormLabel>
      <InputGroup>
        <Input
          name={name}
          type={show ? "text" : "password"}
          placeholder={label}
          value={value}
          onChange={onChange}
          focusBorderColor="green.500"
          borderRadius="md"
          size="lg"
          autoComplete="new-password"
        />
        <InputRightElement width="4.5rem">
          <Button
            h="1.75rem"
            size="sm"
            onClick={() => setShow(!show)}
            variant="ghost"
          >
            {show ? <ViewOffIcon /> : <ViewIcon />}
          </Button>
        </InputRightElement>
      </InputGroup>
      {error && (
        <Text color="red.500" fontSize="sm">
          {error}
        </Text>
      )}
    </FormControl>
  );
}

PasswordField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
};