import {
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
} from "@chakra-ui/react";
import PropTypes from "prop-types";

export const DeleteEmpresaDialog = ({
  isOpen,
  onClose,
  cancelRef,
  handleDelete,
}) => {
  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
      isCentered
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Eliminar empresa
          </AlertDialogHeader>

          <AlertDialogBody>
            ¿Seguro que deseas eliminar esta empresa? Esta acción no se puede deshacer.
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Cancelar
            </Button>
            <Button colorScheme="red" ml={3} onClick={handleDelete}>
              Sí, eliminar
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

DeleteEmpresaDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  cancelRef: PropTypes.object.isRequired,
  handleDelete: PropTypes.func.isRequired,
};
