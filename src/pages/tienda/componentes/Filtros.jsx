import PropTypes from 'prop-types'; // Importamos PropTypes
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
    // Filtrar datos únicos para Ciudad y Ruta
    const uniqueCiudades = [...new Set(data.map((tienda) => tienda.nombreCiudad))];
    const uniqueRutas = [...new Set(data.map((tienda) => tienda.nombreRuta))];
  
    return (
      <Box mb="20px" display="flex" gap={4}>
        {/* Filtro Ciudad */}
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
  
        {/* Filtro Ruta */}
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
  
        {/* Filtro Zona */}
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

// Agregar validaciones de las props usando PropTypes
Filtros.propTypes = {
  filtroCiudad: PropTypes.string.isRequired,      // filtroCiudad debe ser un string y es requerido
  setFiltroCiudad: PropTypes.func.isRequired,     // setFiltroCiudad debe ser una función y es requerido
  filtroRuta: PropTypes.string.isRequired,        // filtroRuta debe ser un string y es requerido
  setFiltroRuta: PropTypes.func.isRequired,       // setFiltroRuta debe ser una función y es requerido
  filtroZona: PropTypes.string.isRequired,        // filtroZona debe ser un string y es requerido
  setFiltroZona: PropTypes.func.isRequired,       // setFiltroZona debe ser una función y es requerido
  data: PropTypes.array.isRequired,               // data debe ser un array y es requerido
};

export default Filtros;
