import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { tablaTienda } from "../../../../store/Tienda/thunks";

const BASE_URL = import.meta.env.VITE_API_URL;

const TiendaSelector = ({
  ciudadId,
  deudorId,
  rutaIds,
  paisId,
  value,
  onChange,
  isRutaFilter,
}) => {
  const dispatch = useDispatch();
  const [tiendas, setTiendas] = useState([]);
  const [loading, setLoading] = useState(true);
  const tiendasRedux = useSelector((state) => state.tiendas.data);

  useEffect(() => {
    dispatch(tablaTienda());
  }, [dispatch]);

  useEffect(() => {
    const fetchTiendas = async () => {
      setLoading(true);
      let tiendasFiltradas = [];

      // Verifica si el usuario tiene rutas asignadas
      if (isRutaFilter && rutaIds.length === 0) {
        // Si no tiene rutas asignadas, no mostramos ninguna tienda
        setTiendas([]);
        setLoading(false);
        return;
      }

      if (!isRutaFilter) {
        // Si no hay filtro por ruta, mostramos todas las tiendas disponibles
        if (paisId) {
          const response = await axios.get(`${BASE_URL}/tienda/by-pais/${paisId}`);
          if (response && response.data) {
            tiendasFiltradas = response.data;
          }
        }
      } else {
        // Filtramos las tiendas según las rutas asignadas al usuario, ciudad y deudor
        if (ciudadId && deudorId) {
          tiendasFiltradas = tiendasRedux.filter(
            (tienda) =>
              tienda.ciudadId === ciudadId &&
              tienda.deudorId === deudorId &&
              (rutaIds.length === 0 || rutaIds.includes(tienda.rutaId))
          );
        }
      }

      setTiendas(tiendasFiltradas);
      setLoading(false);
    };

    fetchTiendas();
  }, [ciudadId, deudorId, rutaIds, paisId, isRutaFilter, tiendasRedux]);

  if (loading) {
    return <select disabled>Cargando tiendas...</select>;
  }

  return (
    <select value={value ? String(value) : ""} onChange={(e) => onChange(parseInt(e.target.value))}>
      <option value="">Seleccionar tienda</option>
      {tiendas.length > 0 ? (
        tiendas.map((tienda) => (
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
  ciudadId: PropTypes.number,
  deudorId: PropTypes.number,
  rutaIds: PropTypes.arrayOf(PropTypes.number),
  paisId: PropTypes.number.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  isRutaFilter: PropTypes.bool,
};

export default TiendaSelector;
