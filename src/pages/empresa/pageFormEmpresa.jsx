import { useEffect, useState } from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, Box, Spinner, Text, Button, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Input, FormControl, FormLabel, Switch, Select, IconButton } from '@chakra-ui/react';
import { EditIcon } from '@chakra-ui/icons';
import { format } from 'date-fns';
import { useDispatch, useSelector } from 'react-redux';
import { tablaEmpresa, addNewEmpresa, deleteEmpresa, updateEmpresa, toggleEmpresaStatus, tablaPais } from '../../store/Empresa/thunks';

const PageFormEmpresa = () => {
  const dispatch = useDispatch();
  const { data, status, error, paises, paisesStatus, paisesError } = useSelector((state) => state.empresas);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentEmpresa, setCurrentEmpresa] = useState({ id: '', nombre: '', alias: '', estaActivo: true, baseDatos: '', ipBaseDatos: '', paisId: '' });

  useEffect(() => {
    if (status === 'idle') {
      dispatch(tablaEmpresa());
    }
    if (paisesStatus === 'idle') {
      dispatch(tablaPais());  // Despachar tablaPais para obtener los países
    }
  }, [dispatch, status, paisesStatus]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : (name === 'paisId' ? parseInt(value, 10) : value);  // Convierte paisId a número
    setCurrentEmpresa({ ...currentEmpresa, [name]: newValue });
  };

  const handleSubmit = () => {
    if (isEditMode) {
      dispatch(updateEmpresa(currentEmpresa)).then(() => {
        onClose();
        dispatch(tablaEmpresa());
      });
    } else {
      dispatch(addNewEmpresa(currentEmpresa)).then(() => {
        onClose();
        dispatch(tablaEmpresa());
      });
    }
  };

  const handleDelete = (id) => {
    dispatch(deleteEmpresa(id)).then(() => {
      dispatch(tablaEmpresa());
    });
  };

  const handleToggleStatus = (id, estaActivo) => {
    dispatch(toggleEmpresaStatus({ id, estaActivo })).then(() => {
      dispatch(tablaEmpresa());
    });
  };

  const handleEdit = (empresa) => {
    setCurrentEmpresa(empresa);
    setIsEditMode(true);
    onOpen();
  };

  const formatDate = (dateString) => {
    try {
      return dateString ? format(new Date(dateString), 'dd-MM-yyyy HH:mm:ss') : 'Fecha inválida';
    } catch (error) {
      console.error("Fecha inválida:", dateString);
      return "Fecha inválida";
    }
  };

  if (status === 'loading' || paisesStatus === 'loading') {  
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Spinner size="xl" />
      </Box>
    );
  }

  if (status === 'failed' || paisesStatus === 'failed') { 
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Text fontSize="2xl" color="red.500">Error al cargar los datos: {error || paisesError}</Text>
      </Box>
    );
  }

  const paisMap = paises.reduce((acc, pais) => {
    acc[pais.id] = pais.nombre;
    return acc;
  }, {});

  return (
    <Box padding="20px" overflowX="auto">
      <Button colorScheme="green" onClick={() => { setIsEditMode(false); setCurrentEmpresa({ nombre: '', alias: '', estaActivo: true, baseDatos: '', ipBaseDatos: '', paisId: '' }); onOpen(); }} mb="20px">Agregar Empresa</Button>
      <Table variant="striped" colorScheme="teal" size="sm">
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>NOMBRE</Th>
            <Th>ALIAS</Th>
            <Th>Fecha de Creación</Th>
            <Th>Fecha de Actualización</Th>
            <Th>Estado</Th>
            <Th>Base de datos</Th>
            <Th>IP SAP</Th>
            <Th>País</Th> 
            <Th>Acciones</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.map((empresa) => (
            <Tr key={empresa.id}>
              <Td>{empresa.id}</Td>
              <Td>{empresa.nombre}</Td>
              <Td>{empresa.alias}</Td>
              <Td>{formatDate(empresa.creadoEl)}</Td>
              <Td>{formatDate(empresa.actualizadoEl)}</Td>
              <Td>
                <Switch name="estaActivo" isChecked={empresa.estaActivo} onChange={() => handleToggleStatus(empresa.id, !empresa.estaActivo)} />
              </Td>
              <Td>{empresa.baseDatos}</Td>
              <Td>{empresa.ipBaseDatos}</Td>
              <Td>{paisMap[empresa.paisId] || 'Sin país'}</Td>
              <Td>
                <Button colorScheme="red" onClick={() => handleDelete(empresa.id)} mr={2}>Eliminar</Button>
                <IconButton icon={<EditIcon />} onClick={() => handleEdit(empresa)} />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{isEditMode ? 'Actualizar Empresa' : 'Agregar Nueva Empresa'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={3}>
              <FormLabel>Nombre de la Empresa</FormLabel>
              <Input
                name="nombre"
                value={currentEmpresa.nombre}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>Alias</FormLabel>
              <Input
                name="alias"
                value={currentEmpresa.alias}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl display="flex" alignItems="center" mb={3}>
              <FormLabel mb="0">Activo</FormLabel>
              <Switch
                name="estaActivo"
                isChecked={currentEmpresa.estaActivo}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>Base de datos</FormLabel>
              <Input
                name="baseDatos"
                value={currentEmpresa.baseDatos}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>IP SAP</FormLabel>
              <Input
                name="ipBaseDatos"
                value={currentEmpresa.ipBaseDatos}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>País</FormLabel>
              <Select
                name="paisId"
                value={currentEmpresa.paisId}
                onChange={handleInputChange}
              >
                <option value="" disabled>Seleccione un país</option>
                {paises.map((pais) => (
                  <option key={pais.id} value={pais.id}>
                    {pais.nombre}
                  </option>
                ))}
              </Select>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
              {isEditMode ? 'Actualizar' : 'Guardar'}
            </Button>
            <Button variant="ghost" onClick={onClose}>Cancelar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default PageFormEmpresa;
