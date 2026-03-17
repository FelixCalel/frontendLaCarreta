import {
  Button,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";

export const PermisosSuccessDialog = ({ isOpen, onClose, dialogRef }) => {
  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={dialogRef}
      onClose={onClose}
      isCentered
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Cambios guardados
          </AlertDialogHeader>

          <AlertDialogBody>
            Los permisos se han guardado exitosamente.
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button
              colorScheme="green"
              onClick={onClose}
              ml={3}
            >
              Aceptar
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};
