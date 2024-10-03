import { useEffect } from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Stack,
  Link,
  Spinner,
  Text
} from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRoles } from '../../store/Roles/thunks'; // Importamos el thunk para roles
import { Link as RouterLink } from 'react-router-dom';

export const TablaRoles = () => {
  const dispatch = useDispatch();
  
  // Obtener el estado de los roles desde Redux
  const { data: roles, status } = useSelector((state) => state.roles);

  // Hacer la solicitud para obtener los roles al montar el componente
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchRoles());
    }
  }, [status, dispatch]);

  // Mostrar un spinner mientras los datos están cargando
  if (status === 'loading') {
    return <Spinner />;
  }

  // Mostrar un mensaje si no se cargan los datos correctamente
  if (status === 'failed') {
    return <Text>Hubo un error cargando los roles.</Text>;
  }

  return (
    <>
      <Table variant="simple" mt={10}>
        <Thead>
          <Tr>
            <Th>Nombre rol</Th>
            <Th>Descripción</Th>
            <Th>Acciones</Th>
          </Tr>
        </Thead>
        <Tbody>
          {roles.map((rol) => (
            <Tr key={rol.id}>
              <Td>{rol.nombre}</Td>
              <Td>{rol.descripcion}</Td>
              <Td>
                <Stack align="center" direction="row">
                  <Button size="xs" colorScheme="blue">
                    Ver permisos
                  </Button>
                  <Link as={RouterLink} to="/admin/permisos" ml={2} color="blue.500">
                    Permisos
                  </Link>
                </Stack>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </>
  );
};
