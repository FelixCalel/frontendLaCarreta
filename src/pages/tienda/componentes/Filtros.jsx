import PropTypes from 'prop-types';
import { Box, FormControl, FormLabel, Select, Input } from '@chakra-ui/react';

const Filtros = ({
    filtroCiudad,
    setFiltroCiudad,
    filtroRuta,
    setFiltroRuta,
    filtroZona,
    setFiltroZona,
    data,
  }) => {
    const uniqueCiudades = [...new Set(data.map((tienda) => tienda.nombreCiudad))];
    const uniqueRutas = [...new Set(data.map((tienda) => tienda.nombreRuta))];
  
    return (
      <Box mb="20px" display="flex" gap={4}>
        <FormControl>
          <FormLabel>Ciudad</FormLabel>
          <Select
            value={filtroCiudad}
            onChange={(e) => setFiltroCiudad(e.target.value)}
            placeholder="Seleccionar ciudad"
          >
            {uniqueCiudades.map((ciudad, index) => (
              <option key={index} value={ciudad}>
                {ciudad}
              </option>
            ))}
          </Select>
        </FormControl>
  
        <FormControl>
          <FormLabel>Ruta</FormLabel>
          <Select
            value={filtroRuta}
            onChange={(e) => setFiltroRuta(e.target.value)}
            placeholder="Seleccionar ruta"
          >
            {uniqueRutas.map((ruta, index) => (
              <option key={index} value={ruta}>
                {ruta}
              </option>
            ))}
          </Select>
        </FormControl>
  
        <FormControl>
          <FormLabel>Zona</FormLabel>
          <Input
            value={filtroZona}
            onChange={(e) => setFiltroZona(e.target.value)}
            placeholder="Buscar zona"
          />
        </FormControl>
      </Box>
    );
  };

Filtros.propTypes = {
  filtroCiudad: PropTypes.string.isRequired,
  setFiltroCiudad: PropTypes.func.isRequired,
  filtroRuta: PropTypes.string.isRequired,
  setFiltroRuta: PropTypes.func.isRequired,
  filtroZona: PropTypes.string.isRequired,
  setFiltroZona: PropTypes.func.isRequired,
  data: PropTypes.array.isRequired,
};

export default Filtros;
