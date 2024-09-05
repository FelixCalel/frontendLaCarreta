import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { tablaRuta } from "../../../store/Ruta/thunks";

const RutaSelector = () => {
  const dispatch = useDispatch();
  const rutas = useSelector((state) => state.rutas);
  console.log(rutas)
  useEffect(() => {
    dispatch(tablaRuta());
  }, [dispatch]);
  return (
    <select>
      {rutas.data.map((ruta) => (
        <option key={ruta.id} value={ruta.id}>
          {ruta.nombre}
        </option>
      ))}
    </select>
  );
};
export default RutaSelector;
