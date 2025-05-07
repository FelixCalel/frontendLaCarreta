import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box, Table, Thead, Tbody, Tr, Th, Td,
  Select, Button, Input, Flex, Text, useColorModeValue } from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAsignacionesThunk,
  fetchCategoriasThunk,
  fetchGruposThunk,
  asignarTipoGrupoThunk,
  desasignarTipoGrupoThunk
} from '../../store/asignacionAM/thunks';


const AsignacionesTipoGrupo = ({ areaId }) => {
  const dispatch = useDispatch();
  const usuarioId = Number(localStorage.getItem('usuarioId'));

  const [selectedCategoria, setSelectedCategoria] = useState('');
  const [selectedGrupo, setSelectedGrupo] = useState('');
  const [comentario, setComentario] = useState('');


  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  

  const { asignaciones, categorias, grupos } = useSelector(state => state.AsignacionAreaMesa);

  useEffect(() => {
    if (areaId) {
      dispatch(fetchAsignacionesThunk(areaId));
      dispatch(fetchCategoriasThunk());
      dispatch(fetchGruposThunk());
    }
  }, [dispatch, areaId]);

  const filteredAsignaciones = asignaciones.filter(a => a?.state);
  const totalPages = Math.ceil(filteredAsignaciones.length / itemsPerPage);
  const paginatedAsignaciones = filteredAsignaciones.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleAsignar = () => {
    if (selectedCategoria && selectedGrupo) {
      dispatch(asignarTipoGrupoThunk({
        id_area: areaId,
        id_categoria: Number(selectedCategoria),
        id_grupo: Number(selectedGrupo),
        comentario,
        create_by: usuarioId,
        state: true
      })).then(() => {
        setSelectedCategoria('');
        setSelectedGrupo('');
        setComentario('');
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

  const nombreCategoria = (id) => categorias.find(c => c.id === id)?.name || '—';
  const nombreGrupo = (id) => grupos.find(g => g.id === id)?.name || '—';

  return (
    <Box mt={10} overflowX="auto" w="100%" mx="auto" maxW="auto" p={4} borderWidth={1} borderRadius="lg" boxShadow="md">
      <Table minWidth="700px" variant="simple" mb={4}>
        <Thead bg={useColorModeValue('green.600', 'gray.700')}>
          <Tr>
            <Th color={useColorModeValue('white', 'green.200')}>Categoría</Th>
            <Th color={useColorModeValue('white', 'green.200')}>Grupo</Th>
            <Th color={useColorModeValue('white', 'green.200')}>Comentario</Th>
            <Th color={useColorModeValue('white', 'green.200')}>Acciones</Th>
          </Tr>
        </Thead>
        <Tbody>
          {paginatedAsignaciones.map((a) => (
            <Tr key={a.id}>
              <Td>{nombreCategoria(a.id_categoria)}</Td>
              <Td>{nombreGrupo(a.id_grupo)}</Td>
              <Td>{a.comentario || '—'}</Td>
              <Td>
                <Button 
                  colorScheme="red" 
                  size="sm" 
                  variant='outline' 
                  onClick={() => handleDesasignar(a.id)}
                >
                  Eliminar
                </Button>
              </Td>
            </Tr>
          ))}

          {/* Fila de formulario para agregar (siempre visible) */}
          <Tr>
            <Td>
              <Select 
                placeholder="Seleccione categoría"
                value={selectedCategoria}
                onChange={(e) => setSelectedCategoria(e.target.value)}
              >
                {categorias.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </Select>
            </Td>
            <Td>
              <Select 
                placeholder="Seleccione grupo"
                value={selectedGrupo}
                onChange={(e) => setSelectedGrupo(e.target.value)}
              >
                {grupos.map(g => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </Select>
            </Td>
            <Td>
              <Input 
                placeholder="Comentario (opcional)"
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
              />
            </Td>
            <Td>
              <Button 
                colorScheme="green" 
                onClick={handleAsignar}
                isDisabled={!selectedCategoria || !selectedGrupo}
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
