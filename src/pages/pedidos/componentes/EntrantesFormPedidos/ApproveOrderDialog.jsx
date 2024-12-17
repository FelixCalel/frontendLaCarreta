import { useState } from 'react';
import PropTypes from 'prop-types';
import { 
    AlertDialog,
    AlertDialogOverlay,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogBody,
    AlertDialogFooter,
    Button,

 } from "@chakra-ui/react";

 const ApproveOrderDialog = ({
    isOpen,
    onClose,
    onConfirm,
    selectedPedidos,
  }) => {
    const [orderDate, setOrderDate] = useState(new Date().toISOString().split('T')[0]);
  
    const handleConfirm = () => {
      const today = new Date().toISOString().split('T')[0];
      if (orderDate < today) {
        alert('La fecha de orden debe ser a partir de hoy.');
        return;
      }
      onConfirm(orderDate);
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
              <label htmlFor="order-date">Fecha de Orden:</label>
              <input
                type="date"
                id="order-date"
                min={new Date().toISOString().split('T')[0]}
                value={orderDate}
                onChange={(e) => setOrderDate(e.target.value)}
                required
              />
            </AlertDialogBody>
            <AlertDialogFooter>
            <Button variant="outline" onClick={() => onClose()}>
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
