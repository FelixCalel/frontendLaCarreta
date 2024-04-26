import {
    Flex,
    IconButton,
    Icon,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Button,
    Input,
    Select,
    Alert,
    AlertIcon,
    Box,
    
  } from "@chakra-ui/react";
  import { useState } from "react";
  import { useDispatch, useSelector } from "react-redux";
import { startCreatingUserChildren } from "../store/auth/thunks";



  export const CompModal = ({ isOpen, onClose }) => {
    const disptach = useDispatch();
    const actualUsuario = useSelector(usuario => usuario.auth);
    const [formData,setFormData] = useState({
      nombres: '',
      apellidos: '',
      correo_electronico:'',
      roleId: '',
      parentId: ''
    })
    const [error, setError] = useState(actualUsuario.errorMessage);
  
    const handleSubmit = (e) => {
      e.preventDefault();
       // Validar que los campos obligatorios no estén vacíos
      if (!formData.nombres || !formData.apellidos || !formData.correo_electronico || !formData.roleId) {
        setError('Todos los campos son obligatorios');
        return; // Detener el envío del formulario si hay campos vacíos
      }

      const infoUsuario = JSON.parse(localStorage.getItem('userData'))
      formData.parentId = infoUsuario.id;

      disptach(startCreatingUserChildren(formData));
      setError(actualUsuario.errorMessage);
      onClose();
    }
  
    const handleChange = (e) => {
      const { name, value, checked, type } = e.target;
      setFormData(prevState => ({
        ...prevState,
        [name]: value
      }));
    };
  
    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Nuevo Usuario</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit}>
              <Input name="nombres" placeholder="Nombres" mb={3} onChange={handleChange} value={formData.nombres} />
              <Input name="apellidos" placeholder="Apellidos" mb={3} onChange={handleChange} value={formData.apellidos} />
              <Input name="correo_electronico" type="email" placeholder="Correo Electrónico" mb={3} onChange={handleChange} value={formData.correo_electronico} />
              <Select name="roleId" placeholder="Rol" mb={3} onChange={handleChange} value={formData.roleId}>
                <option value="1">Administrador</option>
                <option value="2">Finanzas</option>
                <option value="3">Logística</option>
                <option value="5">Ventas</option>
                <option value="6">Tesorería</option>
                <option value="7">Contabilidad</option>
              </Select>
              <input type="hidden" value={actualUsuario.uid} />
              <Box width="full" pb={4} pt={4} spacing={5}>
              {error && (
                <Alert status="error" variant="subtle">
                  <AlertIcon />
                  {error}
                </Alert>
          
              )}
            </Box>
              <Button colorScheme="teal" mr={3} type="submit">
                Guardar
              </Button>
              <Button onClick={onClose}>Cancelar</Button>
            </form>  
          </ModalBody>
        </ModalContent>
      </Modal>
    )
  }
  
