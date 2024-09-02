import { useEffect, useState } from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, Box, Spinner, Text, Button, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Input, FormControl, FormLabel, Switch, IconButton } from '@chakra-ui/react';
import { EditIcon } from '@chakra-ui/icons';
import { format } from 'date-fns';
import { useDispatch, useSelector } from 'react-redux';
import { tablaEmpresa, addNewEmpresa, deleteEmpresa, updateEmpresa, toggleEmpresaStatus } from '../../store/empresa/thunks';

const PageFormEmpresa = () => {
  const dispatch = useDispatch();
  const { data, status, error } = useSelector((state) => state.empresas);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentEmpresa, setCurrentEmpresa] = useState({ id: '', nombre: '' });

  useEffect(() => {
    if (status === 'idle') {
      dispatch(tablaEmpresa());
    }
  }, [dispatch, status]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentEmpresa({ ...currentEmpresa, [name]: value });
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
  
  

  if (status === 'loading') {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Spinner size="xl" />
      </Box>
    );
  }

  if (status === 'failed') {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Text fontSize="2xl" color="red.500">Error al cargar los datos: {error}</Text>
      </Box>
    );
  }

  return (
    <Box padding="20px">
      <Button colorScheme="green" onClick={() => { setIsEditMode(false); setCurrentEmpresa({ nombre: '' }); onOpen(); }} mb="20px">Agregar Empresa</Button>
      <Table variant="striped" colorScheme="teal">
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>NOMBRE</Th>
            <Th>Fecha de Creación</Th>
            <Th>Fecha de Actualización</Th>
            <Th>Estado</Th>
            <Th>Acciones</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.map((empresa) => (
            <Tr key={empresa.id}>
              <Td>{empresa.id}</Td>
              <Td>{empresa.nombre}</Td>
              <Td>{formatDate(empresa.creadoEl)}</Td>
              <Td>{formatDate(empresa.actualizadoEl)}</Td>
              <Td>
                <Switch isChecked={empresa.estaActivo} onChange={() => handleToggleStatus(empresa.id, !empresa.estaActivo)} />
              </Td>
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
            <FormControl>
              <FormLabel>Nombre de la Empresa</FormLabel>
              <Input
                name="nombre"
                value={currentEmpresa.nombre}
                onChange={handleInputChange}
              />
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
