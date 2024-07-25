import { useEffect } from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, Box, Spinner, Text } from '@chakra-ui/react';
import { format } from 'date-fns';
import { useDispatch, useSelector } from 'react-redux';
import { tablaPais } from '../../store/pais/thunks';

const PageFormPais = () => {
  const dispatch = useDispatch();
  const { data, status, error } = useSelector((state) => state.paises);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(tablaPais());
    }
  }, [dispatch, status]);

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'dd/MM/yyyy HH:mm:ss');
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
      <Table variant="striped" colorScheme="teal">
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>NOMBRE</Th>
            <Th>Fecha de Creación</Th>
            <Th>Fecha de Actualización</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.map((pais) => (
            <Tr key={pais.id}>
              <Td>{pais.id}</Td>
              <Td>{pais.nombre}</Td>
              <Td>{formatDate(pais.createdAt)}</Td>
              <Td>{formatDate(pais.updatedAt)}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default PageFormPais;
