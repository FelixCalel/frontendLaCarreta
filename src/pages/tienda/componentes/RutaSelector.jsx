import { useEffect } from "react";
import PropTypes from "prop-types"; // Importamos PropTypes para la validación de las props
import { useSelector, useDispatch } from "react-redux";
import { tablaRuta } from "../../../store/Ruta/thunks";

const RutaSelector = ({ value, onChange }) => {
  const dispatch = useDispatch();
  const rutas = useSelector((state) => state.rutas);

  useEffect(() => {
    dispatch(tablaRuta());
  }, [dispatch]);

  return (
    <select value={value} onChange={onChange}>
      {/* Opción por defecto */}
      <option value="">Seleccionar ruta</option>
      
      {/* Mapeamos las rutas disponibles */}
      {rutas.data.map((ruta) => (
        <option key={ruta.id} value={ruta.id}>
          {ruta.nombre}
        </option>
      ))}
    </select>
  );
};

// Añadimos la validación de las props con PropTypes
RutaSelector.propTypes = {
  value: PropTypes.string.isRequired,  // 'value' debe ser una string y es obligatorio
  onChange: PropTypes.func.isRequired, // 'onChange' debe ser una función y es obligatorio
};

export default RutaSelector;
