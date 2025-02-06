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

// Dentro del useEffect en TiendaSelector
useEffect(() => {
  const fetchTiendas = async () => {
    setLoading(true);
    let tiendasFiltradas = [];

    if (isRutaFilter) {
      if (!rutaIds || rutaIds.length === 0) {
        setTiendas([]);
        setLoading(false);
        return;
      }

      tiendasFiltradas = tiendasRedux.filter((tienda) => 
        rutaIds.includes(tienda.rutaId) && tienda.estaActivo // Cambiado a estaActivo
      );
    } else {
      if (paisId) {
        try {
          const response = await axios.get(`${BASE_URL}/tienda/by-pais/${paisId}`);
          if (response && response.data) {
            tiendasFiltradas = response.data.filter(tienda => tienda.estaActivo); // Cambiado a estaActivo
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
}, [paisId, rutaIds, isRutaFilter, tiendasRedux]);
  
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
  rutaIds: PropTypes.arrayOf(PropTypes.number),
  paisId: PropTypes.number.isRequired,
  value: PropTypes.number,
  onChange: PropTypes.func.isRequired,
  isRutaFilter: PropTypes.bool,
};

export default TiendaSelector;
