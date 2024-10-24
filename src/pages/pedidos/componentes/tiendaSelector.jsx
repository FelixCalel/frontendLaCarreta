import { useEffect } from "react";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import { tablaTienda } from "../../../store/Tienda/thunks";

const TiendaSelector = ({ rutaId, paisId, value, onChange }) => {
  const dispatch = useDispatch();
  const tiendas = useSelector((state) => state.tiendas.data);

  useEffect(() => {
    dispatch(tablaTienda());
  }, [dispatch]);

  // Log para verificar qué tiendas se están obteniendo
  useEffect(() => {
    console.log("Tiendas obtenidas:", tiendas);
  }, [tiendas]);

  // Log para verificar rutaId y paisId
  useEffect(() => {
    console.log("Filtrando tiendas con rutaId:", rutaId, "y paisId:", paisId);
  }, [rutaId, paisId]);

  // Filtrar tiendas por ruta y país
  const tiendasFiltradas = tiendas.filter(tienda => {
    const matchesRuta = rutaId ? tienda.rutaId === rutaId : true; // Si rutaId es 0, incluye todas las tiendas
    const matchesPais = tienda.paisId === paisId; // Filtra por país
    return matchesRuta && matchesPais; // Retorna solo tiendas que coincidan
  });

  // Log para verificar las tiendas filtradas
  useEffect(() => {
    console.log("Tiendas filtradas:", tiendasFiltradas);
  }, [tiendasFiltradas]);

  return (
    <select
      value={value || ""}
      onChange={(e) => onChange(parseInt(e.target.value))}
    >
      <option value="">Seleccionar tienda</option>
      {tiendasFiltradas.length > 0 ? (
        tiendasFiltradas.map((tienda) => (
          <option key={tienda.id} value={tienda.id}>
            {tienda.nombre}
          </option>
        ))
      ) : (
        <option value="">No hay tiendas disponibles</option>
      )}
    </select>
  );
};

TiendaSelector.propTypes = {
  rutaId: PropTypes.number.isRequired, // Debe ser requerido para filtrar
  paisId: PropTypes.number.isRequired, // Añadir paisId para filtrar por país
  value: PropTypes.number,
  onChange: PropTypes.func.isRequired,
};

export default TiendaSelector;
