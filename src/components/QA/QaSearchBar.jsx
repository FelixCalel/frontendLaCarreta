import PropTypes from "prop-types";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  useColorModeValue,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";

export default function QaSearchBar({ value, onChange }) {
  const ring = useColorModeValue("gray.300", "gray.600");
  return (
    <Box w="full">
      <FormControl>
        <FormLabel fontSize="sm" opacity={0.8}>
          Búsqueda rápida
        </FormLabel>
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <SearchIcon />
          </InputLeftElement>
          <Input
            placeholder="Tienda, país, trazabilidad, proveedor…"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            pl="42px"
            borderColor={ring}
            _focus={{
              borderColor: "green.400",
              boxShadow: "0 0 0 1px #38A169",
            }}
          />
        </InputGroup>
      </FormControl>
    </Box>
  );
}
QaSearchBar.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};
