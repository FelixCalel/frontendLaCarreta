import { useEffect, useState } from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, Box, Spinner, Text, Button, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Input, FormControl, FormLabel, FormErrorMessage, Switch, Select, IconButton } from '@chakra-ui/react';
import { EditIcon } from '@chakra-ui/icons';
import { format } from 'date-fns';
import { useDispatch, useSelector } from 'react-redux';
import { tablaCiudad, addNewCiudad, deleteCiudad, updateCiudad, toggleCiudadStatus, tablaPais } from '../../store/Ciudad/thunks';

const PageFormCiudad = () => {
  const dispatch = useDispatch();
  const { data, status, error, paises, paisesStatus, paisesError } = useSelector((state) => state.ciudades);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentCiudad, setCurrentCiudad] = useState({ id: '', nombre: '', estaActivo: true, paisId: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (status === 'idle') {
      dispatch(tablaCiudad());
    }
    if (paisesStatus === 'idle') {
      dispatch(tablaPais());
    }
  }, [dispatch, status, paisesStatus]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : (name === 'paisId' ? parseInt(value, 10) : value);
    setCurrentCiudad({ ...currentCiudad, [name]: newValue });
    setErrors({ ...errors, [name]: '' }); // Limpiar el error al cambiar el valor
  };

  const validateFields = () => {
    let formErrors = {};
    if (!currentCiudad.nombre) formErrors.nombre = 'El nombre es obligatorio';
    if (!currentCiudad.paisId) formErrors.paisId = 'El país es obligatorio';
    return formErrors;
  };

  const handleSubmit = () => {
    const formErrors = validateFields();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    if (isEditMode) {
      dispatch(updateCiudad(currentCiudad)).then(() => {
        onClose();
        dispatch(tablaCiudad());
      });
    } else {
      dispatch(addNewCiudad(currentCiudad)).then(() => {
        onClose();
        dispatch(tablaCiudad());
      });
    }
  };

  const handleDelete = (id) => {
    dispatch(deleteCiudad(id)).then(() => {
      dispatch(tablaCiudad());
    });
  };

  const handleToggleStatus = (id, estaActivo) => {
    dispatch(toggleCiudadStatus({ id, estaActivo })).then(() => {
      dispatch(tablaCiudad());
    });
  };

  const handleEdit = (ciudad) => {
    setCurrentCiudad(ciudad);
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
      <Button colorScheme="green" onClick={() => { setIsEditMode(false); setCurrentCiudad({ nombre: '', estaActivo: true, paisId: '' }); onOpen(); }} mb="20px">Agregar Ciudad</Button>
      <Table variant="striped" colorScheme="teal" size="sm">
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>CIUDAD</Th>
            <Th>Fecha de Creación</Th>
            <Th>Fecha de Actualización</Th>
            <Th>Estado</Th>
            <Th>País</Th>
            <Th>Acciones</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.map((ciudad) => (
            <Tr key={ciudad.id}>
              <Td>{ciudad.id}</Td>
              <Td>{ciudad.nombre}</Td>
              <Td>{formatDate(ciudad.creadoEl)}</Td>
              <Td>{formatDate(ciudad.actualizadoEl)}</Td>
              <Td>
                <Switch name="estaActivo" isChecked={ciudad.estaActivo} onChange={() => handleToggleStatus(ciudad.id, !ciudad.estaActivo)} />
              </Td>
              <Td>{paisMap[ciudad.paisId] || 'Sin país'}</Td>
              <Td>
                <Button colorScheme="red" onClick={() => handleDelete(ciudad.id)} mr={2}>Eliminar</Button>
                <IconButton icon={<EditIcon />} onClick={() => handleEdit(ciudad)} />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{isEditMode ? 'Actualizar Ciudad' : 'Agregar Nueva Ciudad'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={3} isInvalid={errors.nombre} isRequired>
              <FormLabel>Nombre de la Ciudad</FormLabel>
              <Input
                name="nombre"
                value={currentCiudad.nombre}
                onChange={handleInputChange}
              />
              {errors.nombre && <FormErrorMessage>{errors.nombre}</FormErrorMessage>}
            </FormControl>
            <FormControl display="flex" alignItems="center" mb={3}>
              <FormLabel mb="0">Activo</FormLabel>
              <Switch
                name="estaActivo"
                isChecked={currentCiudad.estaActivo}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl mb={3} isInvalid={errors.paisId} isRequired>
              <FormLabel>País</FormLabel>
              <Select
                name="paisId"
                value={currentCiudad.paisId}
                onChange={handleInputChange}
              >
                <option value="" disabled>Seleccione un país</option>
                {paises.map((pais) => (
                  <option key={pais.id} value={pais.id}>
                    {pais.nombre}
                  </option>
                ))}
              </Select>
              {errors.paisId && <FormErrorMessage>{errors.paisId}</FormErrorMessage>}
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

export default PageFormCiudad;
