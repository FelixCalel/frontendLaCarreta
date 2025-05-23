import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import PropTypes from "prop-types"; // Importamos PropTypes

export const PublicRoute = ({ children }) => {
  const actualUsuario = useSelector((state) => state.auth);

  // Si el usuario está registrado, lo redirigimos a la confirmación de registro
  if (actualUsuario.status === "registered") {
    return <Navigate to="/auth/confirmacion_registro" replace />;
  }

  // Si el usuario está autenticado, lo redirigimos a la página de inicio
  if (actualUsuario.status === "authenticated") {
    return <Navigate to="/auth/home" replace />;
  }

  // Si no está autenticado ni registrado, renderizamos las rutas públicas
  return children;
};

// Validación de PropTypes
PublicRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
