import { useEffect } from "react";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import { Select } from "@chakra-ui/react";
import { tablaRuta } from "../../../store/Ruta/thunks";

const RutaSelector = ({ value, onChange }) => {
  const dispatch = useDispatch();
  const rutas = useSelector((state) => state.rutas);

  useEffect(() => {
    if (rutas.data.length === 0) {
      dispatch(tablaRuta());
    }
  }, [dispatch, rutas.data.length]);

  return (
    <Select value={value} onChange={onChange} placeholder="Seleccionar ruta">
      {rutas.data.map((ruta) => (
        <option key={ruta.id} value={ruta.id}>
          {ruta.nombre}
        </option>
      ))}
    </Select>
  );
};

RutaSelector.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
};

export default RutaSelector;
