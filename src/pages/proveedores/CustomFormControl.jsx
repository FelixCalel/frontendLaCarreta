import React from 'react';
import {FormControl, FormLabel} from '@chakra-ui/react';



const CustomFormControl = ({ id, label, children }) => (
  <FormControl id={id} mb={4}>
    <FormLabel fontWeight="bold">{label}</FormLabel>
    {children}
  </FormControl>
);

export default CustomFormControl;
