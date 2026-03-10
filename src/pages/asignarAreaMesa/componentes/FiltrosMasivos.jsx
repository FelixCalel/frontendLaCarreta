import PropTypes from "prop-types";
import { Box, Flex, Select, Button } from "@chakra-ui/react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useToast } from "@chakra-ui/react";
import {
  bulkAsignarThunk,
  bulkDesasignarThunk,
  fetchAsignacionesThunk,
} from "../../../store/asignacionAM/thunks";

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
  const [selectedFilters, setSelectedFilters] = useState({
    empaque: null,
    marca: null,
    tipo: null,
    grupo: null,
    subgrupo: null,
  });

  const handleFilterChange = (key, value) => {
    setSelectedFilters((prev) => ({ ...prev, [key]: value }));
  };

  const classificationOptions = (key) => {
    const list = clasificaciones[key] || [];
    return list.map((item) => ({ value: item, label: item }));
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
        setSelectedFilters({
          empaque: null,
          marca: null,
          tipo: null,
          grupo: null,
          subgrupo: null,
        });
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
      <Box flex="1" minW="150px">
        <Select
          placeholder="Empaque"
          value={selectedFilters.empaque}
          onChange={(val) => handleFilterChange("empaque", val)}
          options={classificationOptions("empaques")}
          isClearable
          styles={customSelectStyles}
        />
      </Box>
      <Box flex="1" minW="150px">
        <Select
          placeholder="Marca"
          value={selectedFilters.marca}
          onChange={(val) => handleFilterChange("marca", val)}
          options={classificationOptions("marcas")}
          isClearable
          styles={customSelectStyles}
        />
      </Box>
      <Box flex="1" minW="150px">
        <Select
          placeholder="Tipo"
          value={selectedFilters.tipo}
          onChange={(val) => handleFilterChange("tipo", val)}
          options={classificationOptions("tipos")}
          isClearable
          styles={customSelectStyles}
        />
      </Box>
      <Box flex="1" minW="150px">
        <Select
          placeholder="Grupo"
          value={selectedFilters.grupo}
          onChange={(val) => handleFilterChange("grupo", val)}
          options={classificationOptions("grupos")}
          isClearable
          styles={customSelectStyles}
        />
      </Box>
      <Box flex="1" minW="150px">
        <Select
          placeholder="Subgrupo"
          value={selectedFilters.subgrupo}
          onChange={(val) => handleFilterChange("subgrupo", val)}
          options={classificationOptions("subgrupos")}
          isClearable
          styles={customSelectStyles}
        />
      </Box>
      <Flex gap={2}>
        <Button
          colorScheme="red"
          variant="outline"
          onClick={() => executeBulkAction(bulkDesasignarThunk, "Quitado masivo completado")}
          isLoading={isBulkLoading}
          loadingText="..."
          size="sm"
          boxShadow="sm"
        >
          Quitar
        </Button>
        <Button
          colorScheme="orange"
          onClick={() => executeBulkAction(bulkAsignarThunk, "Asignación masiva completada")}
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
