import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { login as loginAuth } from "../store/auth"; // Ajusta la importación si es necesario

export const AuthWrapper = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const nombre = localStorage.getItem("nombreUsuario");
    const correo = localStorage.getItem("correoUsuario");

    if (token && nombre && correo) {
      // Restaurar el estado de autenticación
      dispatch(loginAuth({ token, nombre, correo }));
    }
  }, [dispatch]);

  return children;
};
