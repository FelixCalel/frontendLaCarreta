import PropTypes from "prop-types";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
  FormControl,
  FormLabel,
  Textarea,
  Input,
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
  comentario,
  setComentario,
  fecha,
  setFecha,
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
          <AlertDialogBody>
            {confirmMessage}
            <FormControl mt={4} isRequired>
              <FormLabel>Fecha del pedido</FormLabel>
              <Input
                type="date"
                min={new Date().toISOString().split("T")[0]}
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Comentario </FormLabel>
              <Textarea
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                maxLength={255}
                placeholder="Ej.: entregar por la mañana"
              />
            </FormControl>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose} isDisabled={isLoading}>
              {cancelButtonLabel}
            </Button>
            <Button
              colorScheme="green"
              onClick={() => onConfirm({ comentario, fecha })}
              ml={3}
              isLoading={isLoading}
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
  comentario: PropTypes.string.isRequired,
  setComentario: PropTypes.func.isRequired,
  fecha: PropTypes.string.isRequired,
  setFecha: PropTypes.func.isRequired,
};

export default ConfirmDialog;
