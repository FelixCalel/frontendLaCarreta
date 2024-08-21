import { Box, Flex, Menu, MenuButton, MenuList, MenuItem, IconButton } from '@chakra-ui/react';
import { FaUser } from 'react-icons/fa'; // FontAwesome User Icon
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { logout } from "../store/auth";

export const MenuPerfil = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onLogout = () => {
    // Limpiar la autenticación del usuario en localStorage
    localStorage.setItem('isAuthenticated', 'false');
    localStorage.setItem('userData', '');

    // Despachar la acción logout
    dispatch(logout());

    // Redirigir al usuario a la página de login
    navigate('/auth/login', {
      replace: true // Remplaza la ruta actual en el historial de navegación
    });
  }

  return (
    <Box>
      <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
        <Flex alignItems={'center'}>
          <Menu placement="bottom-end">
            <MenuButton
              as={IconButton}
              aria-label="Options"
              variant="solid"
              pl={4}
              pr={4}
              fontSize={"0.8em"}
              icon={<FaUser />}
            >
              <Box as="span" display={{ base: 'none', md: 'inline' }}>Opciones</Box>
            </MenuButton>
            <MenuList borderRadius="md" boxShadow="lg" p={0} m={0} minW="180px">
              <MenuItem 
                as={Link} 
                to="/admin/perfil" 
                _hover={{ bg: 'green.500', color: 'white', borderRadius: 'md' }}
                _focus={{ bg: 'green.500', color: 'white', borderRadius: 'md' }}
                p={2}
              >
                Perfil
              </MenuItem>
              <MenuItem 
                as={Link} 
                to="/admin/empresas" 
                _hover={{ bg: 'green.500', color: 'white', borderRadius: 'md' }}
                _focus={{ bg: 'green.500', color: 'white', borderRadius: 'md' }}
                p={2}
              >
                Empresas
              </MenuItem>
              <MenuItem 
                as={Link} 
                to="/admin/usuarios" 
                _hover={{ bg: 'green.500', color: 'white', borderRadius: 'md' }}
                _focus={{ bg: 'green.500', color: 'white', borderRadius: 'md' }}
                p={2}
              >
                Usuarios
              </MenuItem>
              <MenuItem 
                as={Link} 
                to="/admin/roles" 
                _hover={{ bg: 'green.500', color: 'white', borderRadius: 'md' }}
                _focus={{ bg: 'green.500', color: 'white', borderRadius: 'md' }}
                p={2}
              >
                Roles
              </MenuItem>
              <MenuItem 
                as={Link} 
                to="/admin/permisos" 
                _hover={{ bg: 'green.500', color: 'white', borderRadius: 'md' }}
                _focus={{ bg: 'green.500', color: 'white', borderRadius: 'md' }}
                p={2}
              >
                Permisos
              </MenuItem>
              <MenuItem 
                _hover={{ bg: 'green.500', color: 'white', borderRadius: 'md' }}
                _focus={{ bg: 'green.500', color: 'white', borderRadius: 'md' }}
                p={2}
                onClick={onLogout}
              >
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Flex>
    </Box>
  );
}
