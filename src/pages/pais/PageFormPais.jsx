import { useEffect, useState } from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, Box, Spinner, Text, Button, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Input, FormControl, FormLabel, Switch, IconButton } from '@chakra-ui/react';
import { EditIcon } from '@chakra-ui/icons';
import { format } from 'date-fns';
import { useDispatch, useSelector } from 'react-redux';
import { tablaPais, addNewPais, deletePais, updatePais, togglePaisStatus } from '../../store/pais/thunks';

const PageFormPais = () => {
  const dispatch = useDispatch();
  const { data, status, error } = useSelector((state) => state.paises);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentPais, setCurrentPais] = useState({ id: '', nombre: '' });

  useEffect(() => {
    if (status === 'idle') {
      dispatch(tablaPais());
    }
  }, [dispatch, status]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentPais({ ...currentPais, [name]: value });
  };

  const handleSubmit = () => {
    if (isEditMode) {
      dispatch(updatePais(currentPais)).then(() => {
        onClose();
        dispatch(tablaPais());
      });
    } else {
      dispatch(addNewPais(currentPais)).then(() => {
        onClose();
        dispatch(tablaPais());
      });
    }
  };

  const handleDelete = (id) => {
    dispatch(deletePais(id)).then(() => {
      dispatch(tablaPais());
    });
  };

  const handleToggleStatus = (id, estaActivo) => {
    dispatch(togglePaisStatus({ id, estaActivo })).then(() => {
      dispatch(tablaPais());
    });
  };

  const handleEdit = (pais) => {
    setCurrentPais(pais);
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
      <Button colorScheme="green" onClick={() => { setIsEditMode(false); setCurrentPais({ nombre: '' }); onOpen(); }} mb="20px">Agregar País</Button>
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
          {data.map((pais) => (
            <Tr key={pais.id}>
              <Td>{pais.id}</Td>
              <Td>{pais.nombre}</Td>
              <Td>{formatDate(pais.creadoEl)}</Td>
              <Td>{formatDate(pais.actualizadoEl)}</Td>
              <Td>
                <Switch isChecked={pais.estaActivo} onChange={() => handleToggleStatus(pais.id, !pais.estaActivo)} />
              </Td>
              <Td>
                <Button colorScheme="red" onClick={() => handleDelete(pais.id)} mr={2}>Eliminar</Button>
                <IconButton icon={<EditIcon />} onClick={() => handleEdit(pais)} />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{isEditMode ? 'Actualizar País' : 'Agregar Nuevo País'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Nombre del País</FormLabel>
              <Input
                name="nombre"
                value={currentPais.nombre}
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

export default PageFormPais;
