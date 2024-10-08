import { useEffect, useState } from "react";
import {
  Table, Thead, Tbody, Tr, Th, Td, Box, Button, Checkbox, Spinner,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { tablaPedidos, togglePedidoStatus } from "../../../store/Pedidos/thunks"; 
import { fetchUsuarios } from "../../../store/Usuarios/usuariosSlice"; 
import { getDetalleOrdenByPedidoId } from "../../../store/Pedidos/DetallePedidos/thunks"; 
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';  // Necesitas instalar file-saver


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

  const handleExportarExcel = async (pedido) => {
    try {
      const detalles = await dispatch(getDetalleOrdenByPedidoId(pedido.id)).unwrap();
  
      // Crear un nuevo libro de Excel
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet(`Pedido_${pedido.id}`);
  
      // Añadir encabezados con 'ID Pedido'
      worksheet.columns = [
        { header: 'ID Pedido', key: 'id', width: 15 },  // Aquí cambiamos a 'ID Pedido'
        { header: 'Deudor', key: 'deudor', width: 25 },
        { header: 'Item', key: 'item', width: 35 },
        { header: 'Cantidad', key: 'cantidad', width: 15 },
        { header: 'Fecha', key: 'fecha', width: 25 },
      ];
  
      // Estilizar encabezados
      const headerRow = worksheet.getRow(1);
      headerRow.font = { bold: true, size: 12, color: { argb: 'FFFFFFFF' } }; // Texto blanco
      headerRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF4CAF50' },  // Fondo verde
      };
      headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
      headerRow.eachCell({ includeEmpty: false }, (cell) => {
        cell.border = {
          top: { style: 'thick', color: { argb: 'FF228B22' } },
          left: { style: 'thick', color: { argb: 'FF228B22' } },
          bottom: { style: 'thick', color: { argb: 'FF228B22' } },
          right: { style: 'thick', color: { argb: 'FF228B22' } },
        };
      });
  
      // Añadir datos con estilo y bordes, concatenando 'P-' al ID del pedido
      detalles.forEach((detalle, index) => {
        const row = worksheet.addRow({
          id: `P-${pedido.id}`,  // Aquí concatenamos 'P-' al ID del pedido
          deudor: pedido.nombreDeu,
          item: detalle.nombreProducto,
          cantidad: detalle.cantidad,
          fecha: pedido.fechaOrden,
        });
  
        row.eachCell({ includeEmpty: false }, (cell) => {
          cell.border = {
            top: { style: 'thin', color: { argb: 'FF228B22' } },
            left: { style: 'thin', color: { argb: 'FF228B22' } },
            bottom: { style: 'thin', color: { argb: 'FF228B22' } },
            right: { style: 'thin', color: { argb: 'FF228B22' } },
          };
          cell.alignment = { vertical: 'middle', horizontal: 'center' };
        });
  
        // Aplicar colores alternos en las filas
        if (index % 2 === 0) {
          row.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFE8F5E9' },  // Color verde claro
          };
        }
      });
  
      // Limitar el rango de la tabla a las columnas con información
      const totalRows = detalles.length + 1;  // +1 para incluir los encabezados
      worksheet.autoFilter = {
        from: 'A1',
        to: `E${totalRows}`,  // Rango limitado de A a E con el número de filas con datos
      };
  
      // Descargar el archivo Excel
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, `pedido_${pedido.id}.xlsx`);
  
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
