import React from 'react';
import PropTypes from 'prop-types';
import { VStack } from '@chakra-ui/react';
import FirstNameField from './FirstNameField';
import LastNameField from './LastNameField';
import PaisSelector from './paisSelector';

const Step1Account = ({ formData, handleChange, setFormData, errors }) => {
  return (
    <VStack spacing={4} w="100%">
      <FirstNameField
        value={formData.nombre}
        onChange={handleChange}
        error={errors.nombre}
      />
      <LastNameField
        value={formData.apellido}
        onChange={handleChange}
        error={errors.apellido}
      />
      <PaisSelector
        value={formData.paisId}
        onPaisChange={(paisId) => setFormData((p) => ({ ...p, paisId }))}
        error={errors.paisId}
      />
    </VStack>
  );
};

Step1Account.propTypes = {
  formData: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  setFormData: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
};

export default Step1Account;
