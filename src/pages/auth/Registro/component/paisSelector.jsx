import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types'; // Importa la librería de prop-types
import { tablaPais } from '../../../../store/pais/thunks';

const PaisSelector = ({ onPaisChange }) => {
  const dispatch = useDispatch();
  const { data: paises, status } = useSelector((state) => state.paises);

  useEffect(() => {
    dispatch(tablaPais());
  }, [dispatch]);

  if (status === 'loading') {
    return <p>Cargando países...</p>;
  }

  if (status === 'failed') {
    return <p>Error al cargar los países.</p>;
  }

  return (
    <select onChange={(e) => onPaisChange(e.target.value)}>
      <option value="">Selecciona un país</option>
      {paises.map((pais) => (
        <option key={pais.id} value={pais.id}>
          {pais.nombre}
        </option>
      ))}
    </select>
  );
};

// Validación de prop-types
PaisSelector.propTypes = {
  onPaisChange: PropTypes.func.isRequired,  // Validamos que onPaisChange es requerido y es una función
};

export default PaisSelector;
