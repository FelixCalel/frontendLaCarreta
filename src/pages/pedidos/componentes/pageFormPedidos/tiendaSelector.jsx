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
    if (tiendasRedux.length === 0) {
      dispatch(tablaTienda());
    }
  }, [dispatch, tiendasRedux.length]);

  useEffect(() => {
    const fetchTiendas = async () => {
      setLoading(true);
      let tiendasFiltradas = [];
  
      if (isRutaFilter) {
        // 1) Si es el selector "Tiendas asignadas", filtramos por ruta
        if (!rutaIds || rutaIds.length === 0) {
          // Si el usuario no tiene rutas asignadas, no hay tiendas
          setTiendas([]);
          setLoading(false);
          return;
        }
  
        // Filtra SÓLO por ruta, sin usar ciudadId ni deudorId
        tiendasFiltradas = tiendasRedux.filter((tienda) =>
          rutaIds.includes(tienda.rutaId)
        );
      } else {
        // 2) Si es el selector "Todas las tiendas"
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
  }, [
    // Dependencias mínimas:
    paisId,
    rutaIds,
    isRutaFilter,
    tiendasRedux
    // (Opcional) Remueve ciudadId/deudorId si ya NO filtras por ellos
  ]);
  
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
