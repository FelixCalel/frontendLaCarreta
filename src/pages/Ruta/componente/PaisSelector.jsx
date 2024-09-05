import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types'; // Importa la librería de prop-types
import { tablaPais } from '../../../store/Ruta/thunks'

const PaisSelector = ({ onPaisChange }) => {
  const dispatch = useDispatch();
  const paises = useSelector((state) => state.paises);

  useEffect(() => {
    dispatch(tablaPais());
  }, [dispatch]);

  return (
    <select onChange={(e) => onPaisChange(e.target.value)}>
      <option value="">Selecciona un país</option>
      {paises.data.map((pais) => (
        <option key={pais.id} value={pais.id}>
          {pais.nombre}
        </option>
      ))}
    </select>
  );
};

// Validación de props
PaisSelector.propTypes = {
  onPaisChange: PropTypes.func.isRequired,  // Declara que onPaisChange es una función requerida
};

export default PaisSelector;
