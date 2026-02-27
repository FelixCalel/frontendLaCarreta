import { Flex, Select, Box, useColorModeValue } from "@chakra-ui/react";
import PropTypes from "prop-types";

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
  deudores = [],
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
};
