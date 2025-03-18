import { useState } from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { Input } from "@chakra-ui/react";
import { updateCompra } from "../../../../store/Compras/thunks";

function CompraVentaInput({ compra, maxCantidad, onCantidadChange }) {
  const dispatch = useDispatch();

  const [localValue, setLocalValue] = useState(
    compra?.pedido_venta ? String(compra.pedido_venta) : "0"
  );

  const handleFocus = () => {
    if (localValue === "0") {
      setLocalValue("");
    }
  };

  const handleChange = (e) => {
    let val = e.target.value;

    if (val !== "" && !isNaN(val)) {
      if (parseInt(val, 10) > maxCantidad) {
        val = String(maxCantidad);
      }
    }

    setLocalValue(val);
  };

  const handleBlur = async () => {
    if (localValue.trim() === "" || isNaN(localValue)) {
      setLocalValue("0");
      onCantidadChange(0);
      await dispatch(updateCompra({ id: compra.id, pedido_venta: 0 }));
    } else {
      const parsed = parseInt(localValue, 10);
      setLocalValue(String(parsed));
      onCantidadChange(parsed);      
      await dispatch(updateCompra({ id: compra.id, pedido_venta: parsed }));
    }
  };

  return (
    <Input
      type="number"
      value={localValue}
      onFocus={handleFocus}
      onChange={handleChange}
      onBlur={handleBlur}
      min={0}
      max={maxCantidad}
      textAlign="right"
      width="120px"
      borderRadius="md"
      borderColor="gray.300"
      _focus={{ borderColor: "blue.400", boxShadow: "0 0 0 1px #4299E1" }}
    />
  );
}

CompraVentaInput.propTypes = {
  compra: PropTypes.shape({
    id: PropTypes.number.isRequired,
    pedido_venta: PropTypes.number,
  }).isRequired,
  maxCantidad: PropTypes.number.isRequired, 
  onCantidadChange: PropTypes.func.isRequired,
};

export default CompraVentaInput;
