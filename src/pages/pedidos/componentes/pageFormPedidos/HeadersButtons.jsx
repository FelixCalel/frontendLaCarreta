import PropTypes from "prop-types"; // Importa PropTypes
import { Button } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";

const HeaderButtons = ({ onOpen }) => {
  return (
    <Button
      onClick={onOpen}
      colorScheme="green"
      mb={4}
      leftIcon={<AddIcon />}
      _hover={{
        transform: "scale(1.1)",
        transition: "0.2s",
        boxShadow: "lg",
      }}
      _active={{ transform: "scale(0.95)", transition: "0.1s" }}
      shadow="md"
    >
      Crear Pedido
    </Button>
  );
};

// Define las validaciones de las props
HeaderButtons.propTypes = {
  onOpen: PropTypes.func.isRequired, // onOpen debe ser una función y es requerida
};

export default HeaderButtons;
