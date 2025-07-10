// components/ActionButtons.tsx
import PropTypes from "prop-types";
import { Button, Box, HStack } from "@chakra-ui/react";

export const ActionButtons = ({
  onSave,
  onFinish,
  saveLabel = "Guardar",
  finishLabel = "Finalizar",
}) => (
  <Box textAlign="right" mt={4}>
    <HStack spacing={3} justify="flex-end">
      <Button colorScheme="blue" onClick={onSave}>
        {saveLabel}
      </Button>

      <Button colorScheme="green" onClick={onFinish}>
        {finishLabel}
      </Button>
    </HStack>
  </Box>
);

ActionButtons.propTypes = {
  onSave: PropTypes.func.isRequired,
  onFinish: PropTypes.func.isRequired,
  saveLabel: PropTypes.string,
  finishLabel: PropTypes.string,
};
