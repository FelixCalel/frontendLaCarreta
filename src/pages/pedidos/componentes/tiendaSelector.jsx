import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { tablaTienda } from "../../../store/Tienda/thunks";

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
    const fetchTiendas = async () => {
      setLoading(true);
      let tiendasFiltradas = [];

      if (ciudadId && deudorId) {
        // Filtrar tiendas por ciudad y deudor desde Redux
        dispatch(tablaTienda());
        tiendasFiltradas = tiendasRedux.filter(
          (tienda) => tienda.ciudadId === ciudadId && tienda.deudorId === deudorId
        );
      } else if (isRutaFilter && rutaIds.length > 0) {
        // Filtrar por rutas
        for (let rutaId of rutaIds) {
          const response = await axios.get(`${BASE_URL}/tienda/by-ruta/${rutaId}`);
          if (response && response.data) {
            tiendasFiltradas = tiendasFiltradas.concat(response.data);
          }
        }
      } else if (paisId) {
        // Filtrar por país
        console.log("Filtrando por paisId:", paisId);
        const response = await axios.get(`${BASE_URL}/tienda/by-pais/${paisId}`);
        if (response && response.data) {
          tiendasFiltradas = response.data;
        }
      }

      setTiendas(tiendasFiltradas);
      setLoading(false);
    };

    fetchTiendas();
  }, [ciudadId, deudorId, rutaIds, paisId, isRutaFilter, dispatch, tiendasRedux]);

  if (loading) {
    return <select disabled>Cargando tiendas...</select>;
  }

  return (
    <select
      value={value ? String(value) : ""}
      onChange={(e) => onChange(parseInt(e.target.value))}
    >
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
