import PropTypes from "prop-types";
import {
  Box,
  FormControl,
  FormLabel,
  Select,
  useColorModeValue,
} from "@chakra-ui/react";

export default function ProviderSelect({ value, onChange, placeholder }) {
  const options = [
    { id: "PRO-010", name: "Proveedor 010" },
    { id: "PRO-020", name: "Proveedor 020" },
    { id: "PRO-030", name: "Proveedor 030" },
  ];
  const ring = useColorModeValue("gray.300", "gray.600");

  return (
    <Box minW={{ base: "100%", sm: "320px" }}>
      <FormControl>
        <FormLabel fontSize="sm" opacity={0.8}>
          Proveedor
        </FormLabel>
        <Select
          value={value || ""}
          onChange={(e) => onChange(e.target.value || null)}
          borderColor={ring}
          _focus={{ borderColor: "green.400", boxShadow: "0 0 0 1px #38A169" }}
        >
          <option value="">{placeholder || "Seleccione…"}</option>
          {options.map((o) => (
            <option key={o.id} value={o.id}>
              {o.name}
            </option>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
ProviderSelect.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};
