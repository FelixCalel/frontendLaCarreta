import { useEffect } from "react";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import { tablaTienda } from "../../../store/Tienda/thunks";

const TiendaSelector = ({ ciudadId, deudorId, value, onChange }) => {
  const dispatch = useDispatch();
  const tiendas = useSelector((state) => state.tiendas.data);

  useEffect(() => {
    dispatch(tablaTienda());
  }, [dispatch]);

  // Filtrar tiendas por ciudad y deudor
  const tiendasFiltradas = tiendas.filter(
    (tienda) => tienda.ciudadId === ciudadId && tienda.deudorId === deudorId
  );

  return (
    <select
      value={value || ""}
      onChange={(e) => onChange(parseInt(e.target.value))}
    >
      <option value="">Seleccionar tienda</option>
      {tiendasFiltradas.map((tienda) => (
        <option key={tienda.id} value={tienda.id}>
          {tienda.nombre}
        </option>
      ))}
    </select>
  );
};

TiendaSelector.propTypes = {
  ciudadId: PropTypes.number.isRequired,
  deudorId: PropTypes.number.isRequired,
  value: PropTypes.number,
  onChange: PropTypes.func.isRequired,
};

export default TiendaSelector;
