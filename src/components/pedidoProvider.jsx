import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import { fetchIncomingPedidos } from "../store/Pedidos/thunks";

export const PedidoProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { status } = useSelector((state) => state.auth);

  useEffect(() => {
    if (status !== "authenticated") return;

    const fetchPedidos = () => {
      dispatch(fetchIncomingPedidos());
    };

    fetchPedidos();

    const handleVisibilityChange = () => {
      if (
        document.visibilityState === "visible" &&
        status === "authenticated"
      ) {
        fetchPedidos();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    const intervalId = setInterval(() => {
      if (
        document.visibilityState === "visible" &&
        status === "authenticated"
      ) {
        fetchPedidos();
      }
    }, 60000);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [dispatch, status]);

  return <>{children}</>;
};

PedidoProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
