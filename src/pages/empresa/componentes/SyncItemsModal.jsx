import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Button,
} from "@chakra-ui/react";
import PropTypes from "prop-types";

export const SyncItemsModal = ({
  isOpen,
  onClose,
  warehouses,
  setWarehouses,
  handleSyncWithWarehouses,
  syncDisabled,
  currentEmpresaId,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Sincronizar Items</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>Almacenes (separados por comas)</FormLabel>
            <Input
              placeholder="Ejemplo: CA-0300, CA-0100"
              value={warehouses}
              onChange={(e) => setWarehouses(e.target.value)}
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="green"
            mr={3}
            onClick={handleSyncWithWarehouses}
            isDisabled={syncDisabled[currentEmpresaId]}
          >
            Sincronizar
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

SyncItemsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  warehouses: PropTypes.string.isRequired,
  setWarehouses: PropTypes.func.isRequired,
  handleSyncWithWarehouses: PropTypes.func.isRequired,
  syncDisabled: PropTypes.object,
  currentEmpresaId: PropTypes.any,
};
