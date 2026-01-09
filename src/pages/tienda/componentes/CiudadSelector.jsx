import { useEffect } from "react";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import { Select } from "@chakra-ui/react";
import { tablaCiudad } from "../../../store/Ciudad/thunks";

const CiudadSelector = ({ value, onChange }) => {
  const dispatch = useDispatch();
  const ciudades = useSelector((state) => state.ciudades);

  useEffect(() => {
    if (ciudades.data.length === 0) {
      dispatch(tablaCiudad());
    }
  }, [dispatch, ciudades.data.length]);

  return (
    <Select
      name="ciudadId"
      value={value}
      onChange={onChange}
      placeholder="Seleccionar ciudad"
    >
      {ciudades.data.map((ciudad) => (
        <option key={ciudad.id} value={ciudad.id}>
          {ciudad.nombre}
        </option>
      ))}
    </Select>
  );
};

CiudadSelector.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
};

export default CiudadSelector;
