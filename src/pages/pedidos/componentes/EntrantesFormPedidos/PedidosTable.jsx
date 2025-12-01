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
  highlightedPedidoId = null,
  onClearHighlight = () => {},
  highlight = "",
}) => {
  const hl = highlight.trim().toLowerCase();
  const stripe = useColorModeValue("gray", "blue");
  const hlBg = useColorModeValue("yellow.100", "yellow.700");
  const blinkBg = useColorModeValue("orange.100", "orange.700");

  const toggleSelect = (id) =>
    setSelectedPedidos(
      selectedPedidos.includes(id)
        ? selectedPedidos.filter((pid) => pid !== id)
        : [...selectedPedidos, id]
    );

  return (
    <>
      <style>
        {`
          @keyframes blink {
            0% { background-color: transparent; }
            50% { background-color: var(--blink-color); }
            100% { background-color: transparent; }
          }
        `}
      </style>
      <Table variant="striped" colorScheme={stripe} size="md" sx={{ "--blink-color": blinkBg }}>
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
              const isHighlighted = highlightedPedidoId && Number(highlightedPedidoId) === p.id;

              return (
                <Tr 
                  key={p.id} 
                  bg={coincide ? hlBg : undefined}
                  animation={isHighlighted ? "blink 1s infinite" : undefined}
                  onClick={isHighlighted ? onClearHighlight : undefined}
                  cursor={isHighlighted ? "pointer" : "default"}
                >
                  <Td w="50px">
                    <Checkbox
                      size="lg"
                      borderColor={useColorModeValue("gray.400", "whiteAlpha.500")}
                      isChecked={selectedPedidos.includes(p.id)}
                      onChange={(e) => {
                        e.stopPropagation();
                        toggleSelect(p.id);
                      }}
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
                        onClick={(e) => {
                          e.stopPropagation();
                          handleVerDetalles(p);
                        }}
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
    </>
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
  highlightedPedidoId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onClearHighlight: PropTypes.func,
};

// Optimización: Memorizar el componente para evitar renderizados innecesarios
const MemoizedPedidosTable = React.memo(PedidosTable);
MemoizedPedidosTable.displayName = "PedidosTable";

export default MemoizedPedidosTable;
