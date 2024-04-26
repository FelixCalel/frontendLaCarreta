import { useState } from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Input,
  Button,
  useToast,
  Stack,
  Switch,
  Text,
  Link,
} from '@chakra-ui/react';
import rolesData from '../../assets/datos/roles.json';
import { Label } from 'recharts';



// const usuariosData = [
//     { id: 1, nombre: 'Usuario 1', correo: 'usuario1@example.com', estado: 'activo' },
//     { id: 2, nombre: 'Usuario 2', correo: 'usuario2@example.com', estado: 'activo' },
//     // Agrega más datos de usuarios según sea necesario
//   ];
export const TablaRoles = () => {

    const [searchTerm, setSearchTerm] = useState('');
    const [roles, setRoles] = useState(rolesData);
    const toast = useToast();

  
   
  return (

    
    <>
      {/* <Input
        placeholder="Buscar usuario"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        mb={4}
      /> */}
      <Table variant="simple" mt={10}>
        <Thead>
          <Tr>
            <Th>Nombre rol</Th>
            <Th>Descripción</Th>
           
            <Th>Acciones</Th>
          </Tr>
        </Thead>
        <Tbody>
          {roles
            .filter((rol) =>
              rol.nombre.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((rol) => (
              <Tr key={rol.id}>
                <Td>{rol.nombre}</Td>
                <Td>{rol.descripcion}</Td>
             
                <Td>
                 <Stack  align='center'  direction='row'>
                 <Button size={'xs'} onClick={() => handleChangePassword(usuario.id)} colorScheme="blue">
                    Ver permisos
                  </Button>
                  <Link ml={2} color="blue.500" href="/admin/permisos">Permisos</Link>
                 </Stack>
                  
                </Td>
              </Tr>
            ))}
        </Tbody>
      </Table>
    
    </>
  )
}
