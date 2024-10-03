import { useEffect, useState } from "react";
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
  Text,
  Box,
  Flex,
  Heading,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  IconButton,
} from "@chakra-ui/react";
import { FiUserPlus, FiSearch } from "react-icons/fi";
import axios from "axios";
import RutaSelector from "./RutaSelector"; // Componente para selección de rutas
const BASE_URL = import.meta.env.VITE_API_URL;


export const TablaBusuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [setRutas] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRoutes, setSelectedRoutes] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/usuarios/todos`
        );
        setUsuarios(response.data.usuarios);
      } catch (error) {
        console.error("Error al obtener los usuarios:", error);
        toast({
          title: "Error al obtener usuarios",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    };

    const fetchRutas = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/ruta/todos`);
        setRutas(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        // Ya no se maneja el error
      }
    };
    

    fetchUsuarios();
    fetchRutas();
  }, []);

  const handleDesactivar = (id) => {
    toast({
      title: "Usuario desactivado",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const asignarRutas = async (usuarioId) => {
    try {
      if (selectedRoutes.length === 0) {
        toast({
          title: "Selecciona al menos una ruta",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
        return;
      }
  
      // Llamada al backend para asignar rutas
      await axios.post(`${BASE_URL}/usuarios/${usuarioId}/asignar-ruta`, {
        rutaId: selectedRoutes,
      });
  
      // Actualizar el estado local de los usuarios
      setUsuarios((prevUsuarios) =>
        prevUsuarios.map((usuario) =>
          usuario.id === usuarioId
            ? {
                ...usuario,
                rutas: selectedRoutes.map((rutaId) => ({
                  id: rutaId,
                  // Si tienes más información de la ruta, puedes agregarla aquí
                })),
              }
            : usuario
        )
      );
  
      toast({
        title: "Rutas asignadas correctamente",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
  
      // Cerrar el modal
      onClose();
    } catch (error) {
      console.error("Error al asignar rutas:", error);
      toast({
        title: "Error al asignar rutas",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };
  

  return (
    <>
      <Flex justify="space-between" align="center" mb={4}>
        <Heading size="lg" color="green.600">
          Lista de Usuarios
        </Heading>
        <Flex maxWidth="300px">
          <Input
            placeholder="Buscar usuario"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            borderRadius="full"
            bg="white"
            boxShadow="sm"
            _placeholder={{ color: "gray.400" }}
          />
          <IconButton
            aria-label="Buscar"
            icon={<FiSearch />}
            ml={2}
            colorScheme="green"
          />
        </Flex>
      </Flex>

      <Box borderRadius="md" boxShadow="lg" p={4} bg="white">
        <Table variant="simple">
          <Thead bg="green.100">
            <Tr>
              <Th color="green.700">Nombre</Th>
              <Th color="green.700">Correo</Th>
              <Th color="green.700">Teléfono</Th>
              <Th color="green.700">Acciones</Th>
            </Tr>
          </Thead>
          <Tbody>
            {usuarios
              .filter((usuario) =>
                usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((usuario) => (
                <Tr key={usuario.id} _hover={{ bg: "green.50" }}>
                  <Td>
                    {usuario.nombre} {usuario.apellido}
                  </Td>
                  <Td>{usuario.correo}</Td>
                  <Td>{usuario.telefono}</Td>
                  
                    {/* <Stack align="center" direction="row"> */}
                      {/* <Switch
                        size="sm"
                        isChecked={usuario.estaActivo === true}
                        colorScheme="green"
                        onChange={() => handleDesactivar(usuario.id)}
                      />
                      <Text>{usuario.estaActivo ? "Activo" : "Inactivo"}</Text> */}
                    {/* </Stack> */}
                  <Td>
                    <Stack align="center" direction="row">
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedUser(usuario.id);
                          setSelectedRoutes(
                            usuario.rutas.map((ruta) => ruta.id)
                          );
                          onOpen();
                        }}
                        leftIcon={<FiUserPlus />}
                        colorScheme="green"
                        variant="solid"
                        _hover={{ bg: "green.300" }}
                      >
                        Asignar Rutas
                      </Button>
                    </Stack>
                  </Td>
                </Tr>
              ))}
          </Tbody>
        </Table>
      </Box>

      {/* Modal para asignar rutas */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader color="green.600">Asignar Rutas</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb={4}>Asignar rutas al usuario ID: {selectedUser}</Text>
            <RutaSelector
              selectedRoutes={selectedRoutes}
              setSelectedRoutes={setSelectedRoutes}
              usuarioId={selectedUser}
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="green" onClick={() => asignarRutas(selectedUser)}>
              Asignar
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
