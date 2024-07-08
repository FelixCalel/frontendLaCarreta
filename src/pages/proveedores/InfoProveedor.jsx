import React from 'react'; // Importa la biblioteca React.
import {
  Box, Button, Input, Select, Flex, Heading, Textarea, Grid, GridItem 
} from '@chakra-ui/react'; // Importa componentes de Chakra UI.
import CustomFormControl from './CustomFormControl'; // Importa un componente personalizado.

export const InfoProveedor = ({ formData, handleInputChange, handleNextTab, handlePreviousTab }) => (
  // Componente funcional que recibe las props formData, handleInputChange, handleNextTab y handlePreviousTab.
  <div>
    {/* Contenedor para la información del proveedor */}
    <Box borderWidth={1} borderRadius="md" p={4} mb={4}>
      <Heading size="sm">INFORMACIÓN DEL PROVEEDOR</Heading>
    </Box>
    <Grid templateColumns="repeat(2, 1fr)" gap={6}>
      {/* Utiliza un componente de cuadrícula para organizar los campos del formulario en dos columnas */}
      <GridItem colSpan={2}>
        <CustomFormControl id="razonSocial" label="Razón social (nombre de la empresa)">
          {/* Control personalizado para ingresar la razón social */}
          <Input
            placeholder="Razón social"
            value={formData.razonSocial}
            onChange={handleInputChange}
          />
        </CustomFormControl>
      </GridItem>
      <CustomFormControl id="paisProveedor" label="País del proveedor">
        {/* Control personalizado para seleccionar el país del proveedor */}
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
        {/* Control personalizado para seleccionar el tipo de proveedor */}
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
        {/* Control personalizado para ingresar el nombre del contacto */}
        <Input
          placeholder="Nombre del contacto"
          value={formData.nombreContacto}
          onChange={handleInputChange}
        />
      </CustomFormControl>
      <CustomFormControl id="localidadProveedor" label="Localidad del proveedor">
        {/* Control personalizado para ingresar la localidad del proveedor */}
        <Input
          placeholder="Localidad del proveedor"
          value={formData.localidadProveedor}
          onChange={handleInputChange}
        />
      </CustomFormControl>
      <CustomFormControl id="correoContacto" label="Correo electrónico">
        {/* Control personalizado para ingresar el correo electrónico del contacto */}
        <Input
          placeholder="Correo electrónico"
          value={formData.correoContacto}
          onChange={handleInputChange}
        />
      </CustomFormControl>
      <CustomFormControl id="dpi" label={formData.tipoProveedor === 'Exterior' ? 'Pasaporte' : 'DPI'}>
        {/* Control personalizado para ingresar el DPI o pasaporte del proveedor */}
        <Input
          placeholder={formData.tipoProveedor === 'Exterior' ? 'Pasaporte' : 'DPI'}
          value={formData.dpi}
          onChange={handleInputChange}
        />
      </CustomFormControl>
      <CustomFormControl id="telefonoContacto" label="Teléfono de contacto">
        {/* Control personalizado para ingresar el teléfono del contacto */}
        <Input
          placeholder="Teléfono de contacto"
          value={formData.telefonoContacto}
          onChange={handleInputChange}
        />
      </CustomFormControl>
      <CustomFormControl id="nit" label={formData.tipoProveedor === 'Exterior' ? 'RTN' : 'NIT'}>
        {/* Control personalizado para ingresar el NIT o RTN del proveedor */}
        <Input
          placeholder={formData.tipoProveedor === 'Exterior' ? 'RTN' : 'NIT'}
          value={formData.nit}
          onChange={handleInputChange}
        />
      </CustomFormControl>
      <GridItem colSpan={2}>
        <CustomFormControl id="productosPrincipales" label="Productos principales que nos vende">
          {/* Control personalizado para ingresar los productos principales que vende el proveedor */}
          <Textarea
            placeholder="Productos principales"
            value={formData.productosPrincipales}
            onChange={handleInputChange}
          />
        </CustomFormControl>
      </GridItem>
    </Grid>
    <Flex justify="space-between" w="100%" mt={4}>
      {/* Botones para navegar entre pestañas */}
      <Button onClick={handlePreviousTab} colorScheme="teal">Anterior</Button>
      <Button colorScheme="teal" onClick={handleNextTab}>Siguiente</Button>
    </Flex>
  </div>
);

export default InfoProveedor; // Exporta el componente por defecto.
