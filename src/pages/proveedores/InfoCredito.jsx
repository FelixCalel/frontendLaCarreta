import React from 'react';
import {
  Box, Button, Input, Select, Flex, Heading, Grid } from '@chakra-ui/react';
import CustomFormControl from './CustomFormControl';

export const InfoCredito = ({ formData, handleInputChange, handleNextTab, handlePreviousTab }) => (
  <div>
    <Box borderWidth={1} borderRadius="md" p={4} mb={4}>
      <Heading size="sm">INFORMACIÓN DE CRÉDITO</Heading>
    </Box>
    <Grid templateColumns="repeat(2, 1fr)" gap={6}>
      <CustomFormControl id="plazo" label="Plazo">
        <Select
          placeholder="Seleccione el plazo"
          value={formData.plazo}
          onChange={handleInputChange}
        >
          <option value="30 días">30 días</option>
          <option value="60 días">60 días</option>
        </Select>
      </CustomFormControl>
      <CustomFormControl id="monto" label="Monto">
        <Input
          placeholder="Monto"
          value={formData.monto}
          onChange={handleInputChange}
        />
      </CustomFormControl>
    </Grid>
    <Flex justify="space-between" w="100%" mt={4}>
      <Button onClick={handlePreviousTab} colorScheme="teal">Anterior</Button>
      <Button colorScheme="teal" onClick={handleNextTab}>Siguiente</Button>
    </Flex>
  </div>
);

export default InfoCredito;
