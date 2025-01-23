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
      // Evitar recargar si ya hay tiendas cargadas y no han cambiado las dependencias
      if (!isRutaFilter && paisId && tiendas.length > 0) {
        return;
      }

      setLoading(true); // Activar el estado de carga
      let tiendasFiltradas = [];

      if (!isRutaFilter) {
        // Cargar tiendas por país desde la API
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
      } else {
        // Filtrar usando los datos de Redux
        tiendasFiltradas = tiendasRedux.filter((tienda) => {
          const ciudadMatch = ciudadId ? tienda.ciudadId === ciudadId : true;
          const deudorMatch = deudorId ? tienda.deudorId === deudorId : true;
          const rutaMatch =
            rutaIds.length === 0 || rutaIds.includes(tienda.rutaId);

          return ciudadMatch && deudorMatch && rutaMatch;
        });
      }

      setTiendas(tiendasFiltradas);
      setLoading(false);
    };

    fetchTiendas();
  }, [ciudadId, deudorId, rutaIds, paisId, isRutaFilter]);

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
