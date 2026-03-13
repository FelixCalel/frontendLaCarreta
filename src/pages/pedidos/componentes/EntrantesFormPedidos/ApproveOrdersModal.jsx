import PropTypes from "prop-types";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Textarea,
  Text,
  Button,
  Box,
  Input,
} from "@chakra-ui/react";

const ApproveOrdersModal = ({
  isOpen,
  onClose,
  selectedCount,
  approveData,
  setApproveData,
  handleConfirmApprove,
  isProcessing,
  inputBg,
  borderColor,
  textColor,
  calendarFilter,
}) => (
  <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>Confirmar Pedido</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Text mb={4} fontWeight="medium" color={textColor}>
          ¿Estás seguro de que quieres aprobar{" "}
          {selectedCount > 1 ? "estos pedidos" : "este pedido"}?
        </Text>

        {selectedCount === 1 ? (
          <>
            <Text mb={1} fontWeight="bold" fontSize="sm" color={textColor}>
              Fecha de entrega *
            </Text>
            <Box mb={4}>
              <Input
                type="date"
                value={approveData.fechaOrdenDisplay}
                onChange={(e) =>
                  setApproveData({
                    ...approveData,
                    fechaOrdenDisplay: e.target.value,
                  })
                }
                bg={inputBg}
                borderColor={borderColor}
                color={textColor}
                sx={{
                  "&::-webkit-calendar-picker-indicator": {
                    filter: calendarFilter,
                  },
                }}
              />
            </Box>

            <Text mb={1} fontWeight="bold" fontSize="sm" color={textColor}>
              Instrucciones de Entrega (Cliente)
            </Text>
            <Textarea
              placeholder="Instrucciones del cliente..."
              value={approveData.comentarioDisplay}
              onChange={(e) =>
                setApproveData({
                  ...approveData,
                  comentarioDisplay: e.target.value,
                  comentario: e.target.value,
                })
              }
              mb={4}
              bg={inputBg}
              borderColor={borderColor}
              color={textColor}
            />
          </>
        ) : (
          <Text color="gray.500" mb={4}>
            Se aprobarán {selectedCount} pedidos con sus fechas y comentarios
            originales.
          </Text>
        )}
      </ModalBody>
      <ModalFooter>
        <Button
          bg="red.500"
          color="white"
          _hover={{ bg: "red.600" }}
          mr={3}
          onClick={onClose}
        >
          Cancelar
        </Button>
        <Button
          colorScheme="green"
          onClick={handleConfirmApprove}
          isLoading={isProcessing}
        >
          Aprobar
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
);

ApproveOrdersModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  selectedCount: PropTypes.number.isRequired,
  approveData: PropTypes.object.isRequired,
  setApproveData: PropTypes.func.isRequired,
  handleConfirmApprove: PropTypes.func.isRequired,
  isProcessing: PropTypes.bool.isRequired,
  inputBg: PropTypes.string.isRequired,
  borderColor: PropTypes.string.isRequired,
  textColor: PropTypes.string.isRequired,
  calendarFilter: PropTypes.string.isRequired,
};

export default ApproveOrdersModal;
