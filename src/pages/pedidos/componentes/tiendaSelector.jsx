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

  return (
    <select value={value} onChange={onChange}>
      {/* Opción por defecto */}
      <option value="">Seleccionar tienda</option>

      {/* Mapear las tiendas disponibles */}
      {tiendas.map((tienda) => (
        <option key={tienda.id} value={tienda.id}>
          {tienda.nombre}
        </option>
      ))}
    </select>
  );
};


TiendaSelector.propTypes = {
  value: PropTypes.string.isRequired,  
  onChange: PropTypes.func.isRequired, 
};

export default TiendaSelector;
