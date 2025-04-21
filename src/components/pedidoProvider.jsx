import { useEffect } from "react";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { tablaPedidos } from "../store/Pedidos/thunks";

export const PedidoProvider = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchPedidos = () => {
      dispatch(tablaPedidos());
    };

    fetchPedidos();

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        fetchPedidos();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    const intervalId = setInterval(() => {
      if (document.visibilityState === "visible") {
        fetchPedidos();
      }
    }, 60000);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [dispatch]);

  return <>{children}</>;
};

PedidoProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
