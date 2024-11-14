import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    Button
  } from "@chakra-ui/react";
  import PropTypes from "prop-types"; // Importar PropTypes
  
  const ConfirmarPedidoDialog = ({ isOpen, onClose, cancelRef, toast }) => {
    const handleRealizarPedido = () => {
      // Lógica para confirmar el pedido
      onClose();
      toast({ title: "Pedido realizado", status: "success" });
    };
  
    return (
      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">Confirmar Pedido</AlertDialogHeader>
            <AlertDialogBody>¿Estás seguro de que quieres realizar este pedido?</AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>No</Button>
              <Button colorScheme="green" onClick={handleRealizarPedido} ml={3}>Sí</Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    );
  };
  
  // Definir propTypes para la validación de propiedades
  ConfirmarPedidoDialog.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    cancelRef: PropTypes.object.isRequired,
    toast: PropTypes.func.isRequired,
  };
  
  export default ConfirmarPedidoDialog;
  