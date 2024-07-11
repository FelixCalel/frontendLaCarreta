// InfoCredito.jsx
import React, { useEffect } from 'react';
import {
  Box, Button, Input, Select, Flex, Heading, Grid
} from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDropdownOptions, submitFormData } from '../../store/proveedores/InfoCredito/thunks';
import { setFormData } from '../../store/proveedores/InfoCredito/InfoCreditoSlice';
import CustomFormControl from './CustomFormControl';

const InfoCredito = ({ handleNextTab, handlePreviousTab }) => {
  const dispatch = useDispatch();
  const dropdownOptions = useSelector((state) => state.infoCredito.dropdownOptions || { plazos: [] });
  const formData = useSelector((state) => state.infoCredito.formData || {});
  const status = useSelector((state) => state.infoCredito.status);
  const error = useSelector((state) => state.infoCredito.error);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchDropdownOptions());
    }
  }, [status, dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    dispatch(setFormData({ [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(submitFormData(formData));
  };

  return (
    <div>
      <Box borderWidth={1} borderRadius="md" p={4} mb={4}>
        <Heading size="sm">INFORMACIÓN DE CRÉDITO</Heading>
      </Box>
      <Grid templateColumns="repeat(2, 1fr)" gap={6}>
        <CustomFormControl id="plazo" label="Plazo">
          <Select
            name="plazo"
            placeholder="Seleccione el plazo"
            value={formData.plazo || ''}
            onChange={handleInputChange}
          >
            {(dropdownOptions.plazos || []).map(plazo => (
              <option key={plazo} value={plazo}>{plazo}</option>
            ))}
          </Select>
        </CustomFormControl>
        <CustomFormControl id="monto" label="Monto">
          <Input
            name="monto"
            placeholder="Monto"
            value={formData.monto || ''}
            onChange={handleInputChange}
          />
        </CustomFormControl>
      </Grid>
      <Flex justifyContent="space-between" w="100%" mt={4}>
        <Button onClick={handlePreviousTab} colorScheme="teal">Anterior</Button>
        <Button colorScheme="teal" onClick={handleNextTab}>Siguiente</Button>
      </Flex>
    </div>
  );
};

export default InfoCredito;
