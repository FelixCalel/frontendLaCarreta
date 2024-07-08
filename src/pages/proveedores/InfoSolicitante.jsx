import React from 'react'; // Importa la biblioteca React.
import { Box, Button, FormLabel, Input, Select, Flex, Heading, Grid } from '@chakra-ui/react'; // Importa componentes de Chakra UI.
import CustomFormControl from './CustomFormControl'; // Importa un componente personalizado.

export const InfoSolicitante = ({ formData, handleInputChange, handleNextTab, handlePreviousTab, tabIndex }) => (
  // Componente funcional que recibe las props formData, handleInputChange, handleNextTab, handlePreviousTab y tabIndex.
  <div>
    <Flex align="center" justify="space-between" mb={4}>
      {/* Contenedor para la información del solicitante */}
      <Box borderWidth={1} borderRadius="sm" p={4} flexGrow={1}>
        <Heading size="sm">INFORMACIÓN DEL SOLICITANTE</Heading>
      </Box>
      {/* Contenedor para la fecha de solicitud */}
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
      {/* Utiliza un componente de cuadrícula para organizar los campos del formulario en dos columnas */}
      <CustomFormControl id="empresaSolicitante" label="Empresa donde solicita PRO">
        {/* Control personalizado para seleccionar la empresa solicitante */}
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
        {/* Control personalizado para ingresar el nombre del solicitante */}
        <Input
          placeholder="Nombre del Solicitante"
          value={formData.nombreSolicitante}
          onChange={handleInputChange}
        />
      </CustomFormControl>
    </Grid>
    <Flex justify="space-between" w="100%" mt={4}>
      {/* Botones para navegar entre pestañas */}
      <Button onClick={handlePreviousTab} colorScheme="teal" visibility={tabIndex === 0 ? 'hidden' : 'visible'}>Anterior</Button>
      {/* Botón "Anterior" se oculta en la primera pestaña */}
      <Button colorScheme="teal" onClick={handleNextTab}>Siguiente</Button>
    </Flex>
  </div>
);

export default InfoSolicitante; // Exporta el componente por defecto.
