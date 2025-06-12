import { useState } from "react";
import PropTypes from "prop-types";
import {
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
} from "@chakra-ui/react";

const ApproveOrderDialog = ({
  isOpen,
  onClose,
  onConfirm,
  selectedPedidos,
}) => {
  const [orderDate, setOrderDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [comentario, setComentario] = useState("");

  const handleConfirm = () => {
    const [year, month, day] = orderDate.split("-");
    const fechaFormateada = `${day}/${month}/${year}`;
    console.log("Fecha formateada a enviar:", fechaFormateada);
    onConfirm({ fechaOrden: fechaFormateada, comentario });
    onClose();
  };

  return (
    <AlertDialog isOpen={isOpen} onClose={onClose} isCentered>
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Aprobar {selectedPedidos.length} Pedidos
          </AlertDialogHeader>
          <AlertDialogBody>
            <VStack spacing={4} align="stretch">
              <FormControl>
                <FormLabel htmlFor="order-date">Fecha de Orden:</FormLabel>
                <Input
                  id="order-date"
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  value={orderDate}
                  onChange={(e) => setOrderDate(e.target.value)}
                />
              </FormControl>

              <FormControl>
                <FormLabel htmlFor="comentario">Comentario:</FormLabel>
                <Input
                  id="comentario"
                  placeholder="Escribe un comentario..."
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                />
              </FormControl>
            </VStack>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button colorScheme="green" onClick={handleConfirm} ml={3}>
              Aprobar
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

ApproveOrderDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  selectedPedidos: PropTypes.array.isRequired,
};

export default ApproveOrderDialog;
