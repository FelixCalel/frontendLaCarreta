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
  Switch,
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
} from "@chakra-ui/react";
import axios from "axios";
import RutaSelector from "./RutaSelector"; // Importamos el componente RutaSelector

export const TablaBusuarios = () => {
  const [usuarios, setUsuarios] = useState([]); // Almacena la lista de usuarios
  const [rutas, setRutas] = useState([]); // Inicializa como un array vacío
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null); // Usuario seleccionado para asignar rutas
  const [selectedRoutes, setSelectedRoutes] = useState([]); // Lista de rutas seleccionadas
  const { isOpen, onOpen, onClose } = useDisclosure(); // Control del modal
  const toast = useToast();

  // Obtener lista de usuarios desde el backend al cargar el componente
  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/usuarios/todos"
        );
        setUsuarios(response.data.usuarios); // Almacena los usuarios obtenidos
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
        // Cambia aquí la URL incorrecta a la correcta
        const response = await axios.get("http://localhost:3000/ruta/todos");
        console.log("Respuesta de rutas:", response.data);

        if (Array.isArray(response.data)) {
          setRutas(response.data); // Asigna las rutas si la respuesta es un array
        } else {
          setRutas([]); // Si no, asigna un array vacío
        }
      } catch (error) {
        console.error("Error al obtener rutas:", error);
        toast({
          title: "Error al obtener rutas",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    };

    fetchUsuarios(); // Llama a la función para obtener usuarios
    fetchRutas(); // Llama a la función para obtener rutas
  }, []);

  // Función para desactivar un usuario (ficticia, debes implementar la lógica real si es necesario)
  const handleDesactivar = (id) => {
    toast({
      title: "Usuario desactivado",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  // Función para asignar rutas a un usuario
  const asignarRutas = async (usuarioId) => {
    try {
      console.log(
        "Rutas seleccionadas antes de enviar la petición:",
        selectedRoutes
      );

      if (selectedRoutes.length === 0) {
        toast({
          title: "Por favor selecciona al menos una ruta",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
        return; // Detén la ejecución si no hay rutas seleccionadas
      }

      // Lógica para enviar las rutas seleccionadas al backend
      await axios.post(
        `http://localhost:3000/usuarios/${usuarioId}/asignar-ruta`,
        {
          rutaId: selectedRoutes, // Lista de rutas seleccionadas
        }
      );

      toast({
        title: "Rutas asignadas correctamente",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

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
        <Input
          placeholder="Buscar usuario"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          maxWidth="300px"
          borderRadius="md"
          bg="white"
          boxShadow="sm"
          _placeholder={{ color: "gray.400" }}
        />
      </Flex>

      <Box borderRadius="md" boxShadow="md" p={4} bg="white">
        <Table variant="simple">
          <Thead bg="green.100">
            <Tr>
              <Th color="green.700">Nombre</Th>
              <Th color="green.700">Correo</Th>
              <Th color="green.700">Teléfono</Th>
              <Th color="green.700">Estado</Th>
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
                  <Td>
                    <Stack align="center" direction="row">
                      <Switch
                        size="sm"
                        isChecked={usuario.estaActivo === true}
                        colorScheme="green"
                        onChange={() => handleDesactivar(usuario.id)}
                      />
                      <Text>{usuario.estaActivo ? "Activo" : "Inactivo"}</Text>
                    </Stack>
                  </Td>
                  <Td>
                    <Stack align="center" direction="row">
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedUser(usuario.id); // Selecciona el usuario para asignar rutas
                          setSelectedRoutes(
                            usuario.rutas.map((ruta) => ruta.id)
                          ); // Carga las rutas asignadas al usuario seleccionado
                          onOpen(); // Abre el modal
                        }}
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
            <Text mb={4}>Asignar rutas al usuario con ID: {selectedUser}</Text>

            {/* Usamos el componente RutaSelector aquí */}
            <RutaSelector
              selectedRoutes={selectedRoutes}
              setSelectedRoutes={setSelectedRoutes}
              usuarioId={selectedUser}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="green"
              onClick={() => asignarRutas(selectedUser)}
            >
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
