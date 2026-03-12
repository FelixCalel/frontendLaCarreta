import { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Switch,
  VStack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import PaisSelector from "./PaisSelector";

const RutaModal = ({ isOpen, onClose, initialData, onSave }) => {
  const [state, setState] = useState(() => ({
    formData: {
      nombre: "",
      estaActivo: true,
      paisId: "",
    },
    errors: {},
  }));
  const [isSaving, setIsSaving] = useState(false);

  const [prevProps, setPrevProps] = useState({ isOpen, initialData });

  if (isOpen !== prevProps.isOpen || initialData !== prevProps.initialData) {
    setPrevProps({ isOpen, initialData });
    if (isOpen) {
      setState({
        formData: initialData ? {
          ...initialData,
          paisId: initialData.paisId || "",
        } : {
          nombre: "",
          estaActivo: true,
          paisId: "",
        },
        errors: {},
      });
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setState((prev) => ({
      ...prev,
      formData: {
        ...prev.formData,
        [name]: type === "checkbox" ? checked : value,
      },
      errors: {
        ...prev.errors,
        [name]: null,
      },
    }));
  };

  const handlePaisChange = (paisId) => {
    setState((prev) => ({
      ...prev,
      formData: {
        ...prev.formData,
        paisId: parseInt(paisId, 10),
      },
      errors: {
        ...prev.errors,
        paisId: null,
      },
    }));
  };

  const validateFields = () => {
    let newErrors = {};
    if (!state.formData.nombre?.trim()) newErrors.nombre = "El nombre es obligatorio";
    if (!state.formData.paisId) newErrors.paisId = "El país es obligatorio";
    
    setState(prev => ({ ...prev, errors: newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateFields()) return;

    setIsSaving(true);
    try {
      await onSave(state.formData);
      onClose();
    } catch (error) {
      console.error("Error saving ruta:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const { formData, errors } = state;

  const modalBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");
  const subTextColor = useColorModeValue("gray.600", "gray.400");
  const inputBg = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" isCentered>
      <ModalOverlay backdropFilter="blur(2px)" />
      <ModalContent borderRadius="xl" boxShadow="2xl" bg={modalBg} color={textColor}>
        <ModalHeader borderBottomWidth="1px" borderColor={borderColor} pb={4}>
          {initialData ? "Editar Ruta" : "Nueva Ruta"}
          <Text fontSize="sm" fontWeight="normal" color={subTextColor} mt={1}>
            {initialData ? "Actualiza la información de la ruta." : "Ingresa los datos para la nueva ruta."}
          </Text>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody py={6}>
          <VStack spacing={5}>
            <FormControl isInvalid={errors.nombre} isRequired>
              <FormLabel>Nombre de la Ruta</FormLabel>
              <Input
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                placeholder="Ej. Ruta 1"
                variant="filled"
                bg={inputBg}
                _hover={{ bg: inputBg }}
                _focus={{ bg: inputBg, borderColor: "green.400" }}
              />
              <FormErrorMessage>{errors.nombre}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.paisId} isRequired>
              <FormLabel>País</FormLabel>
              <PaisSelector
                value={formData.paisId}
                onPaisChange={handlePaisChange}
              />
              <FormErrorMessage>{errors.paisId}</FormErrorMessage>
            </FormControl>

            <FormControl display="flex" alignItems="center" bg={useColorModeValue("gray.50", "gray.700")} p={3} borderRadius="md" borderColor={borderColor} borderWidth="1px">
              <FormLabel mb="0" flex="1">
                Estado
                <Text fontSize="xs" color={subTextColor} fontWeight="normal">
                  Activa o desactiva la ruta.
                </Text>
              </FormLabel>
              <Switch
                name="estaActivo"
                isChecked={formData.estaActivo}
                onChange={handleInputChange}
                colorScheme="green"
                size="lg"
              />
            </FormControl>
          </VStack>
        </ModalBody>
        <ModalFooter borderTopWidth="1px" borderColor={borderColor} pt={4}>
          <Button variant="ghost" mr={3} onClick={onClose} _hover={{ bg: useColorModeValue("gray.100", "gray.700") }}>
            Cancelar
          </Button>
          <Button
            colorScheme="green"
            onClick={handleSubmit}
            isLoading={isSaving}
            loadingText="Guardando"
            px={8}
          >
            {initialData ? "Actualizar" : "Guardar"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default RutaModal;
