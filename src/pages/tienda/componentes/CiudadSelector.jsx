// CiudadSelector.jsx
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { tablaCiudad } from "../../../store/Ciudad/thunks";

const CiudadSelector = ({ paisId, value, onChange }) => {
  const dispatch = useDispatch();
  const ciudades = useSelector((state) => state.ciudades.data);

  useEffect(() => {
    dispatch(tablaCiudad(paisId)); // Filtra las ciudades por país
  }, [dispatch, paisId]);

  return (
    <select value={value} onChange={onChange}>
      <option value="">Seleccionar ciudad</option>
      {ciudades.map((ciudad) => (
        <option key={ciudad.id} value={ciudad.id}>
          {ciudad.nombre}
        </option>
      ))}
    </select>
  );
};

CiudadSelector.propTypes = {
  paisId: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default CiudadSelector;