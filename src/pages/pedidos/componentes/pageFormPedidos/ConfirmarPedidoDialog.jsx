import PropTypes from "prop-types"; // Importa PropTypes
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

// Validación de props con PropTypes
ConfirmDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired, // Define si el diálogo está abierto
  onClose: PropTypes.func.isRequired, // Función para cerrar el diálogo
  onConfirm: PropTypes.func.isRequired, // Función para confirmar la acción
  isLoading: PropTypes.bool, // Indica si se está cargando algo
  confirmMessage: PropTypes.string, // Mensaje de confirmación
  confirmButtonLabel: PropTypes.string, // Texto del botón de confirmación
  cancelButtonLabel: PropTypes.string, // Texto del botón de cancelar
};

export default ConfirmDialog;
