import { useEffect } from "react";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import { tablaTienda } from "../../../store/Tienda/thunks";

const TiendaSelector = ({ value, onChange }) => {
  const dispatch = useDispatch();
  const tiendas = useSelector((state) => state.tiendas.data);

  useEffect(() => {
    dispatch(tablaTienda());
  }, [dispatch]);

  const handleSelectChange = (e) => {
    const selectedValue = e.target.value ? parseInt(e.target.value, 10) : ""; // Convertir a número solo si existe un valor
    onChange(selectedValue);
  };

  return (
    <select value={value || ""} onChange={handleSelectChange}>
      <option value="">Seleccionar tienda</option>
      {tiendas.map((tienda) => (
        <option key={tienda.id} value={tienda.id}>
          {tienda.nombre}
        </option>
      ))}
    </select>
  );
};

TiendaSelector.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), // Aceptar string o número
  onChange: PropTypes.func.isRequired,
};

export default TiendaSelector;
