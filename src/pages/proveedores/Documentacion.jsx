import React, { useEffect, useState } from 'react';
import {
  Box, Button, Input, Select, Flex, Heading, Grid, Table, Thead, Tbody, Tr, Th, Td, IconButton, Spinner 
} from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedTipoDocumento, addDocumento, removeDocumento } from '../../store/proveedores/Documentacion/DocumentacionSlice';
import { fetchTiposDocumento } from '../../store/proveedores/Documentacion/thunks';
import CustomFormControl from './CustomFormControl';

const Documentacion = ({ handlePreviousTab, handleSubmit, tipoProveedorId, localidadId }) => {
  const dispatch = useDispatch();
  const documentos = useSelector((state) => state.documentacion.documentos);
  const tiposDocumento = useSelector((state) => state.documentacion.tiposDocumento);
  const selectedTipoDocumento = useSelector((state) => state.documentacion.selectedTipoDocumento);
  const tiposDocumentoStatus = useSelector((state) => state.documentacion.status);
  const tiposDocumentoError = useSelector((state) => state.documentacion.error);

  const [selectedFile, setSelectedFile] = useState(null);
  const [fileMap, setFileMap] = useState(new Map());

  useEffect(() => {
    console.log('Proveedor Id es:', tipoProveedorId);

    if (tipoProveedorId && localidadId) {
      dispatch(fetchTiposDocumento({ tipoProveedorId, localidadId }));
    }
  }, [dispatch, tipoProveedorId, localidadId]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleAddDocumento = () => {
    if (selectedFile && selectedTipoDocumento) {
      const newDoc = {
        numero: documentos.length + 1,
        tipo: selectedTipoDocumento,
        nombre: selectedFile.name,
      };
      dispatch(addDocumento(newDoc));
      setFileMap(new Map(fileMap.set(newDoc.numero, selectedFile))); // Guardar el archivo en el estado local
      setSelectedFile(null);
      dispatch(setSelectedTipoDocumento(''));
    }
  };

  const handleDeleteDocumento = (numero) => {
    dispatch(removeDocumento(numero));
    setFileMap(prevMap => {
      const newMap = new Map(prevMap);
      newMap.delete(numero);
      return newMap;
    });
  };

  const handleTipoDocumentoChange = (e) => {
    dispatch(setSelectedTipoDocumento(e.target.value));
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    // Aquí podrías manejar la lógica de envío si es necesario
    // Por ejemplo, enviar los archivos guardados en fileMap al servidor
    handleSubmit();
  };

  return (
    <div>
      <Box borderWidth={1} borderRadius="md" p={4} mb={4}>
        <Heading size="sm">DOCUMENTACIÓN REQUERIDA</Heading>
      </Box>
      <Grid templateColumns="repeat(3, 1fr)" gap={6}>
        <CustomFormControl id="tipoDocumento" label="Seleccionar el tipo de documento a subir">
          {tiposDocumentoStatus === 'loading' ? (
            <Spinner />
          ) : tiposDocumentoError ? (
            <Box color="red.500">Error al cargar los tipos de documentos</Box>
          ) : (
            <Select
              id="tipoDocumento"
              placeholder="Seleccione un tipo de documento"
              value={selectedTipoDocumento}
              onChange={handleTipoDocumentoChange}
            >
              {Array.isArray(tiposDocumento) && tiposDocumento.map((tipo) => (
                <option key={tipo.value} value={tipo.value}>{tipo.label}</option>
              ))}
            </Select>
          )}
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
