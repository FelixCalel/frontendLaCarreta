import { useEffect } from "react";
import PropTypes from "prop-types"; // Importa PropTypes para la validación de props
import { useSelector, useDispatch } from "react-redux";
import { tablaCiudad } from "../../../store/Ciudad/thunks";

const CiudadSelector = ({ value, onChange }) => {
  const dispatch = useDispatch();
  const ciudades = useSelector((state) => state.ciudades);

  useEffect(() => {
    dispatch(tablaCiudad());
  }, [dispatch]);

  return (
    
    <select value={value} onChange={onChange}>
      {/* Opción por defecto */}
      <option value="">Seleccionar ciudad</option>

      {/* Mapear las ciudades disponibles */}
      {ciudades.data.map((ciudad) => (
        <option key={ciudad.id} value={ciudad.id}>
          {ciudad.nombre}
        </option>
      ))}
    </select>
  );
};

// Añade la validación de props
CiudadSelector.propTypes = {
  value: PropTypes.string.isRequired,  // 'value' debe ser una string y es obligatorio
  onChange: PropTypes.func.isRequired, // 'onChange' debe ser una función y es obligatorio
};

export default CiudadSelector;
