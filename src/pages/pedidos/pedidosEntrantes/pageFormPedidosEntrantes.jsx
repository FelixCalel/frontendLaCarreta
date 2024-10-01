import { useEffect } from "react";
import { Table, Thead, Tbody, Tr, Th, Td, Box } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { tablaPedidos } from "../../../store/Pedidos/thunks"; 
import { fetchUsuarios } from "../../../store/Usuarios/usuariosSlice"; // Asegúrate de que la ruta sea correcta

const EntrantesPage = () => {
  const dispatch = useDispatch();

  // Obtener pedidos y usuarios desde Redux
  const pedidos = useSelector((state) => state.pedidos.data);
  const usuarios = useSelector((state) => state.usuarios.data); 

  // Filtrar solo los pedidos con estadoId 2
  const pedidosEntrantes = pedidos.filter((pedido) => pedido.estadoId === 2);

  // Cargar los pedidos y usuarios al montar el componente
  useEffect(() => {
    dispatch(tablaPedidos());
    dispatch(fetchUsuarios());
  }, [dispatch]);

  // Función para obtener el nombre del usuario basado en el usuarioId
  const getNombreUsuario = (usuarioId) => {
    const usuario = usuarios.find(user => user.id === usuarioId);
    return usuario ? usuario.nombre : "N/A"; // Devuelve el nombre o "N/A" si no se encuentra
  };

  return (
    <Box p={4}>
      <h1>Pedidos Entrantes</h1>
      <Table variant="striped" colorScheme="gray">
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Usuario</Th>
            <Th>Tienda</Th>
            <Th>Deudor</Th>
            <Th>Fecha</Th>
            <Th>Monto</Th>
          </Tr>
        </Thead>
        <Tbody>
          {pedidosEntrantes.length > 0 ? (
            pedidosEntrantes.map((pedido) => (
              <Tr key={pedido.id}>
                <Td>{pedido.id}</Td>
                <Td>{getNombreUsuario(pedido.usuarioId)}</Td>
                <Td>{pedido.nombreTienda}</Td>
                <Td>{pedido.nombreDeu}</Td>
                <Td>{pedido.fechaOrden}</Td>
                <Td>{pedido.monto}</Td>
              </Tr>
            ))
          ) : (
            <Tr>
              <Td colSpan={6} align="center">No hay pedidos en estado 2</Td>
            </Tr>
          )}
        </Tbody>
      </Table>
    </Box>
  );
};

export default EntrantesPage;
