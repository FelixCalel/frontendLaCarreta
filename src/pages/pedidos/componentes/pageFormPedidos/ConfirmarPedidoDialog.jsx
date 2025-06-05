import PropTypes from "prop-types";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
} from "@chakra-ui/react";
import { useRef } from "react";

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  confirmMessage = "¿Estás seguro de que quieres realizar este pedido?",
  confirmButtonLabel = "Sí",
  cancelButtonLabel = "No",
}) => {
  const cancelRef = useRef();

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Confirmar Pedido
          </AlertDialogHeader>
          <AlertDialogBody>{confirmMessage}</AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose} isDisabled={isLoading}>
              {cancelButtonLabel}
            </Button>
            <Button
              colorScheme="green"
              onClick={onConfirm}
              ml={3}
              isLoading={isLoading}
              _hover={{ transform: "scale(1.05)", transition: "0.2s" }}
            >
              {confirmButtonLabel}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

ConfirmDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  confirmMessage: PropTypes.string,
  confirmButtonLabel: PropTypes.string,
  cancelButtonLabel: PropTypes.string,
};

export default ConfirmDialog;
