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
  Td,
  Button,
  Flex,
  Heading,
  Badge,
  useColorModeValue,
  Tag,
  TagLabel,
  Divider,
} from "@chakra-ui/react";
import { ArrowBackIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import { useNavigate, useParams } from "react-router-dom";
import { useGetPedidosAgrupadosQuery } from "../../../services/pedidoProductionApi";
import FilterPanelFabricacion from "../../../components/production/fabricacion/FilterPanelFabricacion";

const SapHistorialDetallePage = () => {
  const { pedidoId: raw } = useParams();
  const pedidoId = Number(raw);
  const navigate = useNavigate();

  const {
    data: groups = [],
    isLoading,
    error,
  } = useGetPedidosAgrupadosQuery({ etapaId: 4 });

  const headBg = useColorModeValue("gray.50", "gray.800");
  const tableBorder = useColorModeValue("gray.200", "gray.700");
  const tableBg = useColorModeValue("white", "gray.800");
  const sapTagBg = useColorModeValue("blue.50", "blue.900");

  const [term, setTerm] = useState("");
  const [estado, setEstado] = useState("");
  const [mesa, setMesa] = useState("");

  const group = useMemo(
    () => groups.find((g) => g.pedidoId === pedidoId),
    [groups, pedidoId]
  );

  const filteredItems = useMemo(() => {
    if (!group) return [];
    const txt = term.toLowerCase();
    return group.items.filter((it) => {
      const byText =
        !term ||
        (it.itemCode || "").toLowerCase().includes(txt) ||
        (it.productoNombre || "").toLowerCase().includes(txt);
      const byEstado =
        !estado || (it.completo ? "Completado" : "Pendiente") === estado;
      return byText && byEstado;
    });
  }, [group, term, estado]);

  if (isLoading) {
    return (
      <Center py={20}>
        <Spinner size="xl" />
      </Center>
    );
  }

  if (error || !group) {
    return (
      <Center py={20} flexDirection="column" gap={4}>
        <Text color="red.500">
          {error ? "Error al cargar el historial." : `No se encontró historial para el Pedido #${pedidoId}.`}
        </Text>
        <Button leftIcon={<ArrowBackIcon />} onClick={() => navigate("/digitador/orden/pedido")}>
          Volver al historial
        </Button>
      </Center>
    );
  }

  // Pick SAP info from the first item
  const sapDocNum = filteredItems[0]?.docNum;
  const sapDocEntry = filteredItems[0]?.docEntry;
  const fechaOrdenSap = filteredItems[0]?.fecha_orden_sap;
  const comentarioSap = filteredItems[0]?.comentario_sap;

  return (
    <Box p={6}>
      <Flex mb={4} align="center" justify="space-between" direction={{ base: "column", md: "row" }} gap={4}>
        <Button leftIcon={<ArrowBackIcon />} onClick={() => navigate("/digitador/orden/pedido")}>
          Volver al Historial
        </Button>
        <Heading size="md" textAlign="center">
          Historial SAP — Pedido #{pedidoId}
        </Heading>
        <Box />
      </Flex>

      {/* SAP Info Panel */}
      <Box
        mb={6}
        p={4}
        bg={sapTagBg}
        borderRadius="md"
        borderLeft="4px solid"
        borderLeftColor="blue.400"
      >
        <Flex wrap="wrap" gap={4} align="center">
          <Box>
            <Text fontSize="xs" color="gray.500" mb={1}>CLIENTE</Text>
            <Text fontWeight="bold">{group.deudorNombre || group.tienda}</Text>
            <Text fontSize="sm" color="gray.500">{group.pais}</Text>
          </Box>
          <Divider orientation="vertical" h="40px" />
          {sapDocNum && (
            <Box>
              <Text fontSize="xs" color="gray.500" mb={1}>SAP DOC NUM</Text>
              <Badge colorScheme="blue" fontSize="md" px={2}>{sapDocNum}</Badge>
            </Box>
          )}
          {sapDocEntry && (
            <Box>
              <Text fontSize="xs" color="gray.500" mb={1}>SAP DOC ENTRY</Text>
              <Badge colorScheme="purple" fontSize="md" px={2}>{sapDocEntry}</Badge>
            </Box>
          )}
          {fechaOrdenSap && (
            <Box>
              <Text fontSize="xs" color="gray.500" mb={1}>FECHA SAP</Text>
              <Text fontWeight="semibold">
                {new Date(fechaOrdenSap).toLocaleDateString("es-GT")}
              </Text>
            </Box>
          )}
          {comentarioSap && (
            <Box flex={1} minW="200px">
              <Text fontSize="xs" color="gray.500" mb={1}>COMENTARIO</Text>
              <Text fontSize="sm">{comentarioSap}</Text>
            </Box>
          )}
          <Tag colorScheme="green" ml="auto">
            <TagLabel>✅ Exportado a SAP</TagLabel>
          </Tag>
        </Flex>
      </Box>

      <FilterPanelFabricacion
        term={term}
        onTermChange={setTerm}
        estado={estado}
        onEstadoChange={setEstado}
        mesa={mesa}
        onMesaChange={setMesa}
      />

      <Box
        w="100%"
        border="1px solid"
        borderColor={tableBorder}
        borderRadius="md"
        shadow="sm"
        overflowX="auto"
        bg={tableBg}
        mt={4}
      >
        <Table variant="simple" size="sm">
          <Thead bg={headBg}>
            <Tr>
              <Th>PRODUCTO</Th>
              <Th>CÓDIGO</Th>
              <Th textAlign="center">SOLICITADO</Th>
              <Th textAlign="center">COMPLETADO</Th>
              <Th textAlign="center">DESPACHO</Th>
              <Th>UNIDAD</Th>
              <Th textAlign="center">ESTADO</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredItems.length === 0 ? (
              <Tr>
                <Td colSpan={7} textAlign="center" color="gray.400" py={8}>
                  No hay ítems que mostrar.
                </Td>
              </Tr>
            ) : (
              filteredItems.map((item) => (
                <Tr key={item.id}>
                  <Td fontWeight="medium">{item.productoNombre}</Td>
                  <Td>
                    <Badge variant="outline" colorScheme="gray">{item.itemCode}</Badge>
                  </Td>
                  <Td textAlign="center">{item.cantidadUnidad ?? "-"}</Td>
                  <Td textAlign="center">{item.completo ? "✅" : "⏳"}</Td>
                  <Td textAlign="center">{item.despacho ?? "-"}</Td>
                  <Td>{item.unidadMedida ?? "-"}</Td>
                  <Td textAlign="center">
                    <Badge colorScheme={item.completo ? "green" : "orange"}>
                      {item.completo ? "Completado" : "Pendiente"}
                    </Badge>
                  </Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
};

export default SapHistorialDetallePage;
