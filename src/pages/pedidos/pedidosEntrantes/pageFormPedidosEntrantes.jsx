import { useEffect, useState } from "react";
import { Table, Thead, Tbody, Tr, Th, Td, Box, Button, Checkbox } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { tablaPedidos, togglePedidoStatus } from "../../../store/Pedidos/thunks"; 
import { fetchUsuarios } from "../../../store/Usuarios/usuariosSlice"; // Asegúrate de que la ruta sea correcta
import { getDetalleOrdenByPedidoId } from "../../../store/Pedidos/DetallePedidos/thunks"; // Importa el thunk para obtener los detalles del pedido

const EntrantesPage = () => {
  const dispatch = useDispatch();

  // Obtener pedidos y usuarios desde Redux
  const pedidos = useSelector((state) => state.pedidos.data);
  const usuarios = useSelector((state) => state.usuarios.data); 

  // Estado para almacenar los montos totales por pedido
  const [montos, setMontos] = useState({});

  // Filtrar solo los pedidos con estadoId 2
  const pedidosEntrantes = pedidos.filter((pedido) => pedido.estadoId === 2);

  // Estado para gestionar las selecciones de pedidos
  const [selectedPedidos, setSelectedPedidos] = useState([]);

  // Cargar los pedidos y usuarios al montar el componente
  useEffect(() => {
    dispatch(tablaPedidos());
    dispatch(fetchUsuarios());
  }, [dispatch]);

  // Cargar los detalles del pedido para calcular el total
  useEffect(() => {
    const cargarMontos = async () => {
      const montosTemp = {};
      for (const pedido of pedidosEntrantes) {
        try {
          // Obtener los detalles del pedido
          const detalles = await dispatch(getDetalleOrdenByPedidoId(pedido.id)).unwrap();
          
          // Verificar que cada detalle tenga un precio y cantidad correctos
          const totalMonto = detalles.reduce((acc, detalle) => {
            const precio = parseFloat(detalle.precio); // Convertir a número
            const cantidad = parseFloat(detalle.cantidad); // Convertir a número
            
            if (isNaN(precio) || isNaN(cantidad)) {
              console.error(`Precio o cantidad inválidos para el detalle del pedido ${detalle.id}`);
              return acc; // Saltar este detalle si hay un valor inválido
            }
            
            return acc + (precio * cantidad); // Multiplicar precio por cantidad y sumar al total
          }, 0);
  
          montosTemp[pedido.id] = totalMonto; // Guardar el total para el pedido
        } catch (error) {
          console.error(`Error al cargar detalles para pedido ${pedido.id}:`, error);
          montosTemp[pedido.id] = 0; // Si hay error, asignar 0
        }
      }
      setMontos(montosTemp); // Almacenar los montos totales
    };
  
    cargarMontos();
  }, [dispatch, pedidosEntrantes]);
  
  
  

  // Función para obtener el nombre del usuario basado en el usuarioId
  const getNombreUsuario = (usuarioId) => {
    const usuario = usuarios.find(user => user.id === usuarioId);
    return usuario ? usuario.nombre : "N/A"; // Devuelve el nombre o "N/A" si no se encuentra
  };

  // Manejar la selección de pedidos
  const handleSelectPedido = (pedidoId) => {
    if (selectedPedidos.includes(pedidoId)) {
      setSelectedPedidos(selectedPedidos.filter(id => id !== pedidoId));
    } else {
      setSelectedPedidos([...selectedPedidos, pedidoId]);
    }
  };

  // Aprobar pedidos seleccionados: cambiar el estado a 3
  const handleAprobarPedidos = () => {
    selectedPedidos.forEach((pedidoId) => {
      const pedido = pedidos.find(p => p.id === pedidoId);
      if (pedido) {
        dispatch(togglePedidoStatus({ ...pedido, estadoId: 3 })); // Cambiar el estado a 3 (aprobado)
      }
    });
    setSelectedPedidos([]); // Limpiar selección
  };

  // Cancelar pedidos seleccionados: cambiar el estado a 4 (cancelado)
  const handleCancelarPedidos = () => {
    selectedPedidos.forEach((pedidoId) => {
      const pedido = pedidos.find(p => p.id === pedidoId);
      if (pedido) {
        dispatch(togglePedidoStatus({ ...pedido, estadoId: 4 })); // Cambiar el estado a 4 (cancelado)
      }
    });
    setSelectedPedidos([]); // Limpiar selección
  };

  return (
    <Box p={4}>
      {/* Botones para aprobar y cancelar pedidos */}
      <Box mb={4}>
        <Button colorScheme="green" mr={2} onClick={handleAprobarPedidos} isDisabled={selectedPedidos.length === 0}>
          Aprobar Pedidos
        </Button>
        <Button colorScheme="red" onClick={handleCancelarPedidos} isDisabled={selectedPedidos.length === 0}>
          Cancelar Pedidos
        </Button>
      </Box>

      <Table variant="striped" colorScheme="gray">
        <Thead>
          <Tr>
            <Th>Select</Th>
            <Th>ID</Th>
            <Th>Usuario</Th>
            <Th>Tienda</Th>
            <Th>Deudor</Th>
            <Th>Fecha</Th>
            {/* <Th>Monto</Th> */}
            <Th>Acciones</Th>
          </Tr>
        </Thead>
        <Tbody>
          {pedidosEntrantes.length > 0 ? (
            pedidosEntrantes.map((pedido) => (
              <Tr key={pedido.id}>
                <Td>
                  <Checkbox
                    isChecked={selectedPedidos.includes(pedido.id)}
                    onChange={() => handleSelectPedido(pedido.id)}
                  />
                </Td>
                <Td>{pedido.id}</Td>
                <Td>{getNombreUsuario(pedido.usuarioId)}</Td>
                <Td>{pedido.nombreTienda}</Td>
                <Td>{pedido.nombreDeu}</Td>
                <Td>{pedido.fechaOrden}</Td>
                {/* Mostrar el total del monto para cada pedido */}
                {/* <Td>{montos[pedido.id] ? montos[pedido.id].toFixed(2) : "Calculando..."}</Td> */}
                <Td>
                  <Button colorScheme="blue" size="sm" onClick={() => console.log(`Ver detalles de pedido ${pedido.id}`)}>
                    Ver Detalles
                  </Button>
                </Td>
              </Tr>
            ))
          ) : (
            <Tr>
              <Td colSpan={8} align="center">No hay pedidos en estado 2</Td>
            </Tr>
          )}
        </Tbody>
      </Table>
    </Box>
  );
};

export default EntrantesPage;
