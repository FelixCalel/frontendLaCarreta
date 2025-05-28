import { Button } from "@chakra-ui/react";
import PropTypes from "prop-types";

export default function SubmitButton({
  isLoading = false,
  text = "Registrar",
}) {
  return (
    <Button
      type="submit"
      colorScheme="green"
      size="lg"
      mt={6}
      width="full"
      borderRadius="md"
      isLoading={isLoading}
    >
      {text}
    </Button>
  );
}

SubmitButton.propTypes = {
  isLoading: PropTypes.bool,
  text: PropTypes.string,
};
