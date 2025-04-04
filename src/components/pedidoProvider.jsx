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

    const intervalId = setInterval(() => {
      fetchPedidos();
    }, 10000);

    return () => clearInterval(intervalId);
  }, [dispatch]);

  return <>{children}</>;
};

PedidoProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
