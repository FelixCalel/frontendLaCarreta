import React from 'react';
import { Box, Button,FormLabel, Input, Select, Flex, Heading, Grid } from '@chakra-ui/react';
import CustomFormControl from './CustomFormControl';

export const InfoSolicitante = ({ formData, handleInputChange, handleNextTab, handlePreviousTab, tabIndex }) => (
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
            borderColor="orange.400"
            width="auto"
            minW="max-content"
          />
        </Flex>
      </Box>
    </Flex>
    <Grid templateColumns="repeat(2, 1fr)" gap={6}>
      <CustomFormControl id="empresaSolicitante" label="Empresa donde solicita PRO">
        <Select
          placeholder="Seleccione una empresa"
          value={formData.empresaSolicitante}
          onChange={handleInputChange}
        >
          <option value="Agropecuaria Popoyán, S.A.">Agropecuaria Popoyán, S.A.</option>
          <option value="AFITEC">AFITEC</option>

        </Select>
      </CustomFormControl>
      <CustomFormControl id="nombreSolicitante" label="Nombre del Solicitante">
        <Input
          placeholder="Nombre del Solicitante"
          value={formData.nombreSolicitante}
          onChange={handleInputChange}
        />
      </CustomFormControl>
    </Grid>
    <Flex justify="space-between" w="100%" mt={4}>
      <Button onClick={handlePreviousTab} colorScheme="teal" visibility={tabIndex === 0 ? 'hidden' : 'visible'}>Anterior</Button>
      <Button colorScheme="teal" onClick={handleNextTab}>Siguiente</Button>
    </Flex>
  </div>
);

export default InfoSolicitante;
