import { useEffect } from "react";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import { tablaCiudad } from "../../../store/Ciudad/thunks";

const CiudadSelector = ({ value, onChange }) => {
  const dispatch = useDispatch();
  const ciudades = useSelector((state) => state.ciudades.data);
  
  const paisId = localStorage.getItem("paisId"); // Obtener el paisId desde el localStorage

  useEffect(() => {
    dispatch(tablaCiudad());
  }, [dispatch]);

  // Filtrar las ciudades basadas en el paisId del usuario
  const ciudadesFiltradas = ciudades.filter(ciudad => ciudad.paisId === parseInt(paisId, 10));

  return (
    <select value={value} onChange={onChange}>
      <option value="">Seleccionar ciudad</option>

      {ciudadesFiltradas.map((ciudad) => (
        <option key={ciudad.id} value={ciudad.id}>
          {ciudad.nombre}
        </option>
      ))}
    </select>
  );
};

CiudadSelector.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default CiudadSelector;
