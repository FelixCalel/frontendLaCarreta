import PropTypes from "prop-types"; 
import { Flex, Button } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";

const HeaderButtons = ({ onOpen }) => {
  return (
    <Flex w="100%" justifyContent="flex-end">
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
    </Flex>
  );
};

HeaderButtons.propTypes = {
  onOpen: PropTypes.func.isRequired,
};

export default HeaderButtons;
