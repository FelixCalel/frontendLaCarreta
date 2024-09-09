import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Input, List, ListItem, Box } from '@chakra-ui/react';
const DeuSelector = ({ deudores, onSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredDeudores, setFilteredDeudores] = useState([]);

  // Filtrar deudores basado en el término de búsqueda
  useEffect(() => {
    if (searchTerm) {
      // Filtra deudores por nombre o correlativo
      const filtered = deudores.filter(deudor =>
        deudor.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        deudor.correlativo.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredDeudores(filtered);
    } else {
      setFilteredDeudores([]);
    }
  }, [searchTerm, deudores]);

  return (
    <Box>
      <Input
        placeholder="Buscar por nombre o correlativo"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {filteredDeudores.length > 0 && (
        <List spacing={3} mt={2}>
          {filteredDeudores.map(deudor => (
            <ListItem
              key={deudor.id}
              onClick={() => {
                onSelect(deudor);
                setSearchTerm(''); // Limpiar búsqueda
              }}
              cursor="pointer"
              _hover={{ bg: 'gray.100' }}
            >
              {deudor.nombre} - {deudor.correlativo}
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

DeuSelector.propTypes = {
  deudores: PropTypes.array.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func,
  onSelect: PropTypes.func.isRequired,
};

export default DeuSelector;
