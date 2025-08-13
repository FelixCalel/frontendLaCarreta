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
import { CalendarIcon } from "@chakra-ui/icons";

export default function QaDateFilter({ value, onChange }) {
  const ring = useColorModeValue("gray.300", "gray.600");
  return (
    <Box w="full">
      <FormControl>
        <FormLabel fontSize="sm" opacity={0.8}>
          Fecha de ingreso
        </FormLabel>
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <CalendarIcon />
          </InputLeftElement>
          <Input
            type="date"
            value={value || ""}
            onChange={(e) => onChange(e.target.value || null)}
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
QaDateFilter.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};
