import React from 'react';
import {
  Box, Button, Input, Select, Flex, Heading, Grid, Table, Thead, Tbody, Tr, Th, Td, IconButton } from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import CustomFormControl from './CustomFormControl';


export const Documentacion = ({
  formData, handleFileChange, documentos, selectedTipoDocumento, setSelectedTipoDocumento,
  handleDeleteDocumento, handlePreviousTab, handleSubmit
}) => (
  <div>
    <Box borderWidth={1} borderRadius="md" p={4} mb={4}>
      <Heading size="sm">DOCUMENTACIÓN REQUERIDA</Heading>
    </Box>
    <Grid templateColumns="repeat(2, 1fr)" gap={6}>
      <CustomFormControl id="tipoDocumento" label="Seleccionar el tipo de documento a subir">
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
        </Select>
      </CustomFormControl>
      <CustomFormControl id="archivo" label="Seleccionar archivo">
        <Input
          type="file"
          onChange={handleFileChange}
        />
      </CustomFormControl>
    </Grid>
    <Box borderWidth={1} borderRadius="md" p={4} mb={4} mt={4}>
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
      <Button onClick={handlePreviousTab} colorScheme="teal">Anterior</Button>
      <Button mt={4} colorScheme="teal" onClick={handleSubmit}>ENVIAR</Button>
    </Flex>
  </div>
);

export default Documentacion;
