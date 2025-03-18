import { useEffect } from "react";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types"; // Importamos PropTypes para la validación de props
import { tablaPedidos } from "../store/Pedidos/thunks"; // Asegúrate de importar el thunk correcto

export const PedidoProvider = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchPedidos = () => {
      dispatch(tablaPedidos()); // Obtiene todos los pedidos
    };

    // Carga inicial de pedidos
    fetchPedidos();

    // Actualiza cada cierto tiempo
    const intervalId = setInterval(() => {
      fetchPedidos();
    }, 10000); // Actualiza cada 10 segundos

    return () => clearInterval(intervalId); // Limpia el intervalo al desmontar el componente
  }, [dispatch]);

  return <>{children}</>; // Renderiza los componentes hijos
};

// Agregamos la validación de props usando PropTypes
PedidoProvider.propTypes = {
  children: PropTypes.node.isRequired, // Validamos que children sea requerido y de tipo React node
};
