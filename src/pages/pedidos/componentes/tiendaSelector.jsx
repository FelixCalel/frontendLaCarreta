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
  const [tiendas, setTiendas] = useState([]); // Estado para las tiendas filtradas
  const [loading, setLoading] = useState(true); // Estado para la carga
  const tiendasRedux = useSelector((state) => state.tiendas.data); // Tiendas del estado de Redux

  // Cargar tiendas desde Redux
  useEffect(() => {
    dispatch(tablaTienda()); // Cargar tiendas si aún no se han cargado
  }, [dispatch]);

  // Lógica para filtrar las tiendas
  useEffect(() => {
    const fetchTiendas = async () => {
      setLoading(true); // Mostrar estado de carga
      let tiendasFiltradas = [];

      // Filtrar por ciudad y deudor si ambos están presentes
      if (ciudadId && deudorId) {
        tiendasFiltradas = tiendasRedux.filter(
          (tienda) => tienda.ciudadId === ciudadId && tienda.deudorId === deudorId
        );
      } 
      // Filtrar por rutas si se proporciona el filtro de rutas
      else if (isRutaFilter && rutaIds.length > 0) {
        for (let rutaId of rutaIds) {
          const response = await axios.get(`${BASE_URL}/tienda/by-ruta/${rutaId}`);
          if (response && response.data) {
            tiendasFiltradas = tiendasFiltradas.concat(response.data);
          }
        }
      } 
      // Filtrar por país si se proporciona el país
      else if (paisId) {
        const response = await axios.get(`${BASE_URL}/tienda/by-pais/${paisId}`);
        if (response && response.data) {
          tiendasFiltradas = response.data;
        }
      }

      setTiendas(tiendasFiltradas);
      setLoading(false); // Desactivar estado de carga
    };

    fetchTiendas();
  }, [ciudadId, deudorId, rutaIds, paisId, isRutaFilter, tiendasRedux]);

  // Mostrar un mensaje de carga mientras las tiendas se están obteniendo
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
  ciudadId: PropTypes.number, // Filtrar por ciudad si está presente
  deudorId: PropTypes.number, // Filtrar por deudor si está presente
  rutaIds: PropTypes.arrayOf(PropTypes.number), // Lista de rutas
  paisId: PropTypes.number.isRequired, // ID del país es obligatorio
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  isRutaFilter: PropTypes.bool, // Indica si debe filtrar por ruta
};

export default TiendaSelector;
