import React from "react";
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
  useColorModeValue,
} from "@chakra-ui/react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import PropTypes from "prop-types";

const PedidosTable = ({
  pedidosEntrantes,
  selectedPedidos,
  setSelectedPedidos,
  handleVerDetalles,
  highlight = "",
}) => {
  const hl = highlight.trim().toLowerCase();
  const stripe = useColorModeValue("gray", "blue");
  const hlBg = useColorModeValue("yellow.100", "yellow.700");

  const toggleSelect = (id) =>
    setSelectedPedidos(
      selectedPedidos.includes(id)
        ? selectedPedidos.filter((pid) => pid !== id)
        : [...selectedPedidos, id]
    );

  return (
    <Table variant="striped" colorScheme={stripe} size="md">
      <Thead>
        <Tr>
          <Th>Seleccionar</Th>
          <Th>ID</Th>
          <Th>Deudor</Th>
          <Th>Tienda</Th>
          <Th>Usuario</Th>
          <Th>Fecha Orden</Th>
          <Th>Acciones</Th>
        </Tr>
      </Thead>

      <Tbody>
        {pedidosEntrantes.length ? (
          pedidosEntrantes.map((p) => {
            const textoFila = (
              `${p.nombreCorrelativo} ${p.nombreDeu} ` +
              `${p.nombreTienda} ` +
              `${p.nombreUsuario} ${p.apellidoUsuario}`
            ).toLowerCase();

            const coincide = hl && textoFila.includes(hl);

            return (
              <Tr key={p.id} bg={coincide ? hlBg : undefined}>
                <Td w="50px">
                  <Checkbox
                    isChecked={selectedPedidos.includes(p.id)}
                    onChange={() => toggleSelect(p.id)}
                  />
                </Td>
                <Td>{p.id}</Td>
                <Td>{`${p.nombreCorrelativo} - ${p.nombreDeu}`}</Td>
                <Td>{p.nombreTienda}</Td>
                <Td>{`${p.nombreUsuario} ${p.apellidoUsuario}`}</Td>
                <Td>
                  {format(new Date(p.fechaOrdenDisplay), "dd MMMM yyyy", {
                    locale: es,
                  })}
                </Td>
                <Td>
                  <Tooltip label="Ver Detalles" hasArrow>
                    <Button
                      colorScheme="blue"
                      size="sm"
                      onClick={() => handleVerDetalles(p.id)}
                    >
                      Ver Detalles
                    </Button>
                  </Tooltip>
                </Td>
              </Tr>
            );
          })
        ) : (
          <Tr>
            <Td colSpan={7} textAlign="center">
              No hay pedidos
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
      nombreCorrelativo: PropTypes.string,
      nombreDeu: PropTypes.string,
      nombreTienda: PropTypes.string,
      nombreUsuario: PropTypes.string,
      apellidoUsuario: PropTypes.string,
      creadoEl: PropTypes.string.isRequired,
    })
  ).isRequired,
  selectedPedidos: PropTypes.arrayOf(PropTypes.number).isRequired,
  setSelectedPedidos: PropTypes.func.isRequired,
  handleVerDetalles: PropTypes.func.isRequired,
  highlight: PropTypes.string,
};

// Optimización: Memorizar el componente para evitar renderizados innecesarios
const MemoizedPedidosTable = React.memo(PedidosTable);
MemoizedPedidosTable.displayName = "PedidosTable";

export default MemoizedPedidosTable;
