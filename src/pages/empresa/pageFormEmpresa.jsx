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
  FormErrorMessage,
  Switch,
  Select,
  IconButton,
  SimpleGrid,
  VStack,
  useBreakpointValue,
  Flex,
  Badge
} from '@chakra-ui/react';
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
  const [errors, setErrors] = useState({});
  const isMobile = useBreakpointValue({ base: true, md: false });

  useEffect(() => {
    if (status === 'idle') {
      dispatch(tablaEmpresa());
    }
    if (paisesStatus === 'idle') {
      dispatch(tablaPais());
    }
  }, [dispatch, status, paisesStatus]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : (name === 'paisId' ? parseInt(value, 10) : value);
    setCurrentEmpresa({ ...currentEmpresa, [name]: newValue });
    setErrors({ ...errors, [name]: '' });
  };

  const validateFields = () => {
    let formErrors = {};
    if (!currentEmpresa.nombre) formErrors.nombre = 'El nombre es obligatorio';
    if (!currentEmpresa.alias) formErrors.alias = 'El alias es obligatorio';
    if (!currentEmpresa.baseDatos) formErrors.baseDatos = 'La base de datos es obligatoria';
    if (!currentEmpresa.ipBaseDatos) formErrors.ipBaseDatos = 'La IP SAP es obligatoria';
    if (!currentEmpresa.paisId) formErrors.paisId = 'El país es obligatorio';
    return formErrors;
  };

  const handleSubmit = () => {
    const formErrors = validateFields();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

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
    <Box padding="0px" marginTop="-25" marginLeft="-20px" marginRight="-5">


      <Button colorScheme="green" onClick={() => { setIsEditMode(false); setCurrentEmpresa({ nombre: '', alias: '', estaActivo: true, baseDatos: '', ipBaseDatos: '', paisId: '' }); onOpen(); }} mb="20px">
        Agregar Empresa
      </Button>
      
      {/* Mostrar tabla solo en pantallas grandes */}
      {!isMobile && (
        <Box overflowX="auto">
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
                    <Button colorScheme="red" size="sm" onClick={() => handleDelete(empresa.id)} mr={2}>
                      Eliminar
                    </Button>
                    <IconButton icon={<EditIcon />} size="sm" onClick={() => handleEdit(empresa)} />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      )}

      {/* Mostrar tarjetas en dispositivos móviles */}
      {isMobile && (
        <SimpleGrid columns={1} spacing={4}>
          {data.map((empresa) => (
            <Box key={empresa.id} p={4} borderWidth="1px" borderRadius="lg" boxShadow="md" bg="white">
              <VStack align="start" spacing={3}>
                <Flex justifyContent="space-between" width="100%">
                  <Text fontWeight="bold">{empresa.nombre}</Text>
                  <Badge colorScheme={empresa.estaActivo ? "green" : "red"}>
                    {empresa.estaActivo ? "Activo" : "Inactivo"}
                  </Badge>
                </Flex>
                <Text><strong>Alias:</strong> {empresa.alias}</Text>
                <Text><strong>Fecha de Creación:</strong> {formatDate(empresa.creadoEl)}</Text>
                <Text><strong>Fecha de Actualización:</strong> {formatDate(empresa.actualizadoEl)}</Text>
                <Text><strong>Base de Datos:</strong> {empresa.baseDatos}</Text>
                <Text><strong>IP SAP:</strong> {empresa.ipBaseDatos}</Text>
                <Text><strong>País:</strong> {paisMap[empresa.paisId] || 'Sin país'}</Text>
                <Flex justifyContent="space-between" width="100%">
                  <Button size="sm" colorScheme="red" onClick={() => handleDelete(empresa.id)}>Eliminar</Button>
                  <IconButton size="sm" icon={<EditIcon />} onClick={() => handleEdit(empresa)} />
                </Flex>
              </VStack>
            </Box>
          ))}
        </SimpleGrid>
      )}

      <Modal isOpen={isOpen} onClose={onClose} size={isMobile ? "full" : "md"}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{isEditMode ? 'Actualizar Empresa' : 'Agregar Nueva Empresa'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={3} isInvalid={errors.nombre} isRequired>
              <FormLabel>Nombre de la Empresa</FormLabel>
              <Input
                name="nombre"
                value={currentEmpresa.nombre}
                onChange={handleInputChange}
              />
              {errors.nombre && <FormErrorMessage>{errors.nombre}</FormErrorMessage>}
            </FormControl>
            <FormControl mb={3} isInvalid={errors.alias} isRequired>
              <FormLabel>Alias</FormLabel>
              <Input
                name="alias"
                value={currentEmpresa.alias}
                onChange={handleInputChange}
              />
              {errors.alias && <FormErrorMessage>{errors.alias}</FormErrorMessage>}
            </FormControl>
            <FormControl display="flex" alignItems="center" mb={3}>
              <FormLabel mb="0">Activo</FormLabel>
              <Switch
                name="estaActivo"
                isChecked={currentEmpresa.estaActivo}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl mb={3} isInvalid={errors.baseDatos} isRequired>
              <FormLabel>Base de datos</FormLabel>
              <Input
                name="baseDatos"
                value={currentEmpresa.baseDatos}
                onChange={handleInputChange}
              />
              {errors.baseDatos && <FormErrorMessage>{errors.baseDatos}</FormErrorMessage>}
            </FormControl>
            <FormControl mb={3} isInvalid={errors.ipBaseDatos} isRequired>
              <FormLabel>IP SAP</FormLabel>
              <Input
                name="ipBaseDatos"
                value={currentEmpresa.ipBaseDatos}
                onChange={handleInputChange}
              />
              {errors.ipBaseDatos && <FormErrorMessage>{errors.ipBaseDatos}</FormErrorMessage>}
            </FormControl>
            <FormControl mb={3} isInvalid={errors.paisId} isRequired>
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
              {errors.paisId && <FormErrorMessage>{errors.paisId}</FormErrorMessage>}
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="green" mr={3} onClick={handleSubmit}>
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
