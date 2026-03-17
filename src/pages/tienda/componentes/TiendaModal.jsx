import { useState, useEffect } from "react";
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
  SimpleGrid,
  useToast,
  VStack,
  Text,
  Divider,
  useColorModeValue,
} from "@chakra-ui/react";
import CiudadSelector from "./CiudadSelector";
import RutaSelector from "./RutaSelector";
import DeuSelector from "./DeuSelector";

const TiendaModal = ({ isOpen, onClose, initialData, onSave }) => {
  const [state, setState] = useState(() => ({
    formData: {
      nombre: "",
      descuento: 0,
      estaActivo: true,
      deudorId: "",
      ciudadId: "",
      zona: "",
      rutaId: "",
      deudorCorrelativo: "",
      nombreDeu: "",
    },
    errors: {},
  }));
  const [isSaving, setIsSaving] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (!isOpen) return;

    setState((prev) => ({
      ...prev,
      errors: {},
      formData: initialData ? {
        ...initialData,
        zona: initialData.zona || "",
        ciudadId: initialData.ciudadId?.toString() || "",
        rutaId: initialData.rutaId?.toString() || "",
        deudorId: initialData.deudorId || "",
        deudorCorrelativo: initialData.nombreCorrelativo || "",
        nombreDeu: initialData.nombreDeu || "",
        estaActivo: initialData.estaActivo !== undefined ? initialData.estaActivo : true,
      } : {
        nombre: "",
        descuento: 0,
        estaActivo: true,
        deudorId: "",
        ciudadId: "",
        zona: "",
        rutaId: "",
        deudorCorrelativo: "",
        nombreDeu: "",
      },
    }));
  }, [isOpen, initialData]);

  const { formData, errors } = state;
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

  const handleDeudorSelect = (deudor) => {
    setState((prev) => ({
      ...prev,
      formData: {
        ...prev.formData,
        deudorId: deudor?.id || null,
        deudorCorrelativo: deudor?.correlativo || null,
        nombreDeu: deudor?.nombre || null,
      },
      errors: {
        ...prev.errors,
        deudorId: null,
      },
    }));
  };

  const validateFields = () => {
    let newErrors = {};
    if (!formData.nombre?.trim()) newErrors.nombre = "El nombre es obligatorio";
    if (formData.descuento === "" || isNaN(formData.descuento)) {
      newErrors.descuento = "El descuento debe ser un número";
    }
    if (!formData.deudorId) newErrors.deudorId = "El deudor es obligatorio";
    if (!formData.ciudadId) newErrors.ciudadId = "La ciudad es obligatoria";
    if (!formData.rutaId) newErrors.rutaId = "La ruta es obligatoria";
    
    setState((prev) => ({ ...prev, errors: newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateFields()) {
      toast({
        title: "Error de validación",
        description: "Por favor revisa los campos requeridos.",
        status: "warning",
        duration: 3000,
      });
      return;
    }

    setIsSaving(true);
    try {
      const dataToSave = {
        ...formData,
        ciudadId: parseInt(formData.ciudadId, 10),
        rutaId: parseInt(formData.rutaId, 10),
        descuento: parseFloat(formData.descuento),
      };
      await onSave(dataToSave);
      onClose();
    } catch (error) {
      console.error("Error saving tienda:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const modalBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");
  const subTextColor = useColorModeValue("gray.600", "gray.400");
  const inputBg = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
      <ModalOverlay backdropFilter="blur(2px)" />
      <ModalContent borderRadius="xl" boxShadow="2xl" bg={modalBg} color={textColor}>
        <ModalHeader borderBottomWidth="1px" borderColor={borderColor} pb={4}>
          {initialData ? "Editar Tienda" : "Nueva Tienda"}
          <Text fontSize="sm" fontWeight="normal" color={subTextColor} mt={1}>
            {initialData ? "Actualiza la información de la tienda seleccionada." : "Ingresa los datos para registrar una nueva tienda."}
          </Text>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody py={6}>
          <VStack spacing={5}>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5} w="full">
              <FormControl isInvalid={errors.nombre} isRequired>
                <FormLabel>Nombre de la Tienda</FormLabel>
                <Input
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  placeholder="Ej. Tienda Central"
                  variant="filled"
                  bg={inputBg}
                  _hover={{ bg: inputBg }}
                  _focus={{ bg: inputBg, borderColor: "green.400" }}
                />
                <FormErrorMessage>{errors.nombre}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={errors.descuento} isRequired>
                <FormLabel>Descuento (%)</FormLabel>
                <Input
                  name="descuento"
                  type="number"
                  value={formData.descuento}
                  onChange={handleInputChange}
                  placeholder="0"
                  variant="filled"
                  bg={inputBg}
                  _hover={{ bg: inputBg }}
                  _focus={{ bg: inputBg, borderColor: "green.400" }}
                />
                <FormErrorMessage>{errors.descuento}</FormErrorMessage>
              </FormControl>
            </SimpleGrid>

            <Divider borderColor={borderColor} />

            <FormControl isInvalid={errors.deudorId} isRequired>
              <FormLabel>Deudor Asociado</FormLabel>
              <DeuSelector
                ciudadId={formData.ciudadId}
                onSelect={handleDeudorSelect}
                selectedDeudorId={formData.deudorId ? Number(formData.deudorId) : null}
              />
              <FormErrorMessage>{errors.deudorId}</FormErrorMessage>
            </FormControl>

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5} w="full">
              <FormControl isInvalid={errors.ciudadId} isRequired>
                <FormLabel>Ciudad</FormLabel>
                <CiudadSelector
                  value={formData.ciudadId}
                  onChange={(e) => {
                    handleInputChange(e);
                  }}
                />
                <FormErrorMessage>{errors.ciudadId}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={errors.rutaId} isRequired>
                <FormLabel>Ruta</FormLabel>
                <RutaSelector
                  value={formData.rutaId}
                  onChange={handleInputChange}
                />
                <FormErrorMessage>{errors.rutaId}</FormErrorMessage>
              </FormControl>
            </SimpleGrid>

            <FormControl>
              <FormLabel>Zona / Dirección</FormLabel>
              <Input
                name="zona"
                value={formData.zona}
                onChange={handleInputChange}
                placeholder="Ej. Zona 1"
                variant="filled"
                bg={inputBg}
                _hover={{ bg: inputBg }}
                _focus={{ bg: inputBg, borderColor: "green.400" }}
              />
            </FormControl>

            <FormControl display="flex" alignItems="center" bg={useColorModeValue("gray.50", "gray.700")} p={3} borderRadius="md" borderColor={borderColor} borderWidth="1px">
              <FormLabel mb="0" flex="1">
                Estado de la Tienda
                <Text fontSize="xs" color={subTextColor} fontWeight="normal">
                  Si se desactiva, no aparecerá en nuevos pedidos.
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

export default TiendaModal;
