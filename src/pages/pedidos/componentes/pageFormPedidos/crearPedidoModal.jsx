import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Spinner,
  VStack,
  FormControl,
  FormLabel,
  HStack,
  Icon,
  Box,
  Text,
  useToast,
  Grid,
  GridItem,
  useColorModeValue, // <-- Importar
} from "@chakra-ui/react";
import { FaStoreAlt, FaBan } from "react-icons/fa";
import { MdOutlinePerson } from "react-icons/md";
import DeuSelector from "./DeuSelector";
import TiendaSelector from "./tiendaSelector";

const PedidoModal = ({
  isOpen,
  onClose,
  isPedidoFinalizado,
  isLoading,
  currentPedido,
  setCurrentPedido,
  handleSubmit,
  usuarioRutas,
  paisId,
  isTienda1Disabled,
  isTienda2Disabled,
  setIsTienda1Disabled,
  setIsTienda2Disabled,
  resetForm,
  copiarUltimoPedido,
}) => {
  const toast = useToast();

  // 1. Definir colores para modo claro/oscuro
  const modalBg = useColorModeValue("white", "gray.800");
  const headingColor = useColorModeValue("teal.600", "teal.200");
  const labelColor = useColorModeValue("gray.600", "gray.300");
  const textSubColor = useColorModeValue("gray.700", "gray.200");

  // Iconos
  const assignedIconColor = useColorModeValue("teal.500", "teal.300");
  const noAssignedIconColor = useColorModeValue("red.500", "red.300");
  const personIconColor = useColorModeValue("teal.600", "teal.200");

  // 2. Lógica para deudor
  const handleDeudorSelect = (deudorId) => {
    setCurrentPedido((prev) => ({ ...prev, deudorId }));
  };

  // 3. Obtener tiendas de Redux
  const allTiendas = useSelector((state) => state.tiendas.data || []);
  const obtenerTiendaPorId = (tiendaId) => {
    return allTiendas.find((tienda) => tienda.id === tiendaId) || null;
  };

  // 4. Cambiar tienda principal
  const handleTiendaChange = (tiendaId) => {
    if (tiendaId) {
      const tiendaSeleccionada = obtenerTiendaPorId(tiendaId);
      setCurrentPedido((prev) => ({
        ...prev,
        tiendaId,
        tiendaId2: null, // Se limpia la otra
        ciudadId: tiendaSeleccionada?.ciudadId || null,
        deudorId: tiendaSeleccionada?.deudorId || null,
      }));
    } else {
      setCurrentPedido((prev) => ({
        ...prev,
        tiendaId: null,
        ciudadId: null,
        deudorId: null,
      }));
    }
  };

  // 5. Cambiar tienda secundaria (no asignada)
  const handleTiendaChange2 = (tiendaId) => {
    if (tiendaId) {
      const tiendaSeleccionada = obtenerTiendaPorId(tiendaId);
      setCurrentPedido((prev) => ({
        ...prev,
        tiendaId2: tiendaId,
        tiendaId: null, // Limpiamos la otra
        ciudadId: tiendaSeleccionada?.ciudadId || null,
        deudorId: tiendaSeleccionada?.deudorId || null,
      }));
    } else {
      setCurrentPedido((prev) => ({
        ...prev,
        tiendaId2: null,
        ciudadId: null,
        deudorId: null,
      }));
    }
  };

  // 6. Limpiar ambas tiendas
  const clearTienda = () => {
    setCurrentPedido((prev) => ({
      ...prev,
      tiendaId: null,
      tiendaId2: null,
      ciudadId: null,
      deudorId: null,
    }));
    setIsTienda1Disabled(false);
    setIsTienda2Disabled(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      motionPreset="slideInBottom"
      size={{ base: "sm", md: "md", lg: "lg" }}
    >
      <ModalOverlay />
      <ModalContent
        borderRadius="lg"
        boxShadow="xl"
        bg={modalBg}            // <-- Modo claro/oscuro
        maxW={{ base: "95%", md: "600px" }}
        p={4}
        overflow="hidden"
      >
        <ModalHeader
          fontSize={{ base: "lg", md: "2xl" }}
          fontWeight="bold"
          textAlign="center"
          color={headingColor}   // <-- Modo claro/oscuro
        >
          {isPedidoFinalizado ? "Agregar Productos" : "Agregar Pedido"}
        </ModalHeader>

        <ModalCloseButton />

        <ModalBody>
          {!isPedidoFinalizado ? (
            <VStack spacing={4}>
              <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4} w="full">
                {/* Tiendas asignadas */}
                <GridItem>
                  <FormControl isDisabled={isTienda2Disabled}>
                    <FormLabel fontSize="sm" fontWeight="bold" color={labelColor}>
                      <HStack>
                        <Icon as={FaStoreAlt} color={assignedIconColor} />
                        <Text>Tiendas asignadas</Text>
                      </HStack>
                    </FormLabel>
                    <TiendaSelector
                      rutaIds={usuarioRutas || []}
                      paisId={Number(paisId)}
                      value={currentPedido.tiendaId}
                      onChange={handleTiendaChange}
                      isRutaFilter={true}   // Asignadas
                      isSecondSelector={false}  
                    />
                  </FormControl>
                </GridItem>

                {/* Tiendas NO asignadas */}
                <GridItem>
                  <FormControl isDisabled={isTienda1Disabled}>
                    <FormLabel fontSize="sm" fontWeight="bold" color={labelColor}>
                      <HStack>
                        <Icon as={FaBan} color={noAssignedIconColor} />
                        <Text>Tiendas NO asignadas</Text>
                      </HStack>
                    </FormLabel>
                    <TiendaSelector
                      rutaIds={[]}
                      paisId={Number(paisId)}
                      value={currentPedido.tiendaId2}
                      onChange={handleTiendaChange2}
                      isRutaFilter={false}  // No asignadas
                      isSecondSelector={true}
                    />
                  </FormControl>
                </GridItem>
              </Grid>

              {/* Deudor */}
              <FormControl>
                <FormLabel fontSize="sm" fontWeight="bold" color={labelColor}>
                  <HStack>
                    <Icon as={MdOutlinePerson} color={personIconColor} />
                    <Text>Deu de la tienda</Text>
                  </HStack>
                </FormLabel>
                <DeuSelector
                  ciudadId={currentPedido.ciudadId}
                  deudorId={currentPedido.deudorId}
                  onSelect={handleDeudorSelect}
                />
              </FormControl>
            </VStack>
          ) : (
            <Box>
              <Text fontSize="md" fontWeight="medium" mb={3} textAlign="center" color={textSubColor}>
                Agregue productos al pedido:
              </Text>
            </Box>
          )}
        </ModalBody>

        <ModalFooter justifyContent="center">
          <HStack spacing={4} wrap="wrap" justify="center">
            <Button
              colorScheme="blue"
              onClick={() => {
                const tiendaSeleccionada = currentPedido.tiendaId || currentPedido.tiendaId2;
                if (tiendaSeleccionada) {
                  copiarUltimoPedido(tiendaSeleccionada);
                } else {
                  toast({
                    title: "Error",
                    description: "Debe seleccionar una tienda primero.",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                  });
                }
              }}
              size="sm"
              px={3}
              py={2}
              fontSize="sm"
              width="auto"
              variant="outline"
            >
              Copiar Último Pedido
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onClose();
                resetForm();
                clearTienda();
              }}
              px={4}
              py={2}
            >
              Cancelar
            </Button>
            <Button
              colorScheme="teal"
              size="sm"
              onClick={handleSubmit}
              isLoading={isLoading}
              spinner={<Spinner size="xs" color="white" />}
              px={4}
              py={2}
            >
              {isPedidoFinalizado ? "Agregar" : "Guardar"}
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

PedidoModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  isPedidoFinalizado: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  currentPedido: PropTypes.shape({
    ciudadId: PropTypes.number,
    deudorId: PropTypes.number,
    tiendaId: PropTypes.number,
    tiendaId2: PropTypes.number,
  }).isRequired,
  setCurrentPedido: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  usuarioRutas: PropTypes.arrayOf(PropTypes.number).isRequired,
  paisId: PropTypes.number.isRequired,
  isTienda1Disabled: PropTypes.bool.isRequired,
  isTienda2Disabled: PropTypes.bool.isRequired,
  setIsTienda1Disabled: PropTypes.func.isRequired,
  setIsTienda2Disabled: PropTypes.func.isRequired,
  resetForm: PropTypes.func.isRequired,
  copiarUltimoPedido: PropTypes.func.isRequired,
};

export default PedidoModal;
