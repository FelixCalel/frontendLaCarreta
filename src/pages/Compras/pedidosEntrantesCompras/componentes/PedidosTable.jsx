// src/pages/pedidosEntrantes/componentes/PedidosTable.jsx

import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Button,
    Tooltip,
  } from "@chakra-ui/react";
  import PropTypes from "prop-types";
  import { format } from "date-fns";
  import { es } from "date-fns/locale";
  
  const PedidosTable = ({ pedidos, filtros, onVerDetalles }) => {
    // Filtrar los pedidos según los filtros aplicados
    const pedidosFiltrados = pedidos.filter((pedido) => {
      const cumpleFecha =
        !filtros.fechaEntrega ||
        pedido.fechaEntrega.startsWith(filtros.fechaEntrega);
      const cumplePalabras =
        !filtros.palabrasClave ||
        pedido.items.some((item) =>
          item.nombre.toLowerCase().includes(filtros.palabrasClave.toLowerCase())
        );
      return cumpleFecha && cumplePalabras;
    });
  
    return (
      <Table variant="striped" colorScheme="gray">
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Deudor</Th>
            <Th>Tienda</Th>
            <Th>Fecha de Entrega</Th>
            <Th>Acciones</Th>
          </Tr>
        </Thead>
        <Tbody>
          {pedidosFiltrados.length > 0 ? (
            pedidosFiltrados.map((pedido) => (
              <Tr key={pedido.id}>
                <Td>{pedido.id}</Td>
                <Td>{pedido.nombreDeu}</Td>
                <Td>{pedido.nombreTienda}</Td>
                <Td>
                  {format(new Date(pedido.fechaEntrega), "dd 'de' MMMM 'de' yyyy", {
                    locale: es,
                  })}
                </Td>
                <Td>
                  <Tooltip label="Ver Detalles" hasArrow>
                    <Button
                      colorScheme="blue"
                      size="sm"
                      onClick={() => onVerDetalles(pedido.id)}
                    >
                      Ver Detalles
                    </Button>
                  </Tooltip>
                </Td>
              </Tr>
            ))
          ) : (
            <Tr>
              <Td colSpan="5" align="center">
                No hay pedidos entrantes.
              </Td>
            </Tr>
          )}
        </Tbody>
      </Table>
    );
  };
  
  PedidosTable.propTypes = {
    pedidos: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        nombreDeu: PropTypes.string.isRequired,
        nombreTienda: PropTypes.string.isRequired,
        fechaEntrega: PropTypes.string.isRequired,
        items: PropTypes.arrayOf(
          PropTypes.shape({
            nombre: PropTypes.string.isRequired,
          })
        ).isRequired,
      })
    ).isRequired,
    filtros: PropTypes.shape({
      fechaEntrega: PropTypes.string,
      palabrasClave: PropTypes.string,
    }).isRequired,
    onVerDetalles: PropTypes.func.isRequired,
  };
  
  export default PedidosTable;
  