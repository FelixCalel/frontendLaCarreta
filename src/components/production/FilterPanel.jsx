import PropTypes from "prop-types";
import {
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Box,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";

export const FilterPanel = ({
  itemFilter,
  onItemChange,
  countryFilter,
  onCountryChange,
  clientFilter,
  onClientChange,
  stateFilter,
  onStateChange,
  countries,
  clients,
}) => (
  <Flex wrap="wrap" gap={4} mb={2} align="center" justify="center" w="100%">
    <Box>
      <InputGroup maxW="240px">
        <InputLeftElement pointerEvents="none">
          <SearchIcon color="gray.300" />
        </InputLeftElement>
        <Input
          placeholder="Buscar ITEM"
          value={itemFilter}
          onChange={(e) => onItemChange(e.target.value)}
        />
      </InputGroup>
    </Box>

    <Box>
      <Select
        placeholder="País"
        maxW="160px"
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
        placeholder="Cliente"
        maxW="200px"
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
        placeholder="Estado del pedido"
        maxW="200px"
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

FilterPanel.propTypes = {
  itemFilter: PropTypes.string.isRequired,
  onItemChange: PropTypes.func.isRequired,
  countryFilter: PropTypes.string,
  onCountryChange: PropTypes.func.isRequired,
  clientFilter: PropTypes.string,
  onClientChange: PropTypes.func.isRequired,
  stateFilter: PropTypes.string,
  onStateChange: PropTypes.func.isRequired,
  countries: PropTypes.arrayOf(PropTypes.string).isRequired,
  clients: PropTypes.arrayOf(PropTypes.string).isRequired,
};

FilterPanel.defaultProps = {
  countryFilter: "",
  clientFilter: "",
  stateFilter: "",
};
