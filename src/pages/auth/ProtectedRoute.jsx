import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";  // Importamos PropTypes para la validación

const ProtectedRoute = ({ children }) => {
  const token = useSelector((state) => state.auth.token); // O donde guardes el token

  if (!token) {
    // Si no hay token, redirigir al login
    return <Navigate to="/auth/login" replace />;
  }

  return children;
};

// Validamos que `children` sea un nodo de React
ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
