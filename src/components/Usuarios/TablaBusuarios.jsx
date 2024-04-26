import { useEffect, useState } from 'react';
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
} from '@chakra-ui/react';
import usuariosData from '../../assets/datos/usuarios.json';
import { Label } from 'recharts';
import { fetchUsuarios, usuariosSlice } from '../../store/usuarios/usuariosSlice';
import { useDispatch, useSelector } from 'react-redux';


export const TablaBusuarios = () => {
  
  const dispatch = useDispatch();
  const listaUsuarios = useSelector(state => state.usuarios);
  const usuarioActivo = useSelector(state => state.auth)

  //  const status = useSelector((state) => state.usuarios.status);
  //  const error = useSelector((state) => state.usuarios.error);
  
    const [searchTerm, setSearchTerm] = useState('');
    const [usuarios, setUsuarios] = useState(usuariosData);
    const toast = useToast();
    const [isActive, setIsActive] = useState(0);

    
    useEffect(() => {
      // Cuando el componente se monta, despacha una acción para obtener los usuarios
      if(usuarioActivo){
        dispatch(fetchUsuarios({id:usuarioActivo.uid}));
      }
    }, [dispatch]);
    // console.log(listaUsuarios,"usuarios");
    // Función para desactivar un usuario
    const handleDesactivar = (id) => {
      setIsActive(isActive === 0 ? 1 : 0);
      // Lógica para desactivar el usuario con el ID proporcionado
      toast({
        title: 'Usuario desactivado',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    };

    // Función para cambiar la contraseña de un usuario
  const handleChangePassword = (id) => {
    // Lógica para cambiar la contraseña del usuario con el ID proporcionado
    toast({
      title: 'Contraseña cambiada',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };
 

  const handleChange = () => {
    // Cambia el estado entre 0 y 1
    setIsActive(isActive === 0 ? 1 : 0);
  };

  return (

    
    <>
      <Input
        placeholder="Buscar usuario"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        mb={4}
      />
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Nombre</Th>
            <Th>Correo</Th>
            <Th>Rol</Th>
            <Th>Estado</Th>
            <Th>Acciones</Th>
          </Tr>
        </Thead>
        <Tbody>
          {listaUsuarios.items
            .filter((usuario) =>
              usuario.nombres.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((usuario) => (
              <Tr key={usuario.id}>
                <Td>{usuario.nombres} {usuario.apellidos}</Td>
                <Td>{usuario.correo_electronico}</Td>
                <Td>{usuario.roleId}</Td>
                <Td> <Stack align='center'  direction='row'>
                 
                  <Switch size='sm' isChecked={usuario.estado === true}   colorScheme='green'  onChange={() => handleDesactivar(usuario.id)}  />
                  <Text>{isActive === 1 ? 'Activo' : 'Inactivo'}</Text>
                </Stack></Td>
                <Td>
               
                 <Stack  align='center'  direction='row'>
                 <Button size={'xs'} onClick={() => handleChangePassword(usuario.id)} colorScheme="blue">
                    Cambiar Contraseña
                  </Button>
                 </Stack>
                  
                </Td>
              </Tr>
            ))}
        </Tbody>
      </Table>
    
    </>
  )
}
