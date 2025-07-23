import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Checkbox,
  Spinner,
  Box,
  TableContainer,
  useColorModeValue,
  useToast,
  Text,
} from "@chakra-ui/react";
import PropTypes from "prop-types";
import { useRef } from "react";
import { useUpdateRecetaLineaMutation } from "../../services/pedidoProductionApi";

export const RecetaTable = ({ pedidoId, receta, isLoading }) => {
  const [updateLinea] = useUpdateRecetaLineaMutation();
  const toast = useToast();

  const headBg = useColorModeValue("green.50", "green.700");
  const headColor = useColorModeValue("gray.800", "whiteAlpha.900");
  const stripe = useColorModeValue("gray.50", "gray.700");
  const hover = useColorModeValue("gray.100", "gray.600");
  const cardBorder = useColorModeValue("gray.200", "gray.700");

  const timerRef = useRef();
  const sendUpdate = (payload) => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      try {
        await updateLinea(payload).unwrap();
      } catch {
        toast({
          status: "error",
          description: "No se pudo guardar el cambio",
          duration: 3000,
        });
      }
    }, 350);
  };

  const handleChange = (row, field, raw) => {
    const value = field === "state" ? raw : Number(raw);
    sendUpdate({ id: row.id, pedidoId, data: { [field]: value } });
  };

  if (isLoading) return <Spinner size="sm" />;

  const W_CHECK = "40px";
  const W_NUM = "60px";
  const W_BASE = "90px";
  const W_REQ = "100px";
  const W_UNI = "90px";
  const W_ALM = "140px";

  return (
    <Box
      border="1px solid"
      borderColor={cardBorder}
      borderRadius="md"
      shadow="sm"
    >
      <TableContainer maxH="360px" overflowY="auto">
        <Table
          size="sm"
          variant="striped"
          tableLayout="fixed"
          sx={{ "th, td": { verticalAlign: "middle" } }}
        >
          <Thead
            bg={headBg}
            color={headColor}
            position="sticky"
            top={0}
            zIndex={1}
          >
            <Tr>
              <Th w={W_CHECK}></Th>
              <Th w={W_NUM}>No.</Th>
              <Th>Descripción</Th>
              <Th w={W_BASE} isNumeric>
                Cant. base
              </Th>
              <Th w={W_REQ} isNumeric>
                Ctd. req.
              </Th>
              <Th w={W_UNI}>Unidad</Th>
              <Th w={W_ALM}>Almacén</Th>
            </Tr>
          </Thead>
          <Tbody>
            {receta.map((r, i) => (
              <Tr
                key={r.id}
                bg={i % 2 === 0 ? "transparent" : stripe}
                _hover={{ bg: hover }}
              >
                <Td w={W_CHECK}>
                  <Checkbox
                    isChecked={r.state}
                    onChange={(e) => handleChange(r, "state", e.target.checked)}
                    size="sm"
                    aria-label="Usar ingrediente"
                    colorScheme="green"
                  />
                </Td>

                <Td w={W_NUM}>{r.item}</Td>

                <Td>{r.descripcion ?? "-"}</Td>

                <Td w={W_BASE} isNumeric>
                  <Text
                    as="span"
                    display="inline-block"
                    w="100%"
                    textAlign="center"
                  >
                    {r.cantidad_base}
                  </Text>
                </Td>

                <Td w={W_REQ} isNumeric>
                  <Text
                    as="span"
                    display="inline-block"
                    w="100%"
                    textAlign="center"
                  >
                    {r.cantidad_requerida}
                  </Text>
                </Td>

                <Td w={W_UNI}>
                  <Text
                    as="span"
                    display="inline-block"
                    w="100%"
                    textAlign="center"
                  >
                    {r.nombre_unidad}
                  </Text>
                </Td>

                <Td v w={W_ALM}>
                  {r.almacen_name ?? r.id_almacen}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};

RecetaTable.propTypes = {
  pedidoId: PropTypes.number.isRequired,
  receta: PropTypes.array.isRequired,
  isLoading: PropTypes.bool,
};
