import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { tablaCiudad } from "../../../store/Ciudad/thunks";

const CiudadSelector = () => {
  const dispatch = useDispatch();
  const ciudades = useSelector((state) => state.ciudades);
  console.log(ciudades)
  useEffect(() => {
    dispatch(tablaCiudad());
  }, [dispatch]);
  return (
    <select>
      {ciudades.data.map((ciudad) => (
        <option key={ciudad.id} value={ciudad.id}>
          {ciudad.nombre}
        </option>
      ))}
    </select>
  );
};
export default CiudadSelector;
