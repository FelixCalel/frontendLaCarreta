import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { tablaTienda } from "../../../../store/Tienda/thunks";
import Select from "react-select";
import { chakra, useColorModeValue } from "@chakra-ui/react";

const BASE_URL = import.meta.env.VITE_API_URL;
const ChakraReactSelect = chakra(Select);

const TiendaSelector = ({
  rutaIds,
  paisId,
  value,
  onChange,
  isRutaFilter,
  isSecondSelector = false,
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
        if (!rutaIds || rutaIds.length === 0) {
          setTiendas([]);
          setLoading(false);
          return;
        }
        tiendasFiltradas = tiendasRedux.filter(
          (tienda) => rutaIds.includes(tienda.rutaId) && tienda.estaActivo
        );
      } else {
        if (paisId) {
          try {
            const response = await axios.get(
              `${BASE_URL}/tienda/by-pais/${paisId}`
            );
            if (response && response.data) {
              tiendasFiltradas = response.data.filter(
                (tienda) => tienda.estaActivo
              );
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

  const selectedOption =
    options.find((option) => option.value === value) || null;
  const placeholderColor = useColorModeValue("gray.600", "gray.200");

  const controlBg1Light = "#9ae6b4";
  const controlBg1Dark = "#2f855a";
  const menuBg1Light = "#f0fff4";
  const menuBg1Dark = "#22543d";
  const controlBg2Light = "#FEEBC8";
  const controlBg2Dark = "#7B341E";
  const menuBg2Light = "#FFF7ED";
  const menuBg2Dark = "#5F3B2F";
  const controlBg = useColorModeValue(
    isSecondSelector ? controlBg2Light : controlBg1Light,
    isSecondSelector ? controlBg2Dark : controlBg1Dark
  );
  const menuBg = useColorModeValue(
    isSecondSelector ? menuBg2Light : menuBg1Light,
    isSecondSelector ? menuBg2Dark : menuBg1Dark
  );

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
      noOptionsMessage={() => "No se encontraron tiendas"}
      loadingMessage={() => "Cargando tiendas..."}
      styles={{
        control: (base) => ({
          ...base,
          backgroundColor: `${controlBg} !important`,
        }),
        valueContainer: (base) => ({
          ...base,
          backgroundColor: "transparent !important",
        }),
        input: (base) => ({
          ...base,
          backgroundColor: "transparent !important",
        }),
        menu: (base) => ({
          ...base,
          backgroundColor: `${menuBg} !important`,
        }),
        option: (base, state) => ({
          ...base,
          backgroundColor: state.isFocused
            ? "rgba(255, 255, 255, 0.2)"
            : "transparent",
          color: "inherit",
        }),
        placeholder: (base) => ({
          ...base,
          color: placeholderColor,
        }),
      }}
    />
  );
};

TiendaSelector.propTypes = {
  rutaIds: PropTypes.arrayOf(PropTypes.number),
  paisId: PropTypes.number.isRequired,
  value: PropTypes.number,
  onChange: PropTypes.func.isRequired,
  isRutaFilter: PropTypes.bool,
  isSecondSelector: PropTypes.bool,
};

export default TiendaSelector;
