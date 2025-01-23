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
} from "@chakra-ui/react";
import { FaStoreAlt } from "react-icons/fa"; 
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

  const handleDeudorSelect = (deudorId) => {
    setCurrentPedido((prev) => ({ ...prev, deudorId }));
  };

  const allTiendas = useSelector((state) => state.tiendas.data || []);
  const obtenerTiendaPorId = (tiendaId) => {
    return allTiendas.find((tienda) => tienda.id === tiendaId) || null;
  };

  const handleTiendaChange = (tiendaId) => {
    if (tiendaId) {
      const tiendaSeleccionada = obtenerTiendaPorId(tiendaId);

      setCurrentPedido((prev) => ({
        ...prev,
        tiendaId,
        tiendaId2: null, // Limpia la otra tienda
        ciudadId: tiendaSeleccionada?.ciudadId || null,
        // Si quieres también setear deudorId con base en la tienda, puedes hacerlo aquí.
        // deudorId: tiendaSeleccionada?.deudorId || null,
      }));
      setIsTienda2Disabled(true);
    } else {
      setCurrentPedido((prev) => ({
        ...prev,
        tiendaId: null,
        ciudadId: null,
      }));
      setIsTienda2Disabled(false);
    }
  };
  

  const handleTiendaChange2 = (tiendaId) => {
    if (tiendaId) {
      const tiendaSeleccionada = obtenerTiendaPorId(tiendaId);

      setCurrentPedido((prev) => ({
        ...prev,
        tiendaId: null, // Limpia la primera tienda
        tiendaId2: tiendaId,
        ciudadId: tiendaSeleccionada?.ciudadId || null,
        // Igualmente si deseas setear deudorId
      }));
      setIsTienda1Disabled(true);
    } else {
      setCurrentPedido((prev) => ({
        ...prev,
        tiendaId2: null,
        ciudadId: null,
      }));
      setIsTienda1Disabled(false);
    }
  };

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
        bg="white"
        maxW={{ base: "95%", md: "600px" }}
        p={4}
        overflow="hidden"
      >
        <ModalHeader
          fontSize={{ base: "lg", md: "2xl" }}
          fontWeight="bold"
          textAlign="center"
          color="teal.600"
        >
          {isPedidoFinalizado ? "Agregar Productos" : "Agregar Pedido"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {!isPedidoFinalizado ? (
            <VStack spacing={4}>
              {/* Nuevo Grid para los selectores de tiendas */}
              <Grid
                templateColumns={{ base: "1fr", md: "1fr 1fr" }}
                gap={4}
                w="full"
              >
                <GridItem>
                  <FormControl isDisabled={isTienda2Disabled}>
                    <FormLabel fontSize="sm" fontWeight="bold" color="gray.600">
                      <HStack>
                        <Icon as={FaStoreAlt} color="teal.500" />
                        <Text>Tiendas asignadas</Text>
                      </HStack>
                    </FormLabel>
                    <TiendaSelector
                      rutaIds={usuarioRutas || []}
                      paisId={Number(paisId)}
                      value={currentPedido.tiendaId}
                      onChange={handleTiendaChange}
                      deudorId={currentPedido.deudorId}
                      ciudadId={currentPedido.ciudadId}
                      isRutaFilter={true}
                    />
                  </FormControl>
                </GridItem>
                <GridItem>
                  <FormControl isDisabled={isTienda1Disabled}>
                    <FormLabel fontSize="sm" fontWeight="bold" color="gray.600">
                      <HStack>
                        <Icon as={FaStoreAlt} color="teal.500" />
                        <Text>Todas las tiendas</Text>
                      </HStack>
                    </FormLabel>
                    <TiendaSelector
                      rutaIds={[]}
                      paisId={Number(paisId)}
                      value={currentPedido.tiendaId2}
                      onChange={handleTiendaChange2}
                      isRutaFilter={false}
                    />
                  </FormControl>
                  
                </GridItem>
              </Grid>
              <FormControl>
                <FormLabel fontSize="sm" fontWeight="bold" color="gray.600">
                  <HStack>
                    <Icon as={MdOutlinePerson} color="teal.500" />
                    <Text>Seleccione un deudor</Text>
                  </HStack>
                </FormLabel>
                <DeuSelector
                  ciudadId={currentPedido.ciudadId}
                  onSelect={handleDeudorSelect}
                />
              </FormControl>
            </VStack>
          ) : (
            <Box>
              <Text fontSize="md" fontWeight="medium" mb={3} textAlign="center">
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
                const tiendaSeleccionada =
                  currentPedido.tiendaId || currentPedido.tiendaId2;
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
