import { useState } from "react";
import PropTypes from "prop-types";
import { FormControl, FormLabel, Input, FormErrorMessage } from "@chakra-ui/react";
import { useDispatch } from "react-redux"; 
import { addNewDetalleOrden } from "../../../store/Pedidos/DetallePedidos/thunks"; 

const CantidadInput = ({ pedidoId, productoId, value, onChange, error }) => {
  const dispatch = useDispatch();
  const [cantidad, setCantidad] = useState(value);  


  const handleInputChange = async (e) => {
    const { value } = e.target;
    setCantidad(value);


    if (onChange) {
      onChange(e);
    }

  
    if (pedidoId && productoId) {
      await dispatch(
        addNewDetalleOrden({
          pedidoId, 
          productoId,  
          cantidad: value, 
          precio: 0, 
        })
      );
    }
  };

  return (
    <FormControl mb={3} isInvalid={error} isRequired>
      <FormLabel>Cantidad</FormLabel>
      <Input
        name="cantidad"
        type="number"
        value={cantidad}
        onChange={handleInputChange} 
      />
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
};

// Validación de PropTypes
CantidadInput.propTypes = {
  pedidoId: PropTypes.number.isRequired,  
  productoId: PropTypes.number.isRequired,  
  value: PropTypes.number.isRequired, 
  onChange: PropTypes.func,  
  error: PropTypes.string, 
};

export default CantidadInput;
