import React from 'react'; // Importa la biblioteca React.
import {
  Box, Button, Input, Select, Flex, Heading, Grid, Table, Thead, Tbody, Tr, Th, Td, IconButton 
} from '@chakra-ui/react'; // Importa componentes de Chakra UI.
import { DeleteIcon } from '@chakra-ui/icons'; // Importa el icono de eliminación de Chakra UI.
import CustomFormControl from './CustomFormControl'; // Importa un componente personalizado.

export const Documentacion = ({
  formData, handleFileChange, documentos, selectedTipoDocumento, setSelectedTipoDocumento,
  handleDeleteDocumento, handlePreviousTab, handleSubmit
}) => (
  // Componente funcional que recibe varias props para manejar la documentación.
  <div>
    {/* Contenedor para el encabezado de documentación requerida */}
    <Box borderWidth={1} borderRadius="md" p={4} mb={4}>
      <Heading size="sm">DOCUMENTACIÓN REQUERIDA</Heading>
    </Box>
    <Grid templateColumns="repeat(2, 1fr)" gap={6}>
      {/* Utiliza un componente de cuadrícula para organizar los campos del formulario en dos columnas */}
      <CustomFormControl id="tipoDocumento" label="Seleccionar el tipo de documento a subir">
        {/* Control personalizado para seleccionar el tipo de documento */}
        <Select
          placeholder="Seleccione un tipo de documento"
          value={selectedTipoDocumento}
          onChange={(e) => setSelectedTipoDocumento(e.target.value)}
        >
          <option value="CartaAceptacion">Carta de Aceptación de Pago</option>
          <option value="RTU">RTU</option>
          <option value="PatenteComercio">Patente de Comercio</option>
          <option value="DPI">DPI</option>
          <option value="PasaporteRTN">Pasaporte o RTN</option>
          <option value="CotizacionFactura">Cotización o Factura</option>
          <option value="Verificacion de omisos">Verificación de Omisos</option>
        </Select>
      </CustomFormControl>
      <CustomFormControl id="archivo" label="Seleccionar archivo">
        {/* Control personalizado para seleccionar un archivo */}
        <Input
          type="file"
          onChange={handleFileChange}
        />
      </CustomFormControl>
    </Grid>
    <Box borderWidth={1} borderRadius="md" p={4} mb={4} mt={4}>
      {/* Contenedor para la tabla de documentos almacenados */}
      <Heading size="sm" textAlign="center">Documentos almacenados</Heading>
      <Table mt={4}>
        <Thead>
          <Tr>
            <Th>Número de Documento</Th>
            <Th>Tipo de Documento</Th>
            <Th>Nombre del Documento</Th>
            <Th>Acciones</Th>
          </Tr>
        </Thead>
        <Tbody>
          {documentos.map((doc, index) => (
            <Tr key={index}>
              <Td>{doc.numero}</Td>
              <Td>{doc.tipo}</Td>
              <Td>{doc.nombre}</Td>
              <Td>
                {/* Botón para eliminar un documento */}
                <IconButton
                  icon={<DeleteIcon />}
                  colorScheme="red"
                  onClick={() => handleDeleteDocumento(doc.numero)}
                />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
    <Flex justify="space-between" w="100%" mt={4}>
      {/* Botones para navegar entre pestañas y enviar el formulario */}
      <Button onClick={handlePreviousTab} colorScheme="teal">Anterior</Button>
      <Button mt={4} colorScheme="teal" onClick={handleSubmit}>ENVIAR</Button>
    </Flex>
  </div>
);

export default Documentacion; // Exporta el componente por defecto.
