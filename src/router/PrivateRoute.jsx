import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";

export const PrivateRoute = ({ children }) => {
  const { status } = useSelector((s) => s.auth);
  return status === "authenticated" ? (
    children
  ) : (
    <Navigate to="/auth/login" replace />
  );
};

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
