import { Center, Checkbox, Text, useColorModeValue } from "@chakra-ui/react";
import PropTypes from "prop-types";

export const PTMQBanner = ({ isPTMQ, onToggle }) => {
  const bg = useColorModeValue("gray.100", "gray.700");
  const border = useColorModeValue("gray.300", "gray.600");
  const muted = useColorModeValue("gray.600", "gray.300");

  return (
    <Center
      border="1px dashed"
      borderColor={border}
      borderRadius="md"
      py={6}
      px={4}
      bg={bg}
    >
      <Checkbox
        isChecked={isPTMQ}
        onChange={(e) => onToggle?.(e.target.checked)}
        colorScheme="green"
        size="lg"
      >
        <Text ml={2} fontWeight="semibold">
          Producto PTMQ{" "}
          <Text as="span" fontSize="sm" color={muted}>
            (sin receta)
          </Text>
        </Text>
      </Checkbox>
    </Center>
  );
};

PTMQBanner.propTypes = {
  isPTMQ: PropTypes.bool,
  onToggle: PropTypes.func,
};
