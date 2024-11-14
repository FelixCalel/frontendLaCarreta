import { Tooltip, IconButton, Button } from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import PropTypes from "prop-types"; // Importa PropTypes

const PedidoActions = ({ pedido, onDialogOpen, setSelectedPedidoId }) => {
  const handleRealizarPedido = () => {
    setSelectedPedidoId(pedido.id);
    onDialogOpen();
  };

  return (
    <>
      <Tooltip label="Eliminar Pedido" hasArrow>
        <IconButton
          icon={<DeleteIcon />}
          colorScheme="red"
          onClick={() => {/* Add delete action here */}}
          size="sm"
        />
      </Tooltip>
      <Button
        colorScheme="teal"
        onClick={handleRealizarPedido}
        isDisabled={pedido.estadoId === 2}
        size="sm"
      >
        Realizar Pedido
      </Button>
    </>
  );
};

// Define las propTypes para validar las props
PedidoActions.propTypes = {
  pedido: PropTypes.shape({
    id: PropTypes.number.isRequired,
    estadoId: PropTypes.number.isRequired,
  }).isRequired,
  onDialogOpen: PropTypes.func.isRequired,
  setSelectedPedidoId: PropTypes.func.isRequired,
};

export default PedidoActions;
