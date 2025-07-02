import PropTypes from "prop-types";
import { Button, Box } from "@chakra-ui/react";

export const SaveButton = ({ onSave }) => (
  <Box textAlign="right" mt={4}>
    <Button colorScheme="green" onClick={onSave}>
      Guardar
    </Button>
  </Box>
);

SaveButton.propTypes = {
  onSave: PropTypes.func.isRequired,
};
