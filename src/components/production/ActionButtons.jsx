// components/ActionButtons.tsx
import PropTypes from "prop-types";
import { Button, Box, HStack } from "@chakra-ui/react";

export const ActionButtons = ({
  onSave,
  onFinish,
  showSave = Boolean(onSave), // true si viene el callback
  showFinish = Boolean(onFinish), // idem
  saveLabel = "Guardar",
  finishLabel = "Finalizar",
}) => (
  <Box textAlign="right" mt={4}>
    <HStack spacing={3} justify="flex-end">
      {showSave && (
        <Button colorScheme="blue" onClick={onSave}>
          {saveLabel}
        </Button>
      )}

      {showFinish && (
        <Button colorScheme="green" onClick={onFinish}>
          {finishLabel}
        </Button>
      )}
    </HStack>
  </Box>
);

ActionButtons.propTypes = {
  onSave: PropTypes.func,
  onFinish: PropTypes.func,
  showSave: PropTypes.bool,
  showFinish: PropTypes.bool,
  saveLabel: PropTypes.string,
  finishLabel: PropTypes.string,
};
