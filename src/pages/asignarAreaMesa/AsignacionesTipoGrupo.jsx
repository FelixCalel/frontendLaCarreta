import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box, Table, Thead, Tbody, Tr, Th, Td,
  Select, Button, Flex, Text, useColorModeValue
} from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAsignacionesThunk,
  asignarTipoGrupoThunk,
  desasignarTipoGrupoThunk,
  fetchProductosThunk
} from '../../store/asignacionAM/thunks';

const AsignacionesTipoGrupo = ({ areaId }) => {
  const dispatch = useDispatch();
  const usuarioId = Number(localStorage.getItem('usuarioId'));

  const [selectedProducto, setSelectedProducto] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const { asignaciones, productos } = useSelector(state => state.AsignacionAreaMesa);

  useEffect(() => {
    if (areaId) {
      dispatch(fetchAsignacionesThunk(areaId));
      dispatch(fetchProductosThunk());
    }
  }, [dispatch, areaId]);

  const filteredAsignaciones = asignaciones.filter(a => a?.state);
  const totalPages = Math.ceil(filteredAsignaciones.length / itemsPerPage);
  const paginatedAsignaciones = filteredAsignaciones.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleAsignar = () => {
    if (selectedProducto) {
      dispatch(asignarTipoGrupoThunk({
        id_area: areaId,
        productoId: Number(selectedProducto),
        create_by: usuarioId,
        state: true
      })).then(() => {
        setSelectedProducto('');
        dispatch(fetchAsignacionesThunk(areaId));
        setCurrentPage(1);
      });
    }
  };

  const handleDesasignar = (id) => {
    dispatch(desasignarTipoGrupoThunk({ id, update_by: usuarioId })).then(() => {
      dispatch(fetchAsignacionesThunk(areaId));
    });
  };

  const obtenerProducto = (id) => productos.find(p => p.id === id);

  return (
    <Box mt={10} w="100%" mx="auto" p={4} borderWidth={1} borderRadius="lg" boxShadow="md">
      <Table minWidth="700px" variant="simple" mb={4}>
        <Thead bg={useColorModeValue('green.600', 'gray.700')}>
          <Tr>
            <Th color={useColorModeValue('white', 'green.200')}>Código</Th>
            <Th color={useColorModeValue('white', 'green.200')}>Nombre</Th>
            <Th color={useColorModeValue('white', 'green.200')}>Acciones</Th>
          </Tr>
        </Thead>
        <Tbody>
          {paginatedAsignaciones.map((a) => {
            const prod = obtenerProducto(a.productoId);
            return (
              <Tr key={a.id}>
                <Td>{prod?.codigo || '—'}</Td>
                <Td>{prod?.nombre || '—'}</Td>
                <Td>
                  <Button
                    colorScheme="red"
                    size="sm"
                    variant="outline"
                    onClick={() => handleDesasignar(a.id)}
                  >
                    Eliminar
                  </Button>
                </Td>
              </Tr>
            );
          })}
          <Tr>
            <Td colSpan={2}>
              <Select
                placeholder="Seleccione producto"
                value={selectedProducto}
                onChange={(e) => setSelectedProducto(e.target.value)}
              >
                {productos.map(p => (
                  <option key={p.id} value={p.id}>{p.codigo} - {p.nombre}</option>
                ))}
              </Select>
            </Td>
            <Td>
              <Button
                colorScheme="green"
                onClick={handleAsignar}
                isDisabled={!selectedProducto}
              >
                Agregar
              </Button>
            </Td>
          </Tr>
        </Tbody>
      </Table>

      {filteredAsignaciones.length > 0 && (
        <Flex justifyContent="space-between" alignItems="center" mt={4}>
          <Text fontSize="sm">
            Mostrando {paginatedAsignaciones.length} de {filteredAsignaciones.length} registros
          </Text>

          <Flex gap={2}>
            <Button
              size="sm"
              isDisabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
              variant='outline'
              colorScheme='teal'
            >
              Anterior
            </Button>

            {Array.from({ length: totalPages }, (_, i) => (
              <Button
                key={i + 1}
                size="sm"
                variant={currentPage === i + 1 ? 'solid' : 'outline'}
                colorScheme={currentPage === i + 1 ? 'blue' : 'gray'}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </Button>
            ))}

            <Button
              size="sm"
              isDisabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
              variant='outline'
              colorScheme='teal'
            >
              Siguiente
            </Button>
          </Flex>
        </Flex>
      )}
    </Box>
  );
};

AsignacionesTipoGrupo.propTypes = {
  areaId: PropTypes.number.isRequired,
};

export default AsignacionesTipoGrupo;
