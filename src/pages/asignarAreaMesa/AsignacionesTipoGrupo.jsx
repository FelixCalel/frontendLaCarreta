import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box, Table, Thead, Tbody, Tr, Th, Td,
  Select, Button, Input,} from '@chakra-ui/react';
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

  

  const { asignaciones, categorias, grupos } = useSelector(state => state.AsignacionAreaMesa);

  useEffect(() => {
    if (areaId) {
      dispatch(fetchAsignacionesThunk(areaId));
      dispatch(fetchCategoriasThunk());
      dispatch(fetchGruposThunk());
    }
  }, [dispatch, areaId]);

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
    
    <Box mt={10}  overflowX="auto" overflowY="auto" maxW="70vw" maxH="50vh" w="100%" mx="auto" p={4} borderWidth={1} borderRadius="lg" boxShadow="md">

        <Table  minWidth="600px" variant="simple" mb={6}>
            <Thead>
            <Tr>
                <Th>Categoría</Th>
                <Th>Grupo</Th>
                <Th>Comentario</Th>
                <Th></Th>
            </Tr>
            </Thead>
            <Tbody>
            {asignaciones.filter(a => a.state).map((a) => (
                <Tr key={a.id}>
                <Td>{nombreCategoria(a.id_categoria)}</Td>
                <Td>{nombreGrupo(a.id_grupo)}</Td>
                <Td>{a.comentario}</Td>
                <Td><Button colorScheme="red" size="sm" variant='outline' onClick={() => handleDesasignar(a.id)}>Eliminar</Button></Td>
                </Tr>
            ))}
            <Tr>
                <Td>
                <Select placeholder="Categoría" value={selectedCategoria} onChange={(e) => setSelectedCategoria(e.target.value)}>
                    {categorias.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </Select>
                </Td>
                <Td>
                <Select placeholder="Grupo" value={selectedGrupo} onChange={(e) => setSelectedGrupo(e.target.value)}>
                    {grupos.map(g => (
                    <option key={g.id} value={g.id}>{g.name}</option>
                    ))}
                </Select>
                </Td>
                <Td>
                <Input value={comentario} onChange={(e) => setComentario(e.target.value)} placeholder="Comentario" />
                </Td>
                <Td>
                <Button colorScheme="green" onClick={handleAsignar}>+ Agregar</Button>
                </Td>
            </Tr>
            </Tbody>
        </Table>
    </Box>
    
  );
};

AsignacionesTipoGrupo.propTypes = {
    areaId: PropTypes.number.isRequired,
  };
export default AsignacionesTipoGrupo;
