import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { tablaTienda } from "../../../../store/Tienda/thunks";
import Select from "react-select";
import { chakra } from "@chakra-ui/react";

const BASE_URL = import.meta.env.VITE_API_URL;

const ChakraReactSelect = chakra(Select);

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

  // Cargar tiendas desde Redux solo una vez al montar
  useEffect(() => {
    if (tiendasRedux.length === 0) {
      dispatch(tablaTienda());
    }
  }, [dispatch, tiendasRedux.length]);

  // Filtrar tiendas según los criterios
  useEffect(() => {
    const fetchTiendas = async () => {
      if (!isRutaFilter && paisId && tiendas.length > 0) {
        return; // No refrescar si las tiendas ya están cargadas y el filtro no aplica
      }

      setLoading(true);
      let tiendasFiltradas = [];

      if (isRutaFilter) {
        // Si no hay rutas asignadas, no mostrar tiendas
        if (rutaIds.length === 0) {
          setTiendas([]); // Usuario sin rutas, vaciar lista
          setLoading(false);
          return;
        }

        // Filtrar usando los datos de Redux
        tiendasFiltradas = tiendasRedux.filter((tienda) => {
          const ciudadMatch = ciudadId ? tienda.ciudadId === ciudadId : true;
          const deudorMatch = deudorId ? tienda.deudorId === deudorId : true;
          const rutaMatch = rutaIds.includes(tienda.rutaId);

          return ciudadMatch && deudorMatch && rutaMatch;
        });
      } else {
        // Cargar tiendas por país desde la API si no se filtra por rutas
        if (paisId) {
          try {
            const response = await axios.get(`${BASE_URL}/tienda/by-pais/${paisId}`);
            if (response && response.data) {
              tiendasFiltradas = response.data;
            }
          } catch (error) {
            console.error("Error al cargar tiendas por país:", error);
          }
        }
      }

      setTiendas(tiendasFiltradas);
      setLoading(false);
    };

    fetchTiendas();
  }, [ciudadId, deudorId, rutaIds, paisId, isRutaFilter, tiendasRedux]);

  const options = tiendas.map((tienda) => ({
    value: tienda.id,
    label: tienda.nombre,
  }));

  const selectedOption = options.find((option) => option.value === value) || null;

  return (
    <ChakraReactSelect
      placeholder={loading ? "Cargando tiendas..." : "Seleccionar tienda"}
      isLoading={loading}
      options={options}
      value={selectedOption}
      onChange={(selected) => onChange(selected ? selected.value : null)}
      isClearable
      menuPlacement="auto"
      menuPosition="fixed"
      chakraStyles={{
        container: (provided) => ({
          ...provided,
          width: "100%",
        }),
        control: (provided) => ({
          ...provided,
          borderColor: "gray.300",
          _hover: { borderColor: "gray.400" },
        }),
      }}
      noOptionsMessage={() => "No se encontraron tiendas"}
      loadingMessage={() => "Cargando tiendas..."}
    />
  );
};

TiendaSelector.propTypes = {
  ciudadId: PropTypes.number,
  deudorId: PropTypes.number,
  rutaIds: PropTypes.arrayOf(PropTypes.number),
  paisId: PropTypes.number.isRequired,
  value: PropTypes.number,
  onChange: PropTypes.func.isRequired,
  isRutaFilter: PropTypes.bool,
};

export default TiendaSelector;
