import PropTypes from "prop-types"; // Importa PropTypes
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
  HStack,
  FormControl,
  FormLabel,
  Box,
  Text,
} from "@chakra-ui/react";
import CiudadSelector from "./CiudadSelector";
import DeuSelector from "./DeuSelector";
import TiendaSelector from "./tiendaSelector";
import ProductosTable from "../detallesPedidosTable";

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
  pedidoIdGuardado,
  usuarioId,
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
    setCurrentPedido((prev) => ({ ...prev, tiendaId: value }));
    setIsTienda2Disabled(!!value);
  };

  const handleTiendaChange2 = (value) => {
    setCurrentPedido((prev) => ({ ...prev, tiendaId: value }));
    setIsTienda1Disabled(!!value);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={{ base: "full", md: "lg" }}>
      <ModalOverlay />
      <ModalContent
        borderRadius="lg"
        boxShadow="xl"
        p={4}
        bg="white"
        maxW={{ base: "95%", md: "600px" }}
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
                <FormLabel fontSize="sm" color="gray.600">
                  Seleccione una ciudad
                </FormLabel>
                <CiudadSelector
                  value={
                    currentPedido.ciudadId ? String(currentPedido.ciudadId) : ""
                  }
                  onChange={handleCiudadChange}
                />
              </FormControl>

              <FormControl>
                <FormLabel fontSize="sm" color="gray.600">
                  Seleccione un deudor
                </FormLabel>
                <DeuSelector
                  ciudadId={currentPedido.ciudadId}
                  onSelect={handleDeudorSelect}
                />
              </FormControl>

              <HStack spacing={4} w="full" alignItems="flex-start">
                <FormControl flex="1" isDisabled={isTienda2Disabled}>
                  <FormLabel fontSize="sm" color="gray.600">
                    Tiendas asignadas
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
                  <FormLabel fontSize="sm" color="gray.600">
                    Todas las tiendas
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
              <Text fontSize="md" fontWeight="medium" mb={3}>
                Agregue productos al pedido:
              </Text>
              <ProductosTable
                pedidoId={pedidoIdGuardado}
                usuarioId={usuarioId}
              />
            </Box>
          )}
        </ModalBody>

        <ModalFooter justifyContent="center">
          <HStack spacing={4}>
            <Button
              colorScheme="teal"
              size="md"
              onClick={handleSubmit}
              isLoading={isLoading}
              spinner={<Spinner size="sm" color="white" />}
              _hover={{ transform: "scale(1.05)", boxShadow: "lg" }}
            >
              {isPedidoFinalizado ? "Agregar" : "Guardar"}
            </Button>
            <Button
              variant="outline"
              size="md"
              onClick={() => {
                onClose();
                resetForm();
              }}
              _hover={{ transform: "scale(1.05)", boxShadow: "lg" }}
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
    tiendaId2: PropTypes.number, // Agregado aquí
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
