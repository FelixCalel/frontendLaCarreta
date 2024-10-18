import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { tablaDeudores } from "../../../store/Deus/thunks";

const DeuSelector = ({ empresaId, onSelect }) => { // Cambia ciudadId por empresaId
  const dispatch = useDispatch();
  const { deudores } = useSelector((state) => state.deudores);

  useEffect(() => {
    if (empresaId) {
      dispatch(tablaDeudores({ empresaId })); // Filtra los deudores por empresaId
    }
  }, [dispatch, empresaId]);

  const handleSelectDeudor = (deudor) => {
    onSelect({
      id: deudor.id,
      correlativo: deudor.correlativo,
      nombre: deudor.nombre,
    });
  };

  return (
    <select onChange={(e) => handleSelectDeudor(deudores.find(d => d.id === e.target.value))}>
      <option value="">Seleccionar deudor</option>
      {deudores.map((deu) => (
        <option key={deu.id} value={deu.id}>
          {`${deu.correlativo} - ${deu.nombre}`}
        </option>
      ))}
    </select>
  );
};

DeuSelector.propTypes = {
  empresaId: PropTypes.string.isRequired, // Cambia ciudadId a empresaId
  onSelect: PropTypes.func.isRequired,
};

export default DeuSelector;
