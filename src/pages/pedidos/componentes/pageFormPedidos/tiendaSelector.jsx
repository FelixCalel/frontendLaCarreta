import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { tablaTienda } from "../../../../store/Tienda/thunks";
import { Combobox, ComboboxInput, ComboboxPopover, ComboboxList, ComboboxOption } from "@chakra-ui/react";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTiendas, setFilteredTiendas] = useState([]);

  useEffect(() => {
    dispatch(tablaTienda());
  }, [dispatch]);

  useEffect(() => {
    const fetchTiendas = async () => {
      setLoading(true);
      let tiendasFiltradas = [];
  
      if (!isRutaFilter) {
        if (paisId) {
          const response = await axios.get(`${BASE_URL}/tienda/by-pais/${paisId}`);
          if (response && response.data) {
            tiendasFiltradas = response.data;
          }
        }
      } else {
        if (ciudadId && deudorId) {
          tiendasFiltradas = tiendasRedux.filter(
            (tienda) =>
              tienda.ciudadId === ciudadId &&
              tienda.deudorId === deudorId &&
              (rutaIds.length === 0 || rutaIds.includes(tienda.rutaId))
          );
        }
      }
  
      // Solo actualiza si hay un cambio en las tiendas
      setTiendas((prevTiendas) => {
        if (JSON.stringify(prevTiendas) !== JSON.stringify(tiendasFiltradas)) {
          setFilteredTiendas(tiendasFiltradas);
          return tiendasFiltradas;
        }
        return prevTiendas;
      });
  
      setLoading(false);
    };
  
    fetchTiendas();
  }, [ciudadId, deudorId, rutaIds, paisId, isRutaFilter, tiendasRedux]);

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredTiendas(
      tiendas.filter((tienda) =>
        tienda.nombre.toLowerCase().includes(term)
      )
    );
  };

  if (loading) {
    return <Combobox disabled><ComboboxInput placeholder="Cargando tiendas..." /></Combobox>;
  }

  return (
    <Combobox value={value ? String(value) : ""} onChange={(val) => onChange(parseInt(val))}>
      <ComboboxInput
        placeholder="Seleccionar tienda"
        value={searchTerm}
        onChange={handleSearch}
      />
      <ComboboxPopover>
        <ComboboxList>
          {filteredTiendas.length > 0 ? (
            filteredTiendas.map((tienda) => (
              <ComboboxOption
                key={tienda.id}
                value={String(tienda.id)}
              >
                {tienda.nombre}
              </ComboboxOption>
            ))
          ) : (
            <ComboboxOption value="">No hay tiendas disponibles</ComboboxOption>
          )}
        </ComboboxList>
      </ComboboxPopover>
    </Combobox>
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
