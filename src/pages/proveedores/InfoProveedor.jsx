import React from 'react';
import {
  Box, Button, Input, Select, Flex, Heading, Textarea, Grid, GridItem } from '@chakra-ui/react';
import CustomFormControl from './CustomFormControl';

export const InfoProveedor = ({ formData, handleInputChange, handleNextTab, handlePreviousTab }) => (
  <div>
    <Box borderWidth={1} borderRadius="md" p={4} mb={4}>
      <Heading size="sm">INFORMACIÓN DEL PROVEEDOR</Heading>
    </Box>
    <Grid templateColumns="repeat(2, 1fr)" gap={6}>
      <GridItem colSpan={2}>
        <CustomFormControl id="razonSocial" label="Razón social (nombre de la empresa)">
          <Input
            placeholder="Razón social"
            value={formData.razonSocial}
            onChange={handleInputChange}
          />
        </CustomFormControl>
      </GridItem>
      <CustomFormControl id="paisProveedor" label="País del proveedor">
        <Select
          placeholder="Seleccione un país"
          value={formData.paisProveedor}
          onChange={handleInputChange}
        >
          <option value="Guatemala">Guatemala</option>
          <option value="México">México</option>
        </Select>
      </CustomFormControl>
      <CustomFormControl id="tipoProveedor" label="Tipo de proveedor">
        <Select
          placeholder="Seleccione el tipo de proveedor"
          value={formData.tipoProveedor}
          onChange={handleInputChange}
        >
          <option value="Nacional">Nacional</option>
          <option value="Exterior">Exterior</option>
        </Select>
      </CustomFormControl>
      <CustomFormControl id="nombreContacto" label="Nombre del contacto">
        <Input
          placeholder="Nombre del contacto"
          value={formData.nombreContacto}
          onChange={handleInputChange}
        />
      </CustomFormControl>
      <CustomFormControl id="localidadProveedor" label="Localidad del proveedor">
        <Input
          placeholder="Localidad del proveedor"
          value={formData.localidadProveedor}
          onChange={handleInputChange}
        />
      </CustomFormControl>
      <CustomFormControl id="correoContacto" label="Correo electrónico">
        <Input
          placeholder="Correo electrónico"
          value={formData.correoContacto}
          onChange={handleInputChange}
        />
      </CustomFormControl>
      <CustomFormControl id="dpi" label={formData.tipoProveedor === 'Exterior' ? 'Pasaporte' : 'DPI'}>
        <Input
          placeholder={formData.tipoProveedor === 'Exterior' ? 'Pasaporte' : 'DPI'}
          value={formData.dpi}
          onChange={handleInputChange}
        />
      </CustomFormControl>
      <CustomFormControl id="telefonoContacto" label="Teléfono de contacto">
        <Input
          placeholder="Teléfono de contacto"
          value={formData.telefonoContacto}
          onChange={handleInputChange}
        />
      </CustomFormControl>
      <CustomFormControl id="nit" label={formData.tipoProveedor === 'Exterior' ? 'RTN' : 'NIT'}>
        <Input
          placeholder={formData.tipoProveedor === 'Exterior' ? 'RTN' : 'NIT'}
          value={formData.nit}
          onChange={handleInputChange}
        />
      </CustomFormControl>
      <GridItem colSpan={2}>
        <CustomFormControl id="productosPrincipales" label="Productos principales que nos vende">
          <Textarea
            placeholder="Productos principales"
            value={formData.productosPrincipales}
            onChange={handleInputChange}
          />
        </CustomFormControl>
      </GridItem>
    </Grid>
    <Flex justify="space-between" w="100%" mt={4}>
      <Button onClick={handlePreviousTab} colorScheme="teal">Anterior</Button>
      <Button colorScheme="teal" onClick={handleNextTab}>Siguiente</Button>
    </Flex>
  </div>
);

export default InfoProveedor;
