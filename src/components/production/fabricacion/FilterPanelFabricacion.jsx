import PropTypes from "prop-types";
import {
  Flex,
  InputGroup,
  InputLeftElement,
  Input,
  Select,
  useColorModeValue,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";

const FilterPanelFabricacion = ({
  term,
  onTermChange,
  estado,
  onEstadoChange,
}) => {
  const bg = useColorModeValue("white", "gray.700");
  const border = useColorModeValue("gray.300", "gray.600");
  const placeholder = useColorModeValue("gray.400", "gray.400");

  const common = {
    bg,
    borderColor: border,
    _hover: { borderColor: border },
    _focus: { borderColor: "green.400", boxShadow: "0 0 0 1px #38A169" },
    _placeholder: { color: placeholder },
  };

  return (
    <Flex wrap="wrap" gap={4} mb={4} align="center">
      <InputGroup maxW="240px">
        <InputLeftElement pointerEvents="none">
          <SearchIcon color="gray.300" />
        </InputLeftElement>
        <Input
          {...common}
          placeholder="ITEM"
          value={term}
          onChange={(e) => onTermChange(e.target.value)}
        />
      </InputGroup>

      <Select
        {...common}
        placeholder="Estado del pedido"
        value={estado}
        onChange={(e) => onEstadoChange(e.target.value)}
        maxW="200px"
      >
        <option value="Pendiente">Pendiente</option>
        <option value="En Proceso">En Proceso</option>
        <option value="Completado">Completado</option>
      </Select>

      {/* <Select
        {...common}
        placeholder="Filtrar por Mesa"
        value={mesa}
        onChange={(e) => onMesaChange(e.target.value)}
        maxW="200px"
      >
        <option value="A">Mesa A</option>
        <option value="B">Mesa B</option>
        <option value="C">Mesa C</option>
      </Select> */}
    </Flex>
  );
};

FilterPanelFabricacion.propTypes = {
  term: PropTypes.string.isRequired,
  onTermChange: PropTypes.func.isRequired,
  estado: PropTypes.string.isRequired,
  onEstadoChange: PropTypes.func.isRequired,
  mesa: PropTypes.string.isRequired,
  onMesaChange: PropTypes.func.isRequired,
};

export default FilterPanelFabricacion;
