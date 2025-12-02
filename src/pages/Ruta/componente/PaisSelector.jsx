import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { Select } from '@chakra-ui/react';
import { tablaPais } from '../../../store/pais/thunks';

const PaisSelector = ({ value, onPaisChange }) => {
  const dispatch = useDispatch();
  const { data: paises, status } = useSelector((state) => state.paises);

  useEffect(() => {
    if (paises.length === 0) {
      dispatch(tablaPais());
    }
  }, [dispatch, paises.length]);

  return (
    <Select 
      value={value} 
      onChange={(e) => onPaisChange(e.target.value)} 
      placeholder="Selecciona un país"
      isDisabled={status === 'loading'}
    >
      {paises.map((pais) => (
        <option key={pais.id} value={pais.id}>
          {pais.nombre}
        </option>
      ))}
    </Select>
  );
};

PaisSelector.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onPaisChange: PropTypes.func.isRequired,
};

export default PaisSelector;
