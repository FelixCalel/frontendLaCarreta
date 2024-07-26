import { useEffect, useState } from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
  Spinner,
  Text,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Input,
  FormControl,
  FormLabel,
  Switch,
  IconButton
} from '@chakra-ui/react';
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
  const [localData, setLocalData] = useState([]);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(tablaPais());
    }
  }, [dispatch, status]);

  useEffect(() => {
    setLocalData(data.slice().sort((a, b) => a.id - b.id));
  }, [data]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentPais({ ...currentPais, [name]: value });
  };

  const handleSubmit = () => {
    if (isEditMode) {
      dispatch(updatePais(currentPais)).then(() => {
        onClose();
      });
    } else {
      dispatch(addNewPais(currentPais)).then(() => {
        onClose();
      });
    }
  };

  const handleDelete = (id) => {
    dispatch(deletePais(id)).then(() => {
      setLocalData(localData.filter(pais => pais.id !== id));
    });
  };

  const handleToggleStatus = (id, isActive) => {
    dispatch(togglePaisStatus({ id, isActive })).then(() => {
      setLocalData(localData.map(pais => pais.id === id ? { ...pais, isActive } : pais));
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
      <Text fontSize="2xl" mb="20px">Página de Paises</Text>
      <Button colorScheme="green" onClick={() => { setIsEditMode(false); setCurrentPais({ nombre: '' }); onOpen(); }} mb="20px">Agregar País</Button>
      <Box overflowX="auto">
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
            {localData.map((pais) => (
              <Tr key={pais.id}>
                <Td>{pais.id}</Td>
                <Td>{pais.nombre}</Td>
                <Td>{formatDate(pais.createdAt)}</Td>
                <Td>{formatDate(pais.updatedAt)}</Td>
                <Td>
                  <Switch isChecked={pais.isActive} onChange={() => handleToggleStatus(pais.id, !pais.isActive)} />
                </Td>
                <Td>
                  <Button colorScheme="red" onClick={() => handleDelete(pais.id)} mr={2}>Eliminar</Button>
                  <IconButton icon={<EditIcon />} onClick={() => handleEdit(pais)} />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

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
