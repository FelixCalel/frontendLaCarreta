import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { login as loginAuth, checkingCredentials } from "../store/auth";
import { fetchCurrentUser } from "../store/auth/thunks";
import { fetchModulos } from "../store/RolPermisoUsuario/thunks";

export const AuthWrapper = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const nombre = localStorage.getItem("nombreUsuario");
    const correo = localStorage.getItem("correoUsuario");
    const avatar = localStorage.getItem("avatar");
    const uid = localStorage.getItem("usuarioId");
    const roleId = localStorage.getItem("roleId");
    const paisId = localStorage.getItem("paisId");

    if (token) {
      dispatch(
        loginAuth({
          uid,
          token,
          displayName: nombre,
          correo,
          photoURL: avatar,
          roleId,
          paisId,
        })
      );

      const fetchData = async () => {
        try {
          await dispatch(fetchCurrentUser()).unwrap();
          if (uid) {
            await dispatch(fetchModulos(uid)).unwrap();
          }
        } catch (error) {
          if (
            error === "Network Error" ||
            error === "ERR_NETWORK" ||
            (typeof error === "string" && error.includes("Network"))
          ) {
            setTimeout(fetchData, 2000);
          }
        }
      };

      fetchData();

      const interval = setInterval(fetchData, 15 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [dispatch]);

  return children;
};
