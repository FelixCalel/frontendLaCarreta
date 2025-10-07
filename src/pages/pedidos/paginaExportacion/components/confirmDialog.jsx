import PropTypes from "prop-types";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Icon,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FiUploadCloud } from "react-icons/fi";
import { useRef } from "react";

export default function ConfirmExportDialog({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  pedidosCount = 0,
  variant = "f1",
}) {
  const cancelRef = useRef();

  const textoFormato = variant === "f2" ? "formato 2" : "formato 1";

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
      isCentered
      motionPreset="scale"
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader
            fontSize="lg"
            fontWeight="bold"
            bg="blue.500"
            color="white"
            display="flex"
            alignItems="center"
            gap={2}
            py={3}
            borderTopRadius="md"
          >
            <Icon as={FiUploadCloud} boxSize={6} />
            Exportar pedidos
          </AlertDialogHeader>

          <AlertDialogBody>
            <VStack align="flex-start" spacing={3}>
              <Text>
                Se enviarán&nbsp;
                <Text as="span" fontWeight="bold">
                  {pedidosCount}
                </Text>{" "}
                pedido(s) se generará el Excel.
              </Text>
              <Text>¿Quieres continuar?</Text>
            </VStack>
          </AlertDialogBody>

          <AlertDialogFooter gap={3}>
            <Button ref={cancelRef} onClick={onClose}>
              Cancelar
            </Button>

            <Button
              colorScheme="blue"
              onClick={onConfirm}
              isLoading={isLoading}
            >
              Sí, exportar
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}

ConfirmExportDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  pedidosCount: PropTypes.number,
  variant: PropTypes.oneOf(["f1", "f2"]),
};
