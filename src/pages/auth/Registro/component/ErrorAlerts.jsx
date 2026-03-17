import { Alert, AlertIcon } from "@chakra-ui/react";
import PropTypes from "prop-types";

const EMPTY_ERRORS = {};

export default function ErrorAlerts({ errors = EMPTY_ERRORS }) {
  if (!errors || Object.keys(errors).length === 0) return null;

  return (
    <>
      {Object.entries(errors).map(([key, message]) => (
        <Alert
          status="error"
          variant="left-accent"
          borderRadius="md"
          mt={4}
          key={key}
        >
          <AlertIcon />
          {message}
        </Alert>
      ))}
    </>
  );
}

ErrorAlerts.propTypes = {
  errors: PropTypes.objectOf(PropTypes.string),
};
