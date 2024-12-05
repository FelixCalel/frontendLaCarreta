import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Checkbox,
  Button,
  Tooltip,
  IconButton,
  useToast,
} from "@chakra-ui/react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { SiMicrosoftexcel } from "react-icons/si";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { getDetalleOrdenByPedidoId } from "../../../../store/Pedidos/DetallePedidos/thunks";

const PedidosTable = ({
  pedidosEntrantes,
  selectedPedidos,
  setSelectedPedidos,
  handleVerDetalles,
}) => {
  const dispatch = useDispatch();
  const toast = useToast();

  const handleSelectPedido = (pedidoId) => {
    if (selectedPedidos.includes(pedidoId)) {
      setSelectedPedidos(selectedPedidos.filter((id) => id !== pedidoId));
    } else {
      setSelectedPedidos([...selectedPedidos, pedidoId]);
    }
  };

  const handleExportarExcel = async (pedido) => {
    try {
      const detalles = await dispatch(
        getDetalleOrdenByPedidoId(pedido.id)
      ).unwrap();
      if (!detalles || detalles.length === 0) {
        toast({
          title: "Error",
          description: `No hay detalles disponibles para el pedido ${pedido.id}.`,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }
  
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet(`Pedido_${pedido.id}`);
  
      // Formatear la fecha para Excel
      const fechaFormateada = format(new Date(pedido.fechaOrden), "dd MMMM yyyy HH:mm", {
        locale: es,
      });
  
      worksheet.columns = [
        { header: "ID Pedido", key: "id", width: 15 },
        { header: "Deudor", key: "deudor", width: 30 },
        { header: "Item", key: "item", width: 40 },
        { header: "Cantidad", key: "cantidad", width: 15 },
        { header: "Fecha", key: "fecha", width: 25 },
      ];
  
      detalles.forEach((detalle) => {
        worksheet.addRow({
          id: `P-${pedido.id}`,
          deudor: pedido.nombreDeu || "N/A",
          item: `${detalle.codigo || "Sin código"} - ${detalle.nombreProducto}`,
          cantidad: detalle.cantidad,
          fecha: fechaFormateada, // Usar la fecha formateada
        });
      });
  
      // Opcional: Dar formato a la columna de fecha
      const fechaColumn = worksheet.getColumn('fecha');
      fechaColumn.width = 25;
  
      const buffer = await workbook.xlsx.writeBuffer();
      saveAs(
        new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        }),
        `pedido_${pedido.id}.xlsx`
      );
    } catch (error) {
      console.error("Error al exportar pedido:", error);
      toast({
        title: "Error",
        description: "Hubo un problema al exportar el pedido.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };
  

  return (
    <Table variant="striped" colorScheme="gray">
      <Thead>
        <Tr>
          <Th>Seleccionar</Th>
          <Th>ID</Th>
          <Th>Usuario</Th>
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
              <Td>
                {format(new Date(pedido.fechaOrden), "dd MMMM yyyy HH:mm", {
                  locale: es,
                })}
              </Td>
              <Td>
                <Tooltip label="Ver Detalles" hasArrow>
                  <Button
                    colorScheme="blue"
                    size="sm"
                    onClick={() =>
                      handleVerDetalles(pedido.id, pedido.detalles)
                    }
                  >
                    Ver Detalles
                  </Button>
                </Tooltip>
                <Tooltip label="Exportar a Excel" hasArrow>
                  <IconButton
                    ml={2}
                    colorScheme="teal"
                    size="sm"
                    icon={<SiMicrosoftexcel />}
                    onClick={() => handleExportarExcel(pedido)}
                  />
                </Tooltip>
              </Td>
            </Tr>
          ))
        ) : (
          <Tr>
            <Td colSpan="8" align="center">
              No hay pedidos en estado 2
            </Td>
          </Tr>
        )}
      </Tbody>
    </Table>
  );
};

PedidosTable.propTypes = {
  pedidosEntrantes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      nombreUsuario: PropTypes.string.isRequired,
      fechaOrden: PropTypes.string.isRequired,
      detalles: PropTypes.arrayOf(
        PropTypes.shape({
          codigo: PropTypes.string,
          nombreProducto: PropTypes.string.isRequired,
          cantidad: PropTypes.number.isRequired,
        })
      ),
    })
  ).isRequired,
  selectedPedidos: PropTypes.arrayOf(PropTypes.number).isRequired,
  setSelectedPedidos: PropTypes.func.isRequired,
  handleVerDetalles: PropTypes.func.isRequired,
};

export default PedidosTable;
