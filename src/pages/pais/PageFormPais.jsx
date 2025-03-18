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

  const bgHoverColor = useColorModeValue("green.50", "green.900");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const cardBg = useColorModeValue("white", "gray.800");
  const cardShadow = useColorModeValue("md", "dark-lg");
  const hoverShadow = useColorModeValue("lg", "2xl");
  
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
    <Box padding="0px" marginTop="0">
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
      >
        {data.map((pais) => (
          <GridItem
            key={pais.id}
            p={6}
            bg={cardBg}
            boxShadow={cardShadow}
            rounded="xl"
            _hover={{ backgroundColor: bgHoverColor, boxShadow: hoverShadow, transform: "translateY(-5px)" }}
            transition="all 0.3s ease-in-out"
          >
            <Flex direction="column" gap={3}>
              <Text fontWeight="bold" fontSize="lg">{pais.nombre}</Text>
              <Text fontSize="sm" color="gray.500">Creado: {formatDate(pais.creadoEl)}</Text>
              <Text fontSize="sm" color="gray.500">Actualizado: {formatDate(pais.actualizadoEl)}</Text>
              <Flex justify="space-between" alignItems="center" mt={3}>
                <Switch
                  isChecked={pais.estaActivo}
                  onChange={() => handleToggleStatus(pais.id, !pais.estaActivo)}
                  colorScheme="teal"
                />
                <Flex gap={2}>
                  <Button
                    colorScheme="red"
                    size="sm"
                    onClick={() => handleDelete(pais.id)}
                  >
                    Eliminar
                  </Button>
                  <IconButton
                    icon={<EditIcon />}
                    size="sm"
                    onClick={() => handleEdit(pais)}
                    colorScheme="teal"
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
