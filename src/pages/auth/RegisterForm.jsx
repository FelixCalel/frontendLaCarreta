import axios from "axios";
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  SimpleGrid,
  useColorModeValue,
  Heading,
  Alert,
  AlertIcon,
  VStack,
} from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';

export const RegisterForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const actualUsuario = useSelector(state => state.auth);
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    nombreProveedorEmpresa: '',
    correoElectronico: '',
    contrasenia: '',
    confirmacionContrasenia: '',
    nit: '',
  });

  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (actualUsuario === 'authenticated') {
      return navigate("/admin/dashboard", { replace: true });
    }
  }, [actualUsuario, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.contrasenia !== formData.confirmacionContrasenia) {
      setError("Las contraseñas no coinciden");
      return;
    }
    try {
      const response = await registerUser(formData);
      if (response.ok) {
        setMessage("Usuario creado correctamente. Por favor, verifica tu correo electrónico.");
      } else {
        setError(response.errorMessage);
      }
    } catch (err) {
      setError("Error al registrar el usuario");
    }
  };

  return (
    <Flex
      minHeight="100vh"
      align="center"
      justify="center"
      bgGradient="linear(to-r, teal.500, green.500)"
      padding="20px"
    >
      <Box
        p={8}
        width={{ base: 'full', md: '500px' }}
        borderRadius="lg"
        boxShadow="xl"
        bg={useColorModeValue('white', 'gray.800')}
      >
        <Heading as='h2' size="lg" textAlign="center" mb={6} color="teal.600">
          Registro para Usuarios
        </Heading>
        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl id="nombres" isRequired>
              <FormLabel>Nombres</FormLabel>
              <Input
                name="nombres"
                type="text"
                placeholder="Ingresa tus nombres"
                value={formData.nombres}
                onChange={handleChange}
                focusBorderColor="teal.400"
                borderRadius="md"
                boxShadow="sm"
                size="lg"
              />
            </FormControl>
            <FormControl id="apellidos" isRequired>
              <FormLabel>Apellidos</FormLabel>
              <Input
                name="apellidos"
                type="text"
                placeholder="Ingresa tus apellidos"
                value={formData.apellidos}
                onChange={handleChange}
                focusBorderColor="teal.400"
                borderRadius="md"
                boxShadow="sm"
                size="lg"
              />
            </FormControl>
            <FormControl id="nombreProveedorEmpresa" isRequired>
              <FormLabel>Nombre del Proveedor o Empresa</FormLabel>
              <Input
                name="nombreProveedorEmpresa"
                type="text"
                placeholder="Ingresa el nombre del proveedor o empresa"
                value={formData.nombreProveedorEmpresa}
                onChange={handleChange}
                focusBorderColor="teal.400"
                borderRadius="md"
                boxShadow="sm"
                size="lg"
              />
            </FormControl>
            <FormControl id="nit" isRequired>
              <FormLabel>NIT</FormLabel>
              <Input
                name="nit"
                type="text"
                placeholder="Ingresa el NIT"
                value={formData.nit}
                onChange={handleChange}
                focusBorderColor="teal.400"
                borderRadius="md"
                boxShadow="sm"
                size="lg"
              />
            </FormControl>
            <FormControl id="correoElectronico" isRequired>
              <FormLabel>Correo Electrónico</FormLabel>
              <Input
                name="correoElectronico"
                type="email"
                placeholder="Ingresa tu correo electrónico"
                value={formData.correoElectronico}
                onChange={handleChange}
                focusBorderColor="teal.400"
                borderRadius="md"
                boxShadow="sm"
                size="lg"
              />
            </FormControl>
            <FormControl id="contrasenia" isRequired>
              <FormLabel>Contraseña</FormLabel>
              <Input
                name="contrasenia"
                type="password"
                placeholder="Ingresa tu contraseña"
                value={formData.contrasenia}
                onChange={handleChange}
                focusBorderColor="teal.400"
                borderRadius="md"
                boxShadow="sm"
                size="lg"
              />
            </FormControl>
            <FormControl id="confirmacionContrasenia" isRequired>
              <FormLabel>Confirmación de Contraseña</FormLabel>
              <Input
                name="confirmacionContrasenia"
                type="password"
                placeholder="Confirma tu contraseña"
                value={formData.confirmacionContrasenia}
                onChange={handleChange}
                focusBorderColor="teal.400"
                borderRadius="md"
                boxShadow="sm"
                size="lg"
              />
            </FormControl>
          </VStack>
          {error && (
            <Box width="full" mt={4}>
              <Alert status="error" variant="left-accent" borderRadius="md">
                <AlertIcon />
                {error}
              </Alert>
            </Box>
          )}
          {message && (
            <Box width="full" mt={4}>
              <Alert status="success" variant="left-accent" borderRadius="md">
                <AlertIcon />
                {message}
              </Alert>
            </Box>
          )}
          <Button
            type="submit"
            colorScheme="teal"
            variant="solid"
            size="lg"
            mt={6}
            width="full"
            bgGradient="linear(to-r, teal.400, green.400)"
            _hover={{ bgGradient: "linear(to-r, teal.500, green.500)" }}
            boxShadow="md"
          >
            Registrar
          </Button>
          <Flex justifyContent="center" mt={5}>
            <Link color="teal.500" to="/auth/login">
              Volver al inicio de sesión
            </Link>
          </Flex>
        </form>
      </Box>
    </Flex>
  );
};

async function registerUser(data) {
  const username = `${data.nombres}.${data.apellidos}`;
  const telefono = '123456789';
  const celular = '123131313';
  const estado = true;

  const userData = {
    username,
    password: data.contrasenia,
    nombres: data.nombres,
    apellidos: data.apellidos,
    nit: data.nit,
    nombre_empresa: data.nombreProveedorEmpresa,
    correo_electronico: data.correoElectronico,
    telefono,
    celular,
    estado,
    correo_validado: false
  };

  try {
    const response = await axios.post('http://localhost:3000/usuarios/registro', userData);
    return {
      ok: true,
      usuario: response.data.usuario
    };
  } catch (error) {
    return {
      ok: false,
      errorMessage: error.response?.data?.error || "Error al registrar el usuario"
    };
  }
}
