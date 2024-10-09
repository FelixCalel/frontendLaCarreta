import { useEffect } from "react";
import PropTypes from "prop-types";
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
      <option value="">Seleccionar ciudad</option>
      {ciudades.data
        .filter((ciudad) => ciudad.estaActivo)  // Usamos el campo estaActivo para filtrar
        .map((ciudad) => (
          <option key={ciudad.id} value={ciudad.id}>
            {ciudad.nombre}
          </option>
        ))}
    </select>
  );
};

CiudadSelector.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default CiudadSelector;
