import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { tablaPais } from "../../../store/pais/thunks";

const PaisSelector = () => {
  const dispatch = useDispatch();
  const paises = useSelector((state) => state.ciudades);
  console.log(paises)
  useEffect(() => {
    dispatch(tablaPais());
  }, [dispatch]);
  return (
    <select>
      {paises.data.map((pais) => (
        <option key={pais.id} value={pais.id}>
          {pais.nombre}
        </option>
      ))}
    </select>
  );
};
export default PaisSelector;
