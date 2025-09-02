import React from 'react';
import PropTypes from 'prop-types';
import { VStack } from '@chakra-ui/react';
import PasswordField from './PasswordField';
import ConfirmPasswordField from './ConfirmPasswordField';

const Step3Security = ({ formData, handleChange, errors }) => {
  return (
    <VStack spacing={4} w="100%">
      <PasswordField
        label="Contraseña"
        name="contrasena"
        value={formData.contrasena}
        onChange={handleChange}
        error={errors.contrasena}
      />
      <ConfirmPasswordField
        label="Confirmar contraseña"
        name="confirmPassword"
        value={formData.confirmPassword}
        onChange={handleChange}
        error={errors.confirmPassword}
      />
    </VStack>
  );
};

Step3Security.propTypes = {
  formData: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
};

export default Step3Security;
