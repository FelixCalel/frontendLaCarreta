import PropTypes from "prop-types";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
} from "@chakra-ui/react";
import MuestreoPanel from "./MuestreoPanel";

export default function MuestreoModal({
  isOpen,
  onClose,
  selected,
  onSave,
  saving,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="2xl"
      isCentered
      motionPreset="scale"
      scrollBehavior="inside"
    >
      <ModalOverlay backdropFilter="blur(2px)" />
      <ModalContent>
        <ModalHeader>Muestreo</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <MuestreoPanel
            selected={selected}
            onClose={onClose}
            onSave={onSave}
            saving={saving}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

MuestreoModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  selected: PropTypes.shape({
    qaId: PropTypes.number,
    muestreoId: PropTypes.number,
  }),
  onSave: PropTypes.func.isRequired,
  saving: PropTypes.bool,
};
