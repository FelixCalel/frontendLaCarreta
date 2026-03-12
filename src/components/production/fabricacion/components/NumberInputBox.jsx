import PropTypes from "prop-types";
import { Box, Input, Text } from "@chakra-ui/react";

export const NumberInputBox = ({
  value,
  onChange,
  label,
  bg,
  color,
  fontWeight,
}) => (
  <Box>
    <Input
      size="xs"
      w="60px"
      textAlign="center"
      type="number"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      bg={bg}
      color={color || "inherit"}
      fontWeight={fontWeight || "normal"}
    />
    <Text
      fontSize="2xs"
      color="gray.400"
      textTransform="uppercase"
      mt={0.5}
    >
      {label}
    </Text>
  </Box>
);

NumberInputBox.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  bg: PropTypes.string.isRequired,
  color: PropTypes.string,
  fontWeight: PropTypes.string,
};

