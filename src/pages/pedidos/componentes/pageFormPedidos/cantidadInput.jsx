import PropTypes from "prop-types";
import { FormControl, Input, FormErrorMessage, HStack } from "@chakra-ui/react";

const CantidadInput = ({
  value,
  max,
  onChange,
  onBlur,
  error,
  placeholder,
  width = "60px",
}) => {
  const handleInputChange = (e) => {
    const v = e.target.value;

    if (v === "") {
      onChange({ target: { value: "" } });
      return;
    }
    if (!/^\d+$/.test(v)) return;
    const asNumber = parseFloat(v);
    if (max !== undefined && asNumber > max) return;

    onChange({ target: { value: v } });
  };

  return (
    <HStack spacing={2}>
      <FormControl isInvalid={!!error}>
        <Input
          name="cantidad"
          type="number"
          value={value === 0 ? "" : value}
          onChange={handleInputChange}
          onBlur={onBlur}
          placeholder={placeholder}
          width={width}
          size="sm"
        />
        {error && <FormErrorMessage>{error}</FormErrorMessage>}
      </FormControl>
    </HStack>
  );
};

CantidadInput.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  max: PropTypes.number,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  error: PropTypes.string,
  placeholder: PropTypes.string,
  width: PropTypes.string,
};

export default CantidadInput;
