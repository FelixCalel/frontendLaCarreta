import { useEffect } from "react";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import { tablaCiudad } from "../../../../store/Ciudad/thunks";

const CiudadSelector = ({ value, onChange }) => {
  const dispatch = useDispatch();
  const ciudades = useSelector((state) => state.ciudades.data || []);
  const paisIdUsuario = localStorage.getItem('paisId'); // Obtener el país del usuario desde localStorage

  useEffect(() => {
    dispatch(tablaCiudad());
  }, [dispatch]);

  return (
    <select value={value.toString()} onChange={onChange}>
      <option value="">Seleccionar ciudad</option>
      {ciudades
        .filter((ciudad) => ciudad.estaActivo && ciudad.paisId === parseInt(paisIdUsuario, 10))  // Filtra ciudades activas y por país
        .map((ciudad) => (
          <option key={ciudad.id} value={ciudad.id.toString()}>
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
