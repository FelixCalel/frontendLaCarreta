import PropTypes from "prop-types";
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
} from "@chakra-ui/react";
import { FaCity, FaStoreAlt } from "react-icons/fa"; // Iconos
import { MdOutlinePerson } from "react-icons/md";
import CiudadSelector from "./CiudadSelector";
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
}) => {
  const handleCiudadChange = (e) => {
    setCurrentPedido((prev) => ({
      ...prev,
      ciudadId: parseInt(e.target.value),
    }));
  };

  const handleDeudorSelect = (deudorId) => {
    setCurrentPedido((prev) => ({ ...prev, deudorId }));
  };

  const handleTiendaChange = (value) => {
    setCurrentPedido((prev) => ({
      ...prev,
      tiendaId: value,
      tiendaId2: null, // Limpia el otro selector
    }));
    setIsTienda2Disabled(!!value); // Desactiva el otro selector si hay valor
  };

  const handleTiendaChange2 = (value) => {
    setCurrentPedido((prev) => ({
      ...prev,
      tiendaId: null, // Limpia el primer selector
      tiendaId2: value,
    }));
    setIsTienda1Disabled(!!value); // Desactiva el primer selector si hay valor
  };

  const clearTienda = () => {
    setCurrentPedido((prev) => ({
      ...prev,
      tiendaId: null,
      tiendaId2: null,
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
      size={{ base: "md", md: "lg" }}
    >
      <ModalOverlay />
      <ModalContent
        borderRadius="xl"
        boxShadow="2xl"
        bg="white"
        maxW={{ base: "90%", md: "600px" }}
        p={4}
      >
        <ModalHeader
          fontSize="2xl"
          fontWeight="bold"
          textAlign="center"
          color="teal.600"
        >
          {isPedidoFinalizado ? "Agregar Productos" : "Agregar Pedido"}
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          {!isPedidoFinalizado ? (
            <VStack spacing={5}>
              <FormControl>
                <FormLabel fontSize="md" fontWeight="bold" color="gray.600">
                  <HStack>
                    <Icon as={FaCity} color="teal.500" />
                    <Text>Seleccione una ciudad</Text>
                  </HStack>
                </FormLabel>

                <CiudadSelector
                  value={
                    currentPedido.ciudadId ? String(currentPedido.ciudadId) : ""
                  }
                  onChange={handleCiudadChange}
                />
              </FormControl>

              <FormControl>
                <FormLabel fontSize="md" fontWeight="bold" color="gray.600">
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

              <HStack spacing={4} w="full" alignItems="flex-start">
                <FormControl flex="1" isDisabled={isTienda2Disabled}>
                  <FormLabel
                    fontSize="md"
                    fontWeight="bold"
                    color="gray.600" // Ajusta el color para ser consistente
                  >
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
                    isRutaFilter={true}
                  />
                </FormControl>

                <FormControl flex="1" isDisabled={isTienda1Disabled}>
                  <FormLabel
                    fontSize="md"
                    fontWeight="bold"
                    color="gray.600" // Ajusta el color para ser consistente
                  >
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
              </HStack>
            </VStack>
          ) : (
            <Box>
              <Text fontSize="lg" fontWeight="medium" mb={3} textAlign="center">
                Agregue productos al pedido:
              </Text>
            </Box>
          )}
        </ModalBody>

        <ModalFooter justifyContent="center">
          <HStack spacing={4}>
            <Button
              colorScheme="teal"
              size="lg"
              onClick={handleSubmit}
              isLoading={isLoading}
              spinner={<Spinner size="sm" color="white" />}
              _hover={{ transform: "scale(1.1)", boxShadow: "lg" }}
            >
              {isPedidoFinalizado ? "Agregar" : "Guardar"}
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                onClose();
                resetForm();
                clearTienda();
              }}
              _hover={{ transform: "scale(1.1)", boxShadow: "lg" }}
            >
              Cancelar
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
  pedidoIdGuardado: PropTypes.number,
  usuarioId: PropTypes.number.isRequired,
  isTienda1Disabled: PropTypes.bool.isRequired,
  isTienda2Disabled: PropTypes.bool.isRequired,
  setIsTienda1Disabled: PropTypes.func.isRequired,
  setIsTienda2Disabled: PropTypes.func.isRequired,
  resetForm: PropTypes.func.isRequired,
};

export default PedidoModal;
