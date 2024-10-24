import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

const TiendaSelector = ({ rutaIds, paisId, value, onChange, isRutaFilter }) => {
  const [tiendas, setTiendas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTiendas = async () => {
      setLoading(true);
      try {
        let tiendasFiltradas = [];
  
        if (isRutaFilter && rutaIds.length > 0) {
          // Filtrar por rutas
          for (let rutaId of rutaIds) {
            const response = await axios.get(`${BASE_URL}/tienda/by-ruta/${rutaId}`);
            if (response && response.data) {
              tiendasFiltradas = tiendasFiltradas.concat(response.data); // Añadir las tiendas a la lista
            }
          }
        } else if (!isRutaFilter && paisId) {
          console.log("Filtrando por paisId:", paisId); // Verificar valor de paisId
          // Filtrar por país
          const response = await axios.get(`${BASE_URL}/tienda/by-pais/${paisId}`);
          console.log("Respuesta de tiendas por país:", response.data); // Verificar respuesta de la API
          if (response && response.data) {
            tiendasFiltradas = response.data;
          }
        }
  
        setTiendas(tiendasFiltradas);
      } catch (error) {
        console.error("Error al obtener las tiendas:", error);
        setTiendas([]);
      } finally {
        setLoading(false);
      }
    };
  
    fetchTiendas();
  }, [rutaIds, paisId, isRutaFilter]);
  

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
  rutaIds: PropTypes.arrayOf(PropTypes.number).isRequired, // Lista de rutas del usuario
  paisId: PropTypes.number.isRequired, // Requerido para el filtro por país
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  isRutaFilter: PropTypes.bool, // Indica si el selector debe filtrar por ruta o no
};

export default TiendaSelector;
