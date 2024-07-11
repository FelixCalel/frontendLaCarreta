// InfoSolicitante.jsx
import React, { useEffect } from 'react';
import { Box, Button, FormLabel, Input, Select, Flex, Heading, Grid } from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDropdownOptions, submitFormData } from '../../store/proveedores/InfoSolicitante/thunks';
import { setFormData } from '../../store/proveedores/InfoSolicitante/InfoSolicitanteSlice';
import CustomFormControl from './CustomFormControl';


const InfoSolicitante = ({ handleNextTab }) => {
  const dispatch = useDispatch();
  const dropdownOptions = useSelector((state) => state.infoSolicitante.dropdownOptions);
  const formData = useSelector((state) => state.infoSolicitante.formData);
  const status = useSelector((state) => state.infoSolicitante.status);
  const error = useSelector((state) => state.infoSolicitante.error);

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
      <Flex align="center" justify="space-between" mb={4}>
        <Box borderWidth={1} borderRadius="sm" p={4} flexGrow={1}>
          <Heading size="sm">INFORMACIÓN DEL SOLICITANTE</Heading>
        </Box>
        <Box borderWidth={0} borderRadius="sm" p={4} flexShrink={0}>
          <Flex alignItems="center">
            <FormLabel htmlFor="fechaSolicitud" fontWeight="bold" mb="0" mr={2}>Fecha:</FormLabel>
            <Input
              id="fechaSolicitud"
              type="text"
              value={formData.fechaSolicitud}
              readOnly
              fontWeight="bold"
              fontSize="sm"
              borderColor="green.500"
              width="auto"
              minW="max-content"
            />
          </Flex>
        </Box>
      </Flex>
      <Grid templateColumns="repeat(2, 1fr)" gap={6}>
        <CustomFormControl id="empresaSolicitante" label="Empresa donde solicita PRO">
          <Select
            name="empresaSolicitante"
            placeholder="Seleccione una empresa"
            value={formData.empresaSolicitante}
            onChange={handleInputChange}
          >
            {dropdownOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </CustomFormControl>
        <CustomFormControl id="nombreSolicitante" label="Nombre del Solicitante">
          <Input
            name="nombreSolicitante"
            placeholder="Nombre del Solicitante"
            value={formData.nombreSolicitante}
            onChange={handleInputChange}
          />
        </CustomFormControl>
      </Grid>
      <Flex justifyContent="flex-end" w="100%" mt={4}>
        <Button colorScheme="teal" onClick={handleNextTab}>Siguiente</Button>
      </Flex>
    </div>
  );
};

export default InfoSolicitante;
