import PropTypes from "prop-types";
import { Box, Flex, Button, useToast } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import Select, { components } from "react-select";
import { useDispatch } from "react-redux";
import {
  bulkAsignarThunk,
  bulkDesasignarThunk,
  fetchAsignacionesThunk,
} from "../../../store/asignacionAM/thunks";

const PAGE_SIZE = 50;
const FILTER_ORDER = ["empaque", "marca", "tipo", "grupo", "subgrupo"];
const EMPTY_FILTERS = {
  empaque: null,
  marca: null,
  tipo: null,
  grupo: null,
  subgrupo: null,
};
const EMPTY_SEARCH_TERMS = {
  empaque: "",
  marca: "",
  tipo: "",
  grupo: "",
  subgrupo: "",
};
const EMPTY_VISIBLE_COUNTS = {
  empaque: PAGE_SIZE,
  marca: PAGE_SIZE,
  tipo: PAGE_SIZE,
  grupo: PAGE_SIZE,
  subgrupo: PAGE_SIZE,
};
const FILTER_CONFIG = [
  { key: "empaque", sourceKey: "empaques", placeholder: "Empaque" },
  { key: "marca", sourceKey: "marcas", placeholder: "Marca" },
  { key: "tipo", sourceKey: "tipos", placeholder: "Tipo" },
  { key: "grupo", sourceKey: "grupos", placeholder: "Grupo" },
  { key: "subgrupo", sourceKey: "subgrupos", placeholder: "Subgrupo" },
];

// Fuera del componente para no crear una nueva referencia en cada render
const CustomSingleValue = ({ data, children, ...rest }) => (
  <components.SingleValue data={data} {...rest}>
    <span
      title={data?.label ?? ""}
      style={{
        display: "block",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  </components.SingleValue>
);

CustomSingleValue.propTypes = {
  data: PropTypes.shape({ label: PropTypes.string }),
  children: PropTypes.node,
};

export const FiltrosMasivos = ({
  areaId,
  usuarioId,
  clasificaciones,
  customSelectStyles,
  listBg,
  borderColor,
}) => {
  const dispatch = useDispatch();
  const toast = useToast();
  const [isBulkLoading, setIsBulkLoading] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState(EMPTY_FILTERS);

  // Estilos que sobreescriben singleValue para maximizar el texto visible
  const mergedStyles = useMemo(
    () => ({
      ...customSelectStyles,
      singleValue: (base, state) => ({
        ...(customSelectStyles?.singleValue
          ? customSelectStyles.singleValue(base, state)
          : base),
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      }),
      valueContainer: (base, state) => ({
        ...(customSelectStyles?.valueContainer
          ? customSelectStyles.valueContainer(base, state)
          : base),
        flexWrap: "nowrap",
        overflow: "hidden",
      }),
    }),
    [customSelectStyles],
  );

  const [searchTerms, setSearchTerms] = useState(EMPTY_SEARCH_TERMS);
  const [visibleCounts, setVisibleCounts] = useState(EMPTY_VISIBLE_COUNTS);

  const handleFilterChange = (key, value) => {
    const changedIndex = FILTER_ORDER.indexOf(key);

    setSelectedFilters((prev) => {
      const next = { ...prev, [key]: value };

      for (let i = changedIndex + 1; i < FILTER_ORDER.length; i += 1) {
        next[FILTER_ORDER[i]] = null;
      }

      return next;
    });
  };

  const allOptions = useMemo(() => {
    const mapOptions = (sourceKey) => {
      const list = Array.isArray(clasificaciones?.[sourceKey])
        ? clasificaciones[sourceKey]
        : [];
      return list
        .filter(
          (item) =>
            item !== null && item !== undefined && String(item).trim() !== "",
        )
        .map((item) => ({ value: String(item), label: String(item) }));
    };

    return {
      empaque: mapOptions("empaques"),
      marca: mapOptions("marcas"),
      tipo: mapOptions("tipos"),
      grupo: mapOptions("grupos"),
      subgrupo: mapOptions("subgrupos"),
    };
  }, [clasificaciones]);

  const getVisibleOptions = (key) => {
    const term = (searchTerms[key] || "").trim().toLowerCase();
    const source = allOptions[key] || [];

    const filtered = term
      ? source.filter((opt) => opt.label.toLowerCase().includes(term))
      : source;

    return filtered.slice(0, visibleCounts[key] || PAGE_SIZE);
  };

  const handleInputChange = (key, value, actionMeta) => {
    if (actionMeta?.action === "input-change") {
      setSearchTerms((prev) => ({ ...prev, [key]: value || "" }));
      setVisibleCounts((prev) => ({ ...prev, [key]: PAGE_SIZE }));
    }

    return value;
  };

  const handleMenuScrollToBottom = (key) => {
    setVisibleCounts((prev) => ({
      ...prev,
      [key]: (prev[key] || PAGE_SIZE) + PAGE_SIZE,
    }));
  };

  const executeBulkAction = (actionThunk, successTitle) => {
    const activeFilters = Object.entries(selectedFilters).reduce(
      (acc, [key, val]) => {
        if (val) acc[key] = val.value;
        return acc;
      },
      {},
    );

    if (Object.keys(activeFilters).length === 0) {
      toast({
        title: "Seleccione un filtro",
        description: "Debe seleccionar al menos una clasificación.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsBulkLoading(true);
    const payload =
      actionThunk === bulkAsignarThunk
        ? { id_area: areaId, create_by: usuarioId || 0, ...activeFilters }
        : { id_area: areaId, update_by: usuarioId || 0, ...activeFilters };

    dispatch(actionThunk(payload)).then((res) => {
      setIsBulkLoading(false);
      if (res.meta.requestStatus === "fulfilled") {
        toast({
          title: successTitle,
          description: res.payload.message,
          status: actionThunk === bulkAsignarThunk ? "success" : "info",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
        setSelectedFilters(EMPTY_FILTERS);
        setSearchTerms(EMPTY_SEARCH_TERMS);
        setVisibleCounts(EMPTY_VISIBLE_COUNTS);
        dispatch(fetchAsignacionesThunk(areaId));
      }
    });
  };

  return (
    <Flex
      gap={2}
      wrap="wrap"
      p={2}
      borderWidth={1}
      borderColor={borderColor}
      borderRadius="lg"
      bg={listBg}
      align="center"
      justify="center"
    >
      {FILTER_CONFIG.map(({ key, placeholder }) => (
        <Box key={key} flex="1" minW="140px">
          <Select
            placeholder={placeholder}
            value={selectedFilters[key]}
            onChange={(val) => handleFilterChange(key, val)}
            options={getVisibleOptions(key)}
            onInputChange={(value, meta) => handleInputChange(key, value, meta)}
            onMenuScrollToBottom={() => handleMenuScrollToBottom(key)}
            isSearchable
            isClearable
            styles={mergedStyles}
            components={{ SingleValue: CustomSingleValue }}
          />
        </Box>
      ))}
      <Flex gap={2}>
        <Button
          colorScheme="red"
          variant="outline"
          onClick={() =>
            executeBulkAction(bulkDesasignarThunk, "Quitado masivo completado")
          }
          isLoading={isBulkLoading}
          loadingText="..."
          size="sm"
          boxShadow="sm"
        >
          Quitar
        </Button>
        <Button
          colorScheme="orange"
          onClick={() =>
            executeBulkAction(bulkAsignarThunk, "Asignación masiva completada")
          }
          isLoading={isBulkLoading}
          loadingText="..."
          size="sm"
          boxShadow="sm"
        >
          Asignar
        </Button>
      </Flex>
    </Flex>
  );
};

FiltrosMasivos.propTypes = {
  areaId: PropTypes.number.isRequired,
  usuarioId: PropTypes.number.isRequired,
  clasificaciones: PropTypes.object.isRequired,
  customSelectStyles: PropTypes.object.isRequired,
  listBg: PropTypes.string.isRequired,
  borderColor: PropTypes.string.isRequired,
};
