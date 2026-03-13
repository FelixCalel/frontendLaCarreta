import { Fragment } from "react";
import PropTypes from "prop-types";
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
  Select,
} from "@chakra-ui/react";

export const HistorialItemsTable = ({
  filteredItems,
  headBg,
  tableBorder,
  tableBg,
  detailsRowBg,
  expandedItems,
  toggleItemDetails,
  group,
}) => (
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
          <Th textAlign="center">FALTANTE</Th>
          <Th textAlign="center">PROCESADO</Th>
          <Th textAlign="center">DETALLE</Th>
        </Tr>
      </Thead>
      <Tbody>
        {filteredItems.length === 0 ? (
          <Tr>
            <Td colSpan={6} textAlign="center" color="gray.400" py={8}>
              No hay ítems que mostrar.
            </Td>
          </Tr>
        ) : (
          filteredItems.map((item) => {
            const isExpanded = expandedItems.has(item.id);

            return (
              <Fragment key={item.id}>
                <Tr>
                  <Td fontWeight="medium">{item.productoNombre}</Td>
                  <Td>
                    <Badge variant="outline" colorScheme="gray">
                      {item.itemCode}
                    </Badge>
                  </Td>
                  <Td textAlign="center">{item.cantidadUnidad ?? "-"}</Td>
                  <Td textAlign="center">{item.faltante ?? "-"}</Td>
                  <Td textAlign="center">{item.mpUtilizada ?? "-"}</Td>
                  <Td textAlign="center">
                    <Button
                      size="xs"
                      variant="outline"
                      onClick={() => toggleItemDetails(item.id)}
                    >
                      {isExpanded ? "Ocultar" : "Detalle"}
                    </Button>
                  </Td>
                </Tr>

                {isExpanded && (
                  <Tr>
                    <Td colSpan={6} bg={detailsRowBg}>
                      <Flex wrap="wrap" gap={4} p={2}>
                        <Box minW="180px">
                          <Text fontSize="xs" color="gray.500">
                            CLIENTE
                          </Text>
                          <Text fontSize="sm" fontWeight="semibold">
                            {group.deudorNombre || group.tienda}
                          </Text>
                        </Box>
                        <Box minW="120px">
                          <Text fontSize="xs" color="gray.500">
                            ESTADO
                          </Text>
                          <Badge colorScheme={item.completo ? "green" : "orange"}>
                            {item.completo ? "Completado" : "Pendiente"}
                          </Badge>
                        </Box>
                        <Box minW="140px">
                          <Text fontSize="xs" color="gray.500">
                            FECHA SAP
                          </Text>
                          <Text fontSize="sm">
                            {item.fecha_orden_sap
                              ? new Date(item.fecha_orden_sap).toLocaleDateString("es-GT")
                              : "-"}
                          </Text>
                        </Box>
                        <Box minW="120px">
                          <Text fontSize="xs" color="gray.500">
                            DOC NUM
                          </Text>
                          <Text fontSize="sm">{item.docNum ?? "-"}</Text>
                        </Box>
                        <Box minW="120px">
                          <Text fontSize="xs" color="gray.500">
                            DOC ENTRY
                          </Text>
                          <Text fontSize="sm">{item.docEntry ?? "-"}</Text>
                        </Box>
                        <Box minW="120px">
                          <Text fontSize="xs" color="gray.500">
                            DESPACHO
                          </Text>
                          <Text fontSize="sm">{item.despacho ?? "-"}</Text>
                        </Box>
                        <Box minW="120px">
                          <Text fontSize="xs" color="gray.500">
                            RECHAZO
                          </Text>
                          <Text fontSize="sm">{item.cantidadRechazada ?? "-"}</Text>
                        </Box>
                        <Box minW="100px">
                          <Text fontSize="xs" color="gray.500">
                            UNIDAD
                          </Text>
                          <Text fontSize="sm">{item.unidadMedida ?? "-"}</Text>
                        </Box>
                        <Box minW="120px">
                          <Text fontSize="xs" color="gray.500">
                            ALMACÉN
                          </Text>
                          <Text fontSize="sm">{item.codigoAlmacen || "-"}</Text>
                        </Box>
                        <Box flex="1" minW="240px">
                          <Text fontSize="xs" color="gray.500">
                            COMENTARIO SAP
                          </Text>
                          <Text fontSize="sm">{item.comentario_sap || "-"}</Text>
                        </Box>
                      </Flex>
                    </Td>
                  </Tr>
                )}
              </Fragment>
            );
          })
        )}
      </Tbody>
    </Table>
  </Box>
);

export const RecetaReadonlyTable = ({
  tableBorder,
  tableBg,
  headBg,
  selectedProdId,
  setSelectedProdId,
  historyItems,
  loadingReceta,
  receta,
  getMaterialParts,
  getAlmacenName,
}) => (
  <Box
    w="100%"
    border="1px solid"
    borderColor={tableBorder}
    borderRadius="md"
    shadow="sm"
    overflowX="auto"
    bg={tableBg}
    mt={6}
  >
    <Flex
      justify="space-between"
      align="center"
      p={3}
      borderBottom="1px solid"
      borderColor={tableBorder}
    >
      <Heading size="sm">Receta enviada a SAP (solo lectura)</Heading>
      <Select
        maxW="320px"
        size="sm"
        value={selectedProdId ?? ""}
        onChange={(e) => setSelectedProdId(Number(e.target.value))}
      >
        {historyItems.map((item) => (
          <option key={`sel-${item.id}`} value={item.id}>
            {item.productoNombre} ({item.itemCode || "sin código"})
          </option>
        ))}
      </Select>
    </Flex>

    {loadingReceta ? (
      <Center py={6}>
        <Spinner size="md" />
      </Center>
    ) : (
      <Table variant="simple" size="sm">
        <Thead bg={headBg}>
          <Tr>
            <Th>MATERIAL</Th>
            <Th textAlign="center">MP UTILIZADA</Th>
            <Th textAlign="center">CANT. REAL</Th>
            <Th textAlign="center">CANT. BASE</Th>
            <Th textAlign="center">CANT. REQ</Th>
            <Th>UNIDAD</Th>
            <Th>ALMACÉN MP</Th>
            <Th textAlign="center">ACTIVO</Th>
          </Tr>
        </Thead>
        <Tbody>
          {receta.length === 0 ? (
            <Tr>
              <Td colSpan={8} textAlign="center" color="gray.400" py={6}>
                No hay receta registrada en DB para este ítem exportado.
              </Td>
            </Tr>
          ) : (
            receta.map((linea) => (
              <Tr key={linea.id}>
                <Td>
                  <Text fontWeight="semibold">{getMaterialParts(linea).code}</Text>
                  {getMaterialParts(linea).name && (
                    <Text fontSize="xs" color="gray.500">
                      {getMaterialParts(linea).name}
                    </Text>
                  )}
                </Td>
                <Td textAlign="center">{linea.mpUtilizada ?? "-"}</Td>
                <Td textAlign="center">{linea.cantidad_real ?? "-"}</Td>
                <Td textAlign="center">{linea.cantidad_base ?? "-"}</Td>
                <Td textAlign="center">{linea.cantidad_requerida ?? "-"}</Td>
                <Td>{linea.nombre_unidad || "-"}</Td>
                <Td>{getAlmacenName(linea)}</Td>
                <Td textAlign="center">{linea.state ? "Sí" : "No"}</Td>
              </Tr>
            ))
          )}
        </Tbody>
      </Table>
    )}
  </Box>
);

HistorialItemsTable.propTypes = {
  filteredItems: PropTypes.array.isRequired,
  headBg: PropTypes.string.isRequired,
  tableBorder: PropTypes.string.isRequired,
  tableBg: PropTypes.string.isRequired,
  detailsRowBg: PropTypes.string.isRequired,
  expandedItems: PropTypes.instanceOf(Set).isRequired,
  toggleItemDetails: PropTypes.func.isRequired,
  group: PropTypes.shape({
    deudorNombre: PropTypes.string,
    tienda: PropTypes.string,
  }).isRequired,
};

RecetaReadonlyTable.propTypes = {
  tableBorder: PropTypes.string.isRequired,
  tableBg: PropTypes.string.isRequired,
  headBg: PropTypes.string.isRequired,
  selectedProdId: PropTypes.number,
  setSelectedProdId: PropTypes.func.isRequired,
  historyItems: PropTypes.array.isRequired,
  loadingReceta: PropTypes.bool.isRequired,
  receta: PropTypes.array.isRequired,
  getMaterialParts: PropTypes.func.isRequired,
  getAlmacenName: PropTypes.func.isRequired,
};
