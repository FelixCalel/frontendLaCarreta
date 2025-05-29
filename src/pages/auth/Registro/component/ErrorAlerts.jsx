import { Alert, AlertIcon } from "@chakra-ui/react";
import PropTypes from "prop-types";

export default function ErrorAlerts({ errors }) {
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

ErrorAlerts.defaultProps = {
  errors: {},
};
