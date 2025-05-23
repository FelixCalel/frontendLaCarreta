import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import PropTypes from "prop-types"; // Importamos PropTypes

// Componente que protege rutas privadas
export const PrivateRoute = ({ children }) => {
  const { status } = useSelector((state) => state.auth); // Obtenemos el estado de autenticación

  if (status !== "authenticated") {
    // Si no está autenticado, redirigir al login
    return <Navigate to="/auth/login" replace />;
  }

  // Si está autenticado, renderizar el contenido protegido
  return children;
};

// Validación de props
PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired, // Validamos que 'children' sea un nodo React
};
