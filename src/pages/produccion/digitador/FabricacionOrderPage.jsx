// src/pages/production/fabricacion/FabricacionPage.jsx
import { useState, useMemo } from "react";
import {
  Box,
  Center,
  Spinner,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
} from "@chakra-ui/react";
import { useGetAllPedidosProduccionQuery } from "../../../services/pedidoProductionApi";
import FilterPanelFabricacion from "../../../components/production/fabricacion/FilterPanelFabricacion";
import { FabricacionRow } from "../../../components/production/fabricacion/FabricacionRow";

const FabricacionPage = () => {
  const {
    data: pedidos = [],
    isLoading,
    error,
  } = useGetAllPedidosProduccionQuery();

  const [term, setTerm] = useState("");
  const [estado, setEstado] = useState("");
  const [mesa, setMesa] = useState("");

  const filtered = useMemo(
    () =>
      pedidos
        .filter((o) => {
          const byText =
            !term ||
            o.itemCode.toLowerCase().includes(term.toLowerCase()) ||
            o.productoNombre.toLowerCase().includes(term.toLowerCase());
          const byEstado =
            !estado || (o.completo ? "Completado" : "Pendiente") === estado;
          const byMesa = !mesa || o.id_asigArea.toString() === mesa;
          return byText && byEstado && byMesa;
        })
        .sort((a, b) => a.id - b.id),
    [pedidos, term, estado, mesa]
  );

  if (isLoading) {
    return (
      <Center py={20}>
        <Spinner size="xl" />
      </Center>
    );
  }
  if (error) {
    return (
      <Center py={20}>
        <Text color="red.500">Error al cargar órdenes de fabricación.</Text>
      </Center>
    );
  }

  return (
    <Box p={6}>
      <FilterPanelFabricacion
        term={term}
        onTermChange={setTerm}
        estado={estado}
        onEstadoChange={setEstado}
        mesa={mesa}
        onMesaChange={setMesa}
      />

      {/* ¡Ahora usamos Chakra Table en lugar de Box as="table"! */}
      <Table
        variant="simple"
        size="sm"
        border="1px solid"
        borderColor="gray.200"
      >
        <Thead>
          <Tr>
            <Th />
            <Th>ITEM</Th>
            <Th>Descripción artículo/serv</Th>
            <Th>Pedido</Th>
            <Th>Completar despacho</Th>
            <Th>Despacho</Th>
            <Th>Faltante</Th>
            <Th>Unidad de medida</Th>
            <Th>Cantidad</Th>
            <Th>No. Trazabilidad</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filtered.map((o) => (
            <FabricacionRow key={o.id} order={o} />
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default FabricacionPage;
