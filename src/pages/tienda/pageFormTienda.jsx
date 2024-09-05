import { useEffect, useState } from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, Box, Spinner, Text, Button, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Input, FormControl, FormLabel, FormErrorMessage, Switch, Select, IconButton } from '@chakra-ui/react';
import { EditIcon } from '@chakra-ui/icons';
import { format } from 'date-fns';
import { useDispatch, useSelector } from 'react-redux';
import { tablaTienda, addNewTienda, deleteTienda, updateTienda, toggleTiendaStatus, tablaDeudor } from '../../store/Tienda/thunks';
// import { tablaCiudad } from '../../store/Ciudad/thunks';
import CiudadSelector  from './componentes/CiudadSelector';
import RutaSelector from './componentes/RutaSelector'

const PageFormTienda = () => {
  const dispatch = useDispatch();
  const { data, status, error, ciudades, rutas, deudores, ciudadesStatus, rutasStatus, deudoresStatus } = useSelector((state) => state.tiendas);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentTienda, setCurrentTienda] = useState({ id: '', nombre: '', descuento: 0, estaActivo: true, deudorId: '', ciudadId: '', rutaId: '', usuarioCreadoPorId: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (status === 'idle') {
      dispatch(tablaTienda());
    }
    // if {
      // const ciudades = dispatch(tablaCiudad(ciudades));
    // }
    // if (rutasStatus === 'idle') {
    //   dispatch(tablaRuta());
    // }
    if (deudoresStatus === 'idle') {
      dispatch(tablaDeudor());
    }
  }, [dispatch, status, ciudadesStatus, rutasStatus, deudoresStatus]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : (name === 'deudorId' || name === 'ciudadId' || name === 'rutaId' ? parseInt(value, 10) : value);
    setCurrentTienda({ ...currentTienda, [name]: newValue });
    setErrors({ ...errors, [name]: '' }); 
  };

  const validateFields = () => {
    let formErrors = {};
    if (!currentTienda.nombre) formErrors.nombre = 'El nombre es obligatorio';
    if (currentTienda.descuento === undefined) formErrors.descuento = 'El descuento es obligatorio';
    if (!currentTienda.deudorId) formErrors.deudorId = 'El deudor es obligatorio';
    if (!currentTienda.ciudadId) formErrors.ciudadId = 'La ciudad es obligatoria';
    if (!currentTienda.rutaId) formErrors.rutaId = 'La ruta es obligatoria';
    if (!currentTienda.usuarioCreadoPorId) formErrors.usuarioCreadoPorId = 'El ID del usuario creador es obligatorio';
    return formErrors;
  };

  const handleSubmit = () => {
    const formErrors = validateFields();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    if (isEditMode) {
      dispatch(updateTienda(currentTienda)).then(() => {
        onClose();
        dispatch(tablaTienda());
      });
    } else {
      dispatch(addNewTienda(currentTienda)).then(() => {
        onClose();
        dispatch(tablaTienda());
      });
    }
  };

  const handleDelete = (id) => {
    dispatch(deleteTienda(id)).then(() => {
      dispatch(tablaTienda());
    });
  };

  const handleToggleStatus = (id, estaActivo) => {
    dispatch(toggleTiendaStatus({ id, estaActivo })).then(() => {
      dispatch(tablaTienda());
    });
  };

  const handleEdit = (tienda) => {
    setCurrentTienda(tienda);
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

  if (status === 'loading' || ciudadesStatus === 'loading' || rutasStatus === 'loading' || deudoresStatus === 'loading') {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Spinner size="xl" />
      </Box>
    );
  }

  if (status === 'failed' || ciudadesStatus === 'failed' || rutasStatus === 'failed' || deudoresStatus === 'failed') {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Text fontSize="2xl" color="red.500">Error al cargar los datos: {error}</Text>
      </Box>
    );
  }

  const ciudadMap = ciudades.reduce((acc, ciudad) => {
    acc[ciudad.id] = ciudad.nombre;
    return acc;
  }, {});

  const rutaMap = rutas.reduce((acc, ruta) => {
    acc[ruta.id] = ruta.nombre;
    return acc;
  }, {});

  const deudorMap = deudores.reduce((acc, deudor) => {
    acc[deudor.id] = deudor.nombre;
    return acc;
  }, {});

  return (
    <Box padding="20px" overflowX="auto">
      <Button colorScheme="green" onClick={() => { setIsEditMode(false); setCurrentTienda({ nombre: '', descuento: 0, estaActivo: true, deudorId: '', ciudadId: '', rutaId: '', usuarioCreadoPorId: '' }); onOpen(); }} mb="20px">Agregar Tienda</Button>
      <Table variant="striped" colorScheme="teal" size="sm">
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>NOMBRE</Th>
            <Th>DESCUENTO</Th>
            <Th>Fecha de Creación</Th>
            <Th>Fecha de Actualización</Th>
            <Th>Estado</Th>
            <Th>Deudor</Th>
            <Th>Ciudad</Th>
            <Th>Ruta</Th>
            <Th>Acciones</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.map((tienda) => (
            <Tr key={tienda.id}>
              <Td>{tienda.id}</Td>
              <Td>{tienda.nombre}</Td>
              <Td>{tienda.descuento}</Td>
              <Td>{formatDate(tienda.creadoEl)}</Td>
              <Td>{formatDate(tienda.actualizadoEl)}</Td>
              <Td>
                <Switch name="estaActivo" isChecked={tienda.estaActivo} onChange={() => handleToggleStatus(tienda.id, !tienda.estaActivo)} />
              </Td>
              <Td>{deudorMap[tienda.deudorId] || 'Sin deudor'}</Td>
              <Td>{ciudadMap[tienda.ciudadId] || 'Sin ciudad'}</Td>
              <Td>{rutaMap[tienda.rutaId] || 'Sin ruta'}</Td>
              <Td>
                <Button colorScheme="red" onClick={() => handleDelete(tienda.id)} mr={2}>Eliminar</Button>
                <IconButton icon={<EditIcon />} onClick={() => handleEdit(tienda)} />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{isEditMode ? 'Actualizar Tienda' : 'Agregar Nueva Tienda'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={3} isInvalid={errors.nombre} isRequired>
              <FormLabel>Nombre de la Tienda</FormLabel>
              <Input
                name="nombre"
                value={currentTienda.nombre}
                onChange={handleInputChange}
              />
              {errors.nombre && <FormErrorMessage>{errors.nombre}</FormErrorMessage>}
            </FormControl>
            <FormControl mb={3} isInvalid={errors.descuento} isRequired>
              <FormLabel>Descuento</FormLabel>
              <Input
                name="descuento"
                value={currentTienda.descuento}
                onChange={handleInputChange}
              />
              {errors.descuento && <FormErrorMessage>{errors.descuento}</FormErrorMessage>}
            </FormControl>
            <FormControl display="flex" alignItems="center" mb={3}>
              <FormLabel mb="0">Activo</FormLabel>
              <Switch
                name="estaActivo"
                isChecked={currentTienda.estaActivo}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl mb={3} isInvalid={errors.deudorId} isRequired>
              <FormLabel>Deudor</FormLabel>
              <Select
                name="deudorId"
                value={currentTienda.deudorId}
                onChange={handleInputChange}
              >
                <option value="" disabled>Seleccione un deudor</option>
                {deudores.map((deudor) => (
                  <option key={deudor.id} value={deudor.id}>
                    {deudor.nombre}
                  </option>
                ))}
              </Select>
              {errors.deudorId && <FormErrorMessage>{errors.deudorId}</FormErrorMessage>}
            </FormControl>
            <FormControl mb={3} isInvalid={errors.ciudadId} isRequired>
              <FormLabel>Ciudad</FormLabel>
              <CiudadSelector/>
              {errors.ciudadId && <FormErrorMessage>{errors.ciudadId}</FormErrorMessage>}
            </FormControl>
            <FormControl mb={3} isInvalid={errors.rutaId} isRequired>
              <FormLabel>Ruta</FormLabel>
              <RutaSelector/>
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

export default PageFormTienda;
