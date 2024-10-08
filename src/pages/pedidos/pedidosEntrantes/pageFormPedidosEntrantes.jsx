import { useEffect, useState } from "react";
import {
  Table, Thead, Tbody, Tr, Th, Td, Box, Button, Checkbox, Spinner,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { tablaPedidos, togglePedidoStatus } from "../../../store/Pedidos/thunks"; 
import { fetchUsuarios } from "../../../store/Usuarios/usuariosSlice"; 
import { getDetalleOrdenByPedidoId } from "../../../store/Pedidos/DetallePedidos/thunks"; 
import * as XLSX from 'xlsx'; // Importamos xlsx para exportar a Excel

const EntrantesPage = () => {
  const dispatch = useDispatch();

  // Obtener pedidos y usuarios desde Redux
  const pedidos = useSelector((state) => state.pedidos.data);
  const usuarios = useSelector((state) => state.usuarios.data); 

  // Estado para almacenar los montos totales por pedido
  const [montos, setMontos] = useState({});
  
  // Estado de carga para las operaciones de aprobar/cancelar
  const [isLoading, setIsLoading] = useState(false);

  // Estado para gestionar las selecciones de pedidos
  const [selectedPedidos, setSelectedPedidos] = useState([]);

  // Estado para almacenar detalles del pedido seleccionado
  const [detallesPedido, setDetallesPedido] = useState([]);
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filtrar solo los pedidos con estadoId 2
  const pedidosEntrantes = pedidos.filter((pedido) => pedido.estadoId === 2);

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
          const detalles = await dispatch(getDetalleOrdenByPedidoId(pedido.id)).unwrap();
          const totalMonto = detalles.reduce((acc, detalle) => {
            const precio = parseFloat(detalle.precio); 
            const cantidad = parseFloat(detalle.cantidad); 
            if (!isNaN(precio) && !isNaN(cantidad)) {
              return acc + (precio * cantidad); 
            }
            return acc;
          }, 0);
          montosTemp[pedido.id] = totalMonto; 
        } catch (error) {
          console.error(`Error al cargar detalles para pedido ${pedido.id}:`, error);
          montosTemp[pedido.id] = 0; 
        }
      }
      setMontos(montosTemp); 
    };
    cargarMontos();
  }, [dispatch, pedidosEntrantes]);

  const getNombreUsuario = (usuarioId) => {
    const usuario = usuarios.find(user => user.id === usuarioId);
    return usuario ? usuario.nombre : "N/A"; 
  };

  const handleSelectPedido = (pedidoId) => {
    if (selectedPedidos.includes(pedidoId)) {
      setSelectedPedidos(selectedPedidos.filter(id => id !== pedidoId));
    } else {
      setSelectedPedidos([...selectedPedidos, pedidoId]);
    }
  };
  
  // Manejar la apertura del modal de detalles
  const handleVerDetalles = async (pedidoId) => {
    try {
      const detalles = await dispatch(getDetalleOrdenByPedidoId(pedidoId)).unwrap();
      setDetallesPedido(detalles);
      setSelectedPedido(pedidoId);
      setIsModalOpen(true); // Abrir modal
    } catch (error) {
      console.error(`Error al obtener los detalles del pedido ${pedidoId}:`, error);
    }
  };

  // Cerrar modal de detalles
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPedido(null);
    setDetallesPedido([]);
  };

  // Aprobar pedidos seleccionados
  const handleAprobarPedidos = async () => {
    setIsLoading(true);
  
    try {
      for (const pedidoId of selectedPedidos) {
        await dispatch(togglePedidoStatus({ id: pedidoId, estadoId: 3 }));
      }
      setSelectedPedidos([]); // Limpia la selección después de aprobar
    } catch (error) {
      console.error("Error al aprobar pedidos:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Cancelar pedidos seleccionados
  const handleCancelarPedidos = async () => {
    setIsLoading(true);
  
    try {
      for (const pedidoId of selectedPedidos) {
        await dispatch(togglePedidoStatus({ id: pedidoId, estadoId: 4 }));
      }
      setSelectedPedidos([]); // Limpia la selección después de cancelar
    } catch (error) {
      console.error("Error al cancelar pedidos:", error);
    } finally {
      setIsLoading(false);
    }
  };

// Función para exportar a Excel con formato mejorado y estilizado
const handleExportarExcel = async (pedido) => {
  try {
      const detalles = await dispatch(getDetalleOrdenByPedidoId(pedido.id)).unwrap();
      const data = detalles.map((detalle) => ({
          ID: pedido.id,
          Deudor: pedido.nombreDeu,
          Item: detalle.nombreProducto,
          Cantidad: detalle.cantidad,
          Fecha: pedido.fechaOrden,
      }));

      // Crear la hoja de trabajo
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();

      // Aplicar formato de tabla (colores y bordes)
      const range = XLSX.utils.decode_range(worksheet['!ref']);

      // Estilizar encabezados: Negrita, centrado, color de fondo
      for (let C = range.s.c; C <= range.e.c; ++C) {
          const headerAddress = XLSX.utils.encode_cell({ r: 0, c: C });
          if (!worksheet[headerAddress]) continue;
          worksheet[headerAddress].s = {
              font: { bold: true, sz: 12 },
              alignment: { horizontal: 'center', vertical: 'center' },
              fill: { fgColor: { rgb: '4F81BD' } }, // Color de fondo azul
              border: {
                  top: { style: 'thin', color: { rgb: '000000' } },
                  bottom: { style: 'thin', color: { rgb: '000000' } },
                  left: { style: 'thin', color: { rgb: '000000' } },
                  right: { style: 'thin', color: { rgb: '000000' } }
              },
              font: { color: { rgb: 'FFFFFF' } }, // Texto blanco
          };
      }

      // Estilizar las filas de datos: Bordes y colores alternos para las filas
      for (let R = range.s.r + 1; R <= range.e.r; ++R) {
          for (let C = range.s.c; C <= range.e.c; ++C) {
              const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
              worksheet[cellAddress].s = {
                  alignment: { horizontal: 'center', vertical: 'center' },
                  border: {
                      top: { style: 'thin', color: { rgb: '000000' } },
                      bottom: { style: 'thin', color: { rgb: '000000' } },
                      left: { style: 'thin', color: { rgb: '000000' } },
                      right: { style: 'thin', color: { rgb: '000000' } }
                  },
                  fill: {
                      fgColor: { rgb: R % 2 === 0 ? 'DDEBF7' : 'FFFFFF' } // Alternar colores de fondo
                  }
              };
          }
      }

      // Configurar el ancho de las columnas para que se ajuste al contenido
      worksheet['!cols'] = [
          { wch: 10 }, // ID
          { wch: 20 }, // Deudor
          { wch: 30 }, // Item
          { wch: 10 }, // Cantidad
          { wch: 25 }  // Fecha
      ];

      // Definir la tabla en el rango de datos
      const tableRange = XLSX.utils.encode_range(range);
      worksheet['!autofilter'] = { ref: tableRange }; // Activar los filtros automáticos

      // Agregar la hoja de trabajo al libro
      XLSX.utils.book_append_sheet(workbook, worksheet, `Pedido_${pedido.id}`);

      // Descargar el archivo Excel
      XLSX.writeFile(workbook, `pedido_${pedido.id}.xlsx`);
  } catch (error) {
      console.error(`Error al exportar pedido ${pedido.id}:`, error);
  }
};





  return (
    <Box p={4}>
      <Box mb={4}>
        <Button 
          colorScheme="green" 
          mr={2} 
          onClick={handleAprobarPedidos} 
          isDisabled={selectedPedidos.length === 0 || isLoading}
        >
          {isLoading ? <Spinner size="sm" /> : 'Aprobar Pedidos'}
        </Button>
        <Button 
          colorScheme="red" 
          onClick={handleCancelarPedidos} 
          isDisabled={selectedPedidos.length === 0 || isLoading}
        >
          {isLoading ? <Spinner size="sm" /> : 'Cancelar Pedidos'}
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
                <Td>{pedido.nombreUsuario}</Td>
                <Td>{pedido.nombreTienda}</Td>
                <Td>{pedido.nombreDeu}</Td>
                <Td>{pedido.fechaOrden}</Td>
                <Td>
                  <Button colorScheme="blue" size="sm" onClick={() => handleVerDetalles(pedido.id)}>
                    Ver Detalles
                  </Button>
                  <Button colorScheme="teal" size="sm" ml={2} onClick={() => handleExportarExcel(pedido)}>
                    Exportar a Excel
                  </Button>
                </Td>
              </Tr>
            ))
          ) : (
            <Tr>
              <Td colSpan="8" align="center">No hay pedidos en estado 2</Td>
            </Tr>
          )}
        </Tbody>
      </Table>

      {/* Modal de detalles del pedido */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Detalles del Pedido {selectedPedido}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {detallesPedido.length > 0 ? (
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Producto</Th>
                    <Th>Cantidad</Th>
                    <Th>Precio</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {detallesPedido.map((detalle) => (
                    <Tr key={detalle.id}>
                      <Td>{detalle.nombreProducto}</Td>
                      <Td>{detalle.cantidad}</Td>
                      <Td>{detalle.precio}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            ) : (
              <Box>No hay detalles disponibles</Box>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleCloseModal}>
              Cerrar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default EntrantesPage;
