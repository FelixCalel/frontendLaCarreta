import { Flex, Select, Box, Input, useColorModeValue } from "@chakra-ui/react";
import PropTypes from "prop-types";

const EMPTY_ARRAY = [];
export const FilterPanel = ({
  countryFilter = "",
  onCountryChange,
  clientFilter = "",
  onClientChange,
  stateFilter = "",
  onStateChange,
  countries,
  clients,
  deuFilter = "",
  onDeuChange,
  deudores = EMPTY_ARRAY,
  dateMode = "all",
  onDateModeChange,
  dateFilter = "",
  onDateFilterChange,
}) => {
  const fieldBg = useColorModeValue("white", "gray.700");
  const fieldBorder = useColorModeValue("gray.300", "gray.600");
  const fieldText = useColorModeValue("gray.800", "gray.100");
  const placeholder = useColorModeValue("gray.400", "gray.400");

  const commonProps = {
    bg: fieldBg,
    color: fieldText,
    borderColor: fieldBorder,
    _placeholder: { color: placeholder },
    _hover: { borderColor: fieldBorder },
    _focus: { borderColor: "green.400", boxShadow: "0 0 0 1px #38A169" },
    size: "sm",
    borderRadius: "md",
  };

  return (
    <Flex wrap="wrap" gap={2} mb={2} align="center" justify="center" w="100%">
      <Box>
        <Select
          {...commonProps}
          placeholder="País"
          maxW="140px"
          value={countryFilter}
          onChange={(e) => onCountryChange(e.target.value)}
        >
          {countries.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Select>
      </Box>

      <Box>
        <Select
          {...commonProps}
          placeholder="Cliente"
          maxW="180px"
          value={clientFilter}
          onChange={(e) => onClientChange(e.target.value)}
        >
          {clients.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Select>
      </Box>

      <Box>
        <Select
          {...commonProps}
          placeholder="DEU"
          maxW="110px"
          value={deuFilter}
          onChange={(e) => onDeuChange(e.target.value)}
        >
          {deudores.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </Select>
      </Box>

      {/* <Box>
        <Select
          {...commonProps}
          maxW="170px"
          value={dateMode}
          onChange={(e) => onDateModeChange?.(e.target.value)}
        >
          <option value="today">Fecha: Hoy</option>
          <option value="all">Fecha: Todas</option>
          <option value="custom">Fecha: Personalizada</option>
        </Select>
      </Box> */}

      {dateMode === "custom" && (
        <Box>
          <Input
            type="date"
            {...commonProps}
            maxW="170px"
            value={dateFilter}
            onChange={(e) => onDateFilterChange?.(e.target.value)}
          />
        </Box>
      )}

      <Box>
        <Select
          {...commonProps}
          placeholder="Estado del pedido"
          maxW="180px"
          value={stateFilter}
          onChange={(e) => onStateChange(e.target.value)}
        >
          <option value="En Proceso">En Proceso</option>
          <option value="Completado">Completado</option>
          <option value="Pendiente">Pendiente</option>
        </Select>
      </Box>
    </Flex>
  );
};

FilterPanel.propTypes = {
  countryFilter: PropTypes.string,
  onCountryChange: PropTypes.func.isRequired,
  clientFilter: PropTypes.string,
  onClientChange: PropTypes.func.isRequired,
  stateFilter: PropTypes.string,
  onStateChange: PropTypes.func.isRequired,
  countries: PropTypes.arrayOf(PropTypes.string).isRequired,
  clients: PropTypes.arrayOf(PropTypes.string).isRequired,
  deuFilter: PropTypes.string,
  onDeuChange: PropTypes.func,
  deudores: PropTypes.arrayOf(PropTypes.string),
  dateMode: PropTypes.oneOf(["today", "all", "custom"]),
  onDateModeChange: PropTypes.func,
  dateFilter: PropTypes.string,
  onDateFilterChange: PropTypes.func,
};
