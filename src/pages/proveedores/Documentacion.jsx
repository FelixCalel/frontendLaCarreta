import React, { useState } from 'react';
import {
  Box, Button, Input, Select, Flex, Heading, Grid, Table, Thead, Tbody, Tr, Th, Td, IconButton 
} from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedTipoDocumento, addDocumento } from '../../store/proveedores/Documentacion/DocumentacionSlice';
import CustomFormControl from './CustomFormControl'; // Ajusta la ruta según la ubicación real del archivo

const Documentacion = ({ handlePreviousTab, handleSubmit }) => {
  const dispatch = useDispatch();
  const documentos = useSelector((state) => state.documentacion.documentos);
  const selectedTipoDocumento = useSelector((state) => state.documentacion.selectedTipoDocumento);

  const [selectedFile, setSelectedFile] = useState(null);
  const [localDocumentos, setLocalDocumentos] = useState(documentos);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleAddDocumento = () => {
    if (selectedFile && selectedTipoDocumento) {
      const newDoc = {
        numero: localDocumentos.length + 1,
        tipo: selectedTipoDocumento,
        nombre: selectedFile.name,
        file: selectedFile,
      };
      setLocalDocumentos([...localDocumentos, newDoc]);
      dispatch(addDocumento(newDoc));
      setSelectedFile(null);
      dispatch(setSelectedTipoDocumento(''));
    }
  };

  const handleDeleteDocumento = (numero) => {
    setLocalDocumentos(localDocumentos.filter(doc => doc.numero !== numero));
  };

  const handleTipoDocumentoChange = (e) => {
    dispatch(setSelectedTipoDocumento(e.target.value));
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    localDocumentos.forEach(doc => {
      dispatch(uploadDocumento({ tipoDocumento: doc.tipo, file: doc.file }));
    });
    handleSubmit();
  };

  return (
    <div>
      <Box borderWidth={1} borderRadius="md" p={4} mb={4}>
        <Heading size="sm">DOCUMENTACIÓN REQUERIDA</Heading>
      </Box>
      <Grid templateColumns="repeat(3, 1fr)" gap={6}>
        <CustomFormControl id="tipoDocumento" label="Seleccionar el tipo de documento a subir">
          <Select
            placeholder="Seleccione un tipo de documento"
            value={selectedTipoDocumento}
            onChange={handleTipoDocumentoChange}
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
          <Flex alignItems="center">
            <Input
              type="file"
              onChange={handleFileChange}
              key={selectedFile ? selectedFile.name : ''}
              display="none"
              id="fileInput"
            />
            <label htmlFor="fileInput">
              <Button as="span" colorScheme="teal" size="sm">Seleccionar archivo</Button>
            </label>
            <Box ml={4}>
              {selectedFile ? selectedFile.name : 'Sin archivo seleccionado'}
            </Box>
            <Button
              ml={4}
              colorScheme="teal"
              onClick={handleAddDocumento}
              isDisabled={!selectedFile || !selectedTipoDocumento}
              size="sm"
            >
              Agregar Documento
            </Button>
          </Flex>
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
            {localDocumentos.map((doc, index) => (
              <Tr key={index}>
                <Td>{doc.numero}</Td>
                <Td>{doc.tipo}</Td>
                <Td>{doc.nombre}</Td>
                <Td>
                  <IconButton
                    icon={<DeleteIcon />}
                    colorScheme="red"
                    onClick={() => handleDeleteDocumento(doc.numero)}
                    size="sm"
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
      <Flex justifyContent="space-between" w="100%" mt={4}>
        <Button onClick={handlePreviousTab} colorScheme="teal" size="sm">Anterior</Button>
        <Button colorScheme="teal" onClick={handleSubmitForm} size="sm">ENVIAR</Button>
      </Flex>
    </div>
  );
};

export default Documentacion;