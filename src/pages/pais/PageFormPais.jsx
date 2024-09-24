import { useEffect, useState } from "react";
import {
  Box,
  Spinner,
  Text,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Input,
  FormControl,
  FormLabel,
  Switch,
  IconButton,
  Grid,
  GridItem,
  useColorModeValue,
  Flex,
  useBreakpointValue,
} from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";
import { format } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import {
  tablaPais,
  addNewPais,
  deletePais,
  updatePais,
  togglePaisStatus,
} from "../../store/pais/thunks";

const PageFormPais = () => {
  const dispatch = useDispatch();
  const { data, status, error } = useSelector((state) => state.paises);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentPais, setCurrentPais] = useState({ id: "", nombre: "" });

  // Hooks para los colores de Chakra UI, asegurarse de que se llaman al principio
  const bgHoverColor = useColorModeValue("green.50", "green.900");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.700", "white");
  const textMutedColor = useColorModeValue("gray.600", "gray.400");

  useEffect(() => {
    if (status === "idle") {
      dispatch(tablaPais());
    }
  }, [dispatch, status]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentPais({ ...currentPais, [name]: value });
  };

  const handleSubmit = () => {
    if (isEditMode) {
      dispatch(updatePais(currentPais)).then(() => {
        onClose();
        dispatch(tablaPais());
      });
    } else {
      dispatch(addNewPais(currentPais)).then(() => {
        onClose();
        dispatch(tablaPais());
      });
    }
  };

  const handleDelete = (id) => {
    dispatch(deletePais(id)).then(() => {
      dispatch(tablaPais());
    });
  };

  const handleToggleStatus = (id, estaActivo) => {
    dispatch(togglePaisStatus({ id, estaActivo })).then(() => {
      dispatch(tablaPais());
    });
  };

  const handleEdit = (pais) => {
    setCurrentPais(pais);
    setIsEditMode(true);
    onOpen();
  };

  const formatDate = (dateString) => {
    try {
      return dateString
        ? format(new Date(dateString), "dd-MM-yyyy HH:mm:ss")
        : "Fecha inválida";
    } catch (error) {
      console.error("Fecha inválida:", dateString);
      return "Fecha inválida";
    }
  };

  const isMobile = useBreakpointValue({ base: true, md: false });

  if (status === "loading") {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Spinner size="xl" />
      </Box>
    );
  }

  if (status === "failed") {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Text fontSize="2xl" color="red.500">
          Error al cargar los datos: {error}
        </Text>
      </Box>
    );
  }

  return (
    <Box padding="0px" marginTop="-25px">
      <Flex justify="space-between" mb="20px" alignItems="center">
        <Text fontSize="2xl" fontWeight="bold" color="green.600">
          Gestión de Países
        </Text>
        <Button
          colorScheme="green"
          onClick={() => {
            setIsEditMode(false);
            setCurrentPais({ nombre: "" });
            onOpen();
          }}
        >
          Agregar País
        </Button>
      </Flex>

      {/* Grid for responsive layout */}
      <Grid
        templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
        gap={6}
        border="1px solid"
        borderColor={borderColor}
        rounded="lg"
        padding={4}
      >
        {data.map((pais) => (
          <GridItem
            key={pais.id}
            p={4}
            rounded="md"
            boxShadow="sm"
            border="1px solid"
            borderColor={borderColor}
            _hover={{ backgroundColor: bgHoverColor }}
            transition="background-color 0.2s ease"
          >
            <Flex direction="column" gap={3}>
              <Text fontWeight="bold" color={textColor}>
                ID: {pais.id}
              </Text>
              <Text color={textColor}>Nombre: {pais.nombre}</Text>
              <Text fontSize="sm" color={textMutedColor}>
                Creado: {formatDate(pais.creadoEl)}
              </Text>
              <Text fontSize="sm" color={textMutedColor}>
                Actualizado: {formatDate(pais.actualizadoEl)}
              </Text>
              <Flex justify="space-between" alignItems="center" mt={3}>
                <Switch
                  isChecked={pais.estaActivo}
                  onChange={() => handleToggleStatus(pais.id, !pais.estaActivo)}
                  colorScheme="teal"
                />
                <Flex>
                  <Button
                    colorScheme="red"
                    size={isMobile ? "sm" : "md"}
                    onClick={() => handleDelete(pais.id)}
                    mr={2}
                  >
                    Eliminar
                  </Button>
                  <IconButton
                    icon={<EditIcon />}
                    size={isMobile ? "sm" : "md"}
                    onClick={() => handleEdit(pais)}
                  />
                </Flex>
              </Flex>
            </Flex>
          </GridItem>
        ))}
      </Grid>

      {/* Modal for adding/updating country */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{isEditMode ? "Actualizar País" : "Agregar Nuevo País"}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Nombre del País</FormLabel>
              <Input
                name="nombre"
                value={currentPais.nombre}
                onChange={handleInputChange}
                placeholder="Ingrese el nombre del país"
                focusBorderColor="teal.500"
                size="lg"
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="green" mr={3} onClick={handleSubmit}>
              {isEditMode ? "Actualizar" : "Guardar"}
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default PageFormPais;
