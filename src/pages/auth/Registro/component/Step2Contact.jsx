import React from "react";
import PropTypes from "prop-types";
import {
  VStack,
  InputGroup,
  InputLeftElement,
  Input,
  FormControl,
  Text,
} from "@chakra-ui/react";
import { PhoneIcon } from "@chakra-ui/icons";
import ContactField from "./ContactField";

const isEmail = (v) => /^\S+@\S+\.\S+$/.test(v);

const Step2Contact = ({ formData, handleChange, errors }) => {
  return (
    <VStack spacing={4} w="100%">
      <ContactField
        value={formData.contact}
        onChange={handleChange}
        error={errors.contact}
      />

      {isEmail(formData.contact) && (
        <FormControl isInvalid={!!errors.telefono}>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <PhoneIcon color="gray.400" />
            </InputLeftElement>
            <Input
              name="telefono"
              type="text"
              placeholder="Ingresa tu teléfono"
              value={formData.telefono}
              onChange={handleChange}
              focusBorderColor="green.500"
              borderRadius="md"
              size="lg"
            />
          </InputGroup>
          {errors.telefono && (
            <Text fontSize="sm" color="red.500" mt={1}>
              {errors.telefono}
            </Text>
          )}
        </FormControl>
      )}
    </VStack>
  );
};

Step2Contact.propTypes = {
  formData: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
};

export default Step2Contact;
