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
  const borderColor = useColorModeValue("gray.400", "whiteAlpha.500");

  const toggleSelect = (id) =>
    setSelectedPedidos(
      selectedPedidos.includes(id)
        ? selectedPedidos.filter((pid) => pid !== id)
        : [...selectedPedidos, id],
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
      <Table
        variant="striped"
        colorScheme={stripe}
        size="md"
        style={{ "--blink-color": blinkBg }}
      >
        <Thead>
          <Tr>
            <Th>
              <Checkbox
                size="lg"
                borderColor={borderColor}
                isChecked={
                  pedidosEntrantes.length > 0 &&
                  pedidosEntrantes.every((p) => selectedPedidos.includes(p.id))
                }
                isIndeterminate={
                  selectedPedidos.length > 0 &&
                  !pedidosEntrantes.every((p) => selectedPedidos.includes(p.id))
                }
                onChange={() => {
                  const visibleIds = pedidosEntrantes.map((p) => p.id);
                  const allSelected = visibleIds.every((id) =>
                    selectedPedidos.includes(id),
                  );

                  if (allSelected) {
                    setSelectedPedidos(
                      selectedPedidos.filter((id) => !visibleIds.includes(id)),
                    );
                  } else {
                    const newIds = visibleIds.filter(
                      (id) => !selectedPedidos.includes(id),
                    );
                    setSelectedPedidos([...selectedPedidos, ...newIds]);
                  }
                }}
              />
            </Th>
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
              const isHighlighted =
                highlightedPedidoId && Number(highlightedPedidoId) === p.id;

              return (
                <Tr
                  id={`pedido-${p.id}`}
                  key={p.id}
                  bg={isHighlighted ? hlBg : coincide ? hlBg : undefined}
                  border={isHighlighted ? "2px solid teal" : undefined}
                  animation={isHighlighted ? "blink 1s infinite" : undefined}
                  onClick={isHighlighted ? onClearHighlight : undefined}
                  cursor={isHighlighted ? "pointer" : "default"}
                >
                  <Td w="50px">
                    <Checkbox
                      size="lg"
                      borderColor={borderColor}
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
                    {(() => {
                      if (!p.fechaOrdenDisplay) return "";
                      const [year, month, day] = p.fechaOrdenDisplay
                        .slice(0, 10)
                        .split("-");
                      const localDate = new Date(year, month - 1, day);
                      return format(localDate, "dd MMMM yyyy", { locale: es });
                    })()}
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
    }),
  ).isRequired,
  selectedPedidos: PropTypes.arrayOf(PropTypes.number).isRequired,
  setSelectedPedidos: PropTypes.func.isRequired,
  handleVerDetalles: PropTypes.func.isRequired,
  highlight: PropTypes.string,
  highlightedPedidoId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  onClearHighlight: PropTypes.func,
};

const MemoizedPedidosTable = React.memo(PedidosTable);
MemoizedPedidosTable.displayName = "PedidosTable";

export default MemoizedPedidosTable;
