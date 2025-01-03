import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";
import PropTypes from "prop-types";

const PedidosTable = ({ pedidos = [], filtros }) => {
  const itemsAgrupados = pedidos.reduce((acc, pedido) => {
    const { nombreDeu } = pedido;
    const items = pedido.items || []; // Si items es undefined, asigna un arreglo vacío
    items.forEach((item) => {
      acc.push({
        itemCodigo: item.codigo || "Sin código",
        itemNombre: item.nombre,
        deu: nombreDeu,
        pedidoVentas: item.cantidad || 0, // Asegúrate de que 'cantidad' exista
        pedidoComprasOC: item.pedidoComprasOC || 0, // Ajusta según tus datos
        recibido: item.recibido || 0, // Ajusta según tus datos
      });
    });
    return acc;
  }, []);
  

  // Aplicar filtros si es necesario
  const itemsFiltrados = itemsAgrupados.filter((item) => {
    const cumplePalabras =
      !filtros.palabrasClave ||
      item.itemNombre.toLowerCase().includes(filtros.palabrasClave.toLowerCase());
    return cumplePalabras;
  });

  return (
    <Table variant="striped" colorScheme="gray">
      <Thead>
        <Tr>
          <Th>Item</Th>
          <Th>Nombre Item</Th>
          <Th>DEU</Th>
          <Th>Pedido Ventas</Th>
          <Th>Compras OC</Th>
          <Th>Recibido</Th>
        </Tr>
      </Thead>
      <Tbody>
        {itemsFiltrados.length > 0 ? (
          itemsFiltrados.map((item, index) => (
            <Tr key={index}>
              <Td>{item.itemCodigo}</Td>
              <Td>{item.itemNombre}</Td>
              <Td>{item.deu}</Td>
              <Td>{item.pedidoVentas}</Td>
              <Td>{item.pedidoComprasOC}</Td>
              <Td>{item.recibido}</Td>
            </Tr>
          ))
        ) : (
          <Tr>
            <Td colSpan="6" align="center">
              No hay items para mostrar.
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
      nombreDeu: PropTypes.string.isRequired,
      items: PropTypes.arrayOf(
        PropTypes.shape({
          codigo: PropTypes.string,
          nombre: PropTypes.string.isRequired,
          cantidad: PropTypes.number.isRequired,
          pedidoComprasOC: PropTypes.number,
          recibido: PropTypes.number,
        })
      ),
    })
  ).isRequired,
  filtros: PropTypes.shape({
    palabrasClave: PropTypes.string,
  }).isRequired,
};


export default PedidosTable;
