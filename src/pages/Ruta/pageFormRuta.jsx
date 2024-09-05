import { useEffect, useState } from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, Box, Spinner, Text, Button, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Input, FormControl, FormLabel, FormErrorMessage, Switch, Select, IconButton } from '@chakra-ui/react';
import { EditIcon } from '@chakra-ui/icons';
import { format } from 'date-fns';
import { useDispatch, useSelector } from 'react-redux';
import { tablaRuta, addNewRuta, deleteRuta, updateRuta, toggleRutaStatus } from '../../store/Ruta/thunks';

const PageFormRuta = () => {
  const dispatch = useDispatch();
  const { data, status, error, rutas, rutasStatus, rutasError } = useSelector((state) => state.rutas);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentRuta, setCurrentRuta] = useState({ id: '', nombre: '', estaActivo: true, rutaId: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (status === 'idle') {
      dispatch(tablaRuta());
    }

  }, [dispatch, status, rutasStatus]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : (name === 'rutaId' ? parseInt(value, 10) : value);
    setCurrentRuta({ ...currentRuta, [name]: newValue });
    setErrors({ ...errors, [name]: '' }); // Limpiar el error al cambiar el valor
  };

  const validateFields = () => {
    let formErrors = {};
    if (!currentRuta.nombre) formErrors.nombre = 'El nombre es obligatorio';
    if (!currentRuta.rutaId) formErrors.rutaId = 'La ruta es obligatoria';
    return formErrors;
  };

  const handleSubmit = () => {
    const formErrors = validateFields();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    if (isEditMode) {
      dispatch(updateRuta(currentRuta)).then(() => {
        onClose();
        dispatch(tablaRuta());
      });
    } else {
      dispatch(addNewRuta(currentRuta)).then(() => {
        onClose();
        dispatch(tablaRuta());
      });
    }
  };

  const handleDelete = (id) => {
    dispatch(deleteRuta(id)).then(() => {
      dispatch(tablaRuta());
    });
  };

  const handleToggleStatus = (id, estaActivo) => {
    dispatch(toggleRutaStatus({ id, estaActivo })).then(() => {
      dispatch(tablaRuta());
    });
  };

  const handleEdit = (ruta) => {
    setCurrentRuta(ruta);
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

  if (status === 'loading' || rutasStatus === 'loading') {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Spinner size="xl" />
      </Box>
    );
  }

  if (status === 'failed' || rutasStatus === 'failed') {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Text fontSize="2xl" color="red.500">Error al cargar los datos: {error || rutasError}</Text>
      </Box>
    );
  }

  const rutaMap = rutas.reduce((acc, ruta) => {
    acc[ruta.id] = ruta.nombre;
    return acc;
  }, {});

  return (
    <Box padding="20px" overflowX="auto">
      <Button colorScheme="green" onClick={() => { setIsEditMode(false); setCurrentRuta({ nombre: '', estaActivo: true, rutaId: '' }); onOpen(); }} mb="20px">Agregar Ruta</Button>
      <Table variant="striped" colorScheme="teal" size="sm">
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>RUTA</Th>
            <Th>Fecha de Creación</Th>
            <Th>Fecha de Actualización</Th>
            <Th>Estado</Th>
            <Th>Ruta</Th>
            <Th>Acciones</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.map((ruta) => (
            <Tr key={ruta.id}>
              <Td>{ruta.id}</Td>
              <Td>{ruta.nombre}</Td>
              <Td>{formatDate(ruta.creadoEl)}</Td>
              <Td>{formatDate(ruta.actualizadoEl)}</Td>
              <Td>
                <Switch name="estaActivo" isChecked={ruta.estaActivo} onChange={() => handleToggleStatus(ruta.id, !ruta.estaActivo)} />
              </Td>
              <Td>{rutaMap[ruta.rutaId] || 'Sin ruta'}</Td>
              <Td>
                <Button colorScheme="red" onClick={() => handleDelete(ruta.id)} mr={2}>Eliminar</Button>
                <IconButton icon={<EditIcon />} onClick={() => handleEdit(ruta)} />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{isEditMode ? 'Actualizar Ruta' : 'Agregar Nueva Ruta'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={3} isInvalid={errors.nombre} isRequired>
              <FormLabel>Nombre de la Ruta</FormLabel>
              <Input
                name="nombre"
                value={currentRuta.nombre}
                onChange={handleInputChange}
              />
              {errors.nombre && <FormErrorMessage>{errors.nombre}</FormErrorMessage>}
            </FormControl>
            <FormControl display="flex" alignItems="center" mb={3}>
              <FormLabel mb="0">Activo</FormLabel>
              <Switch
                name="estaActivo"
                isChecked={currentRuta.estaActivo}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl mb={3} isInvalid={errors.rutaId} isRequired>
              <FormLabel>Ruta</FormLabel>
              <Select
                name="rutaId"
                value={currentRuta.rutaId}
                onChange={handleInputChange}
              >
                <option value="" disabled>Seleccione una ruta</option>
                {rutas.map((ruta) => (
                  <option key={ruta.id} value={ruta.id}>
                    {ruta.nombre}
                  </option>
                ))}
              </Select>
              {errors.rutaId && <FormErrorMessage>{errors.rutaId}</FormErrorMessage>}
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

export default PageFormRuta;
