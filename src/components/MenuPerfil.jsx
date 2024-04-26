import { AuthContext } from "../pages/auth/context/AuthContext";
import { useContext } from "react";
import {
  Box,
  Flex,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  useColorModeValue,
} from '@chakra-ui/react';
import { FaUser } from 'react-icons/fa'; // FontAwesome User Icon

import { AtSignIcon, ChevronDownIcon, HamburgerIcon } from '@chakra-ui/icons';
import { PageEmpresa } from '../pages/PageEmpresa';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { Logout } from "../pages/auth/Logout";
import { logout } from "../store/auth";

export const  MenuPerfil = () => {
  
  // const { user,logout } = useContext( AuthContext )
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onLogout = () =>{
    localStorage.setItem('isAuthenticated','false')
    localStorage.setItem('userData','')
  
    dispatch(logout());
    navigate('/auth/login',{
      replace: true
    });
  }

  
  return (
    <Box px={4} bgColor={"white"}>
      <Flex h={16} alignItems={'center'} justifyContent={'space-between'} >
        {/* Aquí puedes agregar el contenido de tu NavBar */}
         
        {/* Menú de Perfil */}
        <Flex alignItems={'center'} bg={"white"}>
          <Menu >
            <MenuButton
              as={IconButton}
              aria-label="Options"
              // variant="outline"
              variant="solid"
              pl={4}
              pr={4}
              fontSize={"0.8em"}
              leftIcon={<FaUser  />} >
                Opciones
              </MenuButton>
              
            
            
            <MenuList variant="solid">
            <MenuItem as={Link} to="/admin/perfil" bg={"brand.700"} _hover={{ bg: 'brand.600', color: 'white' }} >Perfil</MenuItem>
              <MenuItem as={Link} to="/admin/empresas" bg={"brand.700"} _hover={{ bg: 'brand.600', color: 'white' }} >
                Empresas
              </MenuItem>

              <MenuItem as={Link} to="/admin/usuarios" bg={"brand.700"} _hover={{ bg: 'brand.600', color: 'white' }} >Usuarios</MenuItem>
              <MenuItem as={Link} to="/admin/roles" bg={"brand.700"} _hover={{ bg: 'brand.600', color: 'white' }} >Roles</MenuItem>
              <MenuItem as={Link} to="/admin/permisos" bg={"brand.700"} _hover={{ bg: 'brand.600', color: 'white' }} >Permisos</MenuItem>
              <MenuItem  bg={"brand.700"} _hover={{ bg: 'brand.600', color: 'white' }}  onClick={onLogout}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Flex>
    </Box>
  );
}

