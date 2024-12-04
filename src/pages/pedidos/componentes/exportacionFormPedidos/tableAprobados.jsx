// src/componentes/AprobadosTable.jsx

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
  
  const AprobadosTable = ({ pedidosAprobados, handleVerDetalles }) => {
    return (
      <Table variant="striped" colorScheme="gray">
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Usuario</Th>
            <Th>Fecha</Th>
            <Th>Acciones</Th>
          </Tr>
        </Thead>
        <Tbody>
          {pedidosAprobados.length > 0 ? (
            pedidosAprobados.map((pedido) => (
              <Tr key={pedido.id}>
                <Td>{pedido.id}</Td>
                <Td>{pedido.nombreUsuario}</Td>
                <Td>{pedido.fechaOrden}</Td>
                <Td>
                  <Tooltip label="Ver Detalles" hasArrow>
                    <Button
                      colorScheme="blue"
                      size="sm"
                      onClick={() => handleVerDetalles(pedido.id)}
                    >
                      Ver Detalles
                    </Button>
                  </Tooltip>
                </Td>
              </Tr>
            ))
          ) : (
            <Tr>
              <Td colSpan="4" align="center">
                No hay pedidos aprobados.
              </Td>
            </Tr>
          )}
        </Tbody>
      </Table>
    );
  };
  
  AprobadosTable.propTypes = {
    pedidosAprobados: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        nombreUsuario: PropTypes.string.isRequired,
        fechaOrden: PropTypes.string.isRequired,
        detalles: PropTypes.arrayOf(
          PropTypes.shape({
            id: PropTypes.number.isRequired,
            codigo: PropTypes.string,
            nombreProducto: PropTypes.string.isRequired,
            cantidad: PropTypes.number.isRequired,
          })
        ),
      })
    ).isRequired,
    handleVerDetalles: PropTypes.func.isRequired,
  };
  
  export default AprobadosTable;
  