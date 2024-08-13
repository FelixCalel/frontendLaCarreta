import { useEffect } from 'react';
import { useDispatch } from 'react-redux'; // Importa useDispatch
import { logout } from "../../store/auth"; // Asumiendo que logout es la acción correcta

export const Logout = () => {
  const dispatch = useDispatch();

  // Ejecutar la acción logout cuando el componente se monta
  useEffect(() => {
    dispatch(logout());
  }, [dispatch]);

  return null; // Como no hay UI que renderizar, devuelve null
};
