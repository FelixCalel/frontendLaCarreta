import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { useForm } from '../../hooks/useForm'
import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Stack,
  SimpleGrid,
  useColorModeValue,
  Heading,
  Center,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { startCreatingUser } from '../../store/auth';


export const RegisterForm = () => {
  const disptach = useDispatch();
  const actualUsuario = useSelector(usuario => usuario.auth);
  
  useEffect(() => {
    if(actualUsuario === 'authenticated')
     return navigate("/admin/dashboard", replace)
  })

  const { nombres, apellidos, nombreProveedorEmpresa, correoElectronico, nit, contrasenia, confirmacionContrasenia} = useForm({
          nombres: '',
          apellidos: '',
          nombreProveedorEmpresa: '',
          correoElectronico: '',
          nit: ''
  })

  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    nombreProveedorEmpresa: '',
    correoElectronico: '',
    contrasenia: '',
    confirmacionContrasenia: '',
    nit: '',
    esEmpleado: false,
  });
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

   // Array de URLs de imágenes
   const images = [
    'url("./src/assets/images/fnd_py01.jpg")',
    'url("./src/assets/images/fnd_py02.jpg")',
    'url("./src/assets/images/fnd_py03.jpg")',
    'url("./src/assets/images/fnd_py04.jpg")',
  ];

  const [error, setError] = useState(actualUsuario.errorMessage);

  
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex((currentImageIndex) => (currentImageIndex + 1) % images.length);
    }, 5000); // Cambia la imagen cada 5 segundos

    return () => clearInterval(intervalId);
  }, []);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    disptach(startCreatingUser(formData))
    setError(actualUsuario.errorMessage);
  };

  return (
    <Flex
    minHeight="100vh"
    width="full"
    align="center"
    justifyContent="center"
     backgroundImage={images[currentImageIndex]}
   // backgroundColor={"gray.50"}
    backgroundSize="cover"
    transition="background-image 1s ease-in-out" // Añade esta línea para la transición
    sx={{
      // Asegúrate de que el cambio de imagen sea suave
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        // backgroundImage: images[currentImageIndex],
        backgroundColor: "brand.50",
        backgroundSize: 'cover',
        filter: 'blur(8px)', // Añade un efecto de desenfoque si lo deseas
        zIndex: -1,
      }
    }}
    >
      
      <Box
        p={8}
        width="full"
        maxWidth="800px" // Ajustado para acomodar dos columnas
        borderRadius="lg"
        boxShadow="lg"
        backgroundColor={useColorModeValue('whiteAlpha.800', 'gray.700')}
      >
        <Heading as='section' pb={5} textAlign={"center"} > Registro para Proveedores</Heading>
        <form onSubmit={handleSubmit}>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
            <FormControl isRequired>
              <FormLabel>Nombres</FormLabel>
              <Input
                name="nombres"
                type="text"
                placeholder="Ingresa tus nombres"
                onChange={handleChange}
                value={formData.nombres}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Apellidos</FormLabel>
              <Input
                name="apellidos"
                type="text"
                placeholder="Ingresa tus apellidos"
                onChange={handleChange}
                value={formData.apellidos}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Nombre del Proveedor o Empresa</FormLabel>
              <Input
                name="nombreProveedorEmpresa"
                type="text"
                placeholder="Ingresa el nombre del proveedor o empresa"
                onChange={handleChange}
                value={formData.nombreProveedorEmpresa}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>NIT</FormLabel>
              <Input
                name="nit"
                type="text"
                placeholder="Ingresa el NIT"
                onChange={handleChange}
                value={formData.nit}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Correo Electrónico</FormLabel>
              <Input
                name="correoElectronico"
                type="email"
                placeholder="Ingresa tu correo electrónico"
                onChange={handleChange}
                value={formData.correoElectronico}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Contraseña</FormLabel>
              <Input
                name="contrasenia"
                type="password"
                placeholder="Ingresa tu contraseña"
                onChange={handleChange}
                value={formData.contrasenia}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Confirmación de Contraseña</FormLabel>
              <Input
                name="confirmacionContrasenia"
                type="password"
                placeholder="Confirma tu contraseia"
                onChange={handleChange}
                value={formData.confirmacionContrasenia}
              />
            </FormControl>
         
            <FormControl>
              <Checkbox
                name="esEmpleado"
                isChecked={formData.esEmpleado}
                onChange={handleChange}
                pt={7} // Alinea verticalmente el checkbox con su etiqueta correspondiente en la columna
              >
                ¿Es empleado?
              </Checkbox>
             
            </FormControl>
          
          </SimpleGrid>
          <Box width="full" pb={4} pt={4} spacing={5}>
              {error && (
                <Alert status="error" variant="subtle">
                  <AlertIcon />
                  {error}
                </Alert>
          
              )}
            </Box>
          <Button
            type="submit"
            colorScheme="green"
            mt={4} // Margen superior para separar del grid
            width="full"
          >
            Registrar
          </Button>
         
        </form>
        <Flex justifyContent="center" mt={5}>
              <Link color="teal.500" to="/auth/login" >
                Volver al inicio de sesión
              </Link>
            </Flex>
      </Box>
    </Flex>
  );
};


