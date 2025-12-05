import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { login as loginAuth, checkingCredentials } from "../store/auth";
import { fetchCurrentUser } from "../store/auth/thunks";

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
      // Restaurar el estado de autenticación pero mantener status 'checking'
      // para que se muestre la pantalla de carga hasta que verifiquemos con el backend
      // o decidimos que estamos en modo offline
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

      // Set status to checking AFTER restoring data
      // This ensures we show the loading screen while verifying with backend
      // dispatch(checkingCredentials());

      // Función para intentar obtener datos del usuario con reintentos
      const fetchData = async () => {
        try {
          const result = await dispatch(fetchCurrentUser()).unwrap();
          // Si tiene éxito, no hacemos nada más
        } catch (error) {
          // Si falla por error de red, reintentar en 5 segundos
          if (
            error === "Network Error" ||
            error === "ERR_NETWORK" ||
            (typeof error === "string" && error.includes("Network"))
          ) {
            // console.log("Backend no disponible, reintentando en 2s...");
            setTimeout(fetchData, 2000);
          }
        }
      };

      fetchData();
    }
  }, [dispatch]);

  return children;
};
