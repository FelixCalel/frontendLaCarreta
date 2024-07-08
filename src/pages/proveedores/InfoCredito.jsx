import React from 'react'; // Importa la biblioteca React.
import {
  Box, Button, Input, Select, Flex, Heading, Grid 
} from '@chakra-ui/react'; // Importa componentes de Chakra UI.
import CustomFormControl from './CustomFormControl'; // Importa un componente personalizado.

export const InfoCredito = ({ formData, handleInputChange, handleNextTab, handlePreviousTab }) => (
  // Componente funcional que recibe las props formData, handleInputChange, handleNextTab y handlePreviousTab.
  <div>
    {/* Contenedor para la información de crédito */}
    <Box borderWidth={1} borderRadius="md" p={4} mb={4}>
      <Heading size="sm">INFORMACIÓN DE CRÉDITO</Heading>
    </Box>
    <Grid templateColumns="repeat(2, 1fr)" gap={6}>
      {/* Utiliza un componente de cuadrícula para organizar los campos del formulario en dos columnas */}
      <CustomFormControl id="plazo" label="Plazo">
        {/* Control personalizado para seleccionar el plazo de crédito */}
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
        {/* Control personalizado para ingresar el monto de crédito */}
        <Input
          placeholder="Monto"
          value={formData.monto}
          onChange={handleInputChange}
        />
      </CustomFormControl>
    </Grid>
    <Flex justify="space-between" w="100%" mt={4}>
      {/* Botones para navegar entre pestañas */}
      <Button onClick={handlePreviousTab} colorScheme="teal">Anterior</Button>
      <Button colorScheme="teal" onClick={handleNextTab}>Siguiente</Button>
    </Flex>
  </div>
);

export default InfoCredito; // Exporta el componente por defecto.
