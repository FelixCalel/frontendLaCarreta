import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Checkbox,
  Input,
  Spinner,
  TableContainer,
  useColorModeValue,
  useToast,
  Text,
} from "@chakra-ui/react";
import { useUpdateRecetaLineaMutation } from "../../services/pedidoProductionApi";

export const RecetaTable = ({ pedidoId, receta, isLoading }) => {
  const [updateLinea] = useUpdateRecetaLineaMutation();
  const toast = useToast();

  const headBg = useColorModeValue("green.100", "green.700");
  const inputBorderColor = useColorModeValue("gray.300", "gray.600");
  const headColor = useColorModeValue("gray.800", "whiteAlpha.900");
  const stripeBg = useColorModeValue("gray.50", "gray.800");
  const hoverBg = useColorModeValue("gray.100", "gray.600");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  const [, setBaseValues] = useState({});
  const [stateValues, setStateValues] = useState({});
  const [realValues, setRealValues] = useState({});

  useEffect(() => {
    const b = {};
    const rVals = {};
    const s = {};
    receta.forEach((r) => {
      b[r.id] = r.cantidad_base != null ? String(r.cantidad_base) : "";
      rVals[r.id] = r.cantidad_real != null ? String(r.cantidad_real) : "";
      s[r.id] = !!r.state;
    });
    setBaseValues(b);
    setRealValues(rVals);
    setStateValues(s);
  }, [receta]);

  const updateField = async (id, field, raw) => {
    const data = {};
    const numeric = ["cantidad_base", "cantidad_real"];
    data[field] = numeric.includes(field)
      ? raw === ""
        ? null
        : Number(raw)
      : raw;
    try {
      await updateLinea({ id, pedidoId, data }).unwrap();
    } catch {
      toast({
        status: "error",
        description: "Error al guardar",
        duration: 3000,
      });
    }
  };

  if (isLoading) {
    return (
      <Box py={4} textAlign="center">
        <Spinner />
      </Box>
    );
  }

  return (
    <Box
      border="1px solid"
      borderColor={borderColor}
      borderRadius="md"
      overflow="hidden"
    >
      <TableContainer maxH="360px" overflowY="auto">
        <Table size="sm" variant="striped" tableLayout="fixed">
          <Thead
            bg={headBg}
            color={headColor}
            position="sticky"
            top={0}
            zIndex={1}
          >
            <Tr>
              <Th w="40px" />
              <Th w="60px">No.</Th>
              <Th>Descripción</Th>
              <Th w="100px" isNumeric>
                Cant. real
              </Th>
              <Th w="100px" isNumeric>
                Cant. base
              </Th>
              <Th w="100px" isNumeric>
                Ctd. req.
              </Th>
              <Th w="100px">Unidad</Th>
              <Th>Almacén</Th>
            </Tr>
          </Thead>
          <Tbody>
            {receta.map((r, idx) => (
              <Tr
                key={r.id}
                bg={idx % 2 === 0 ? "transparent" : stripeBg}
                _hover={{ bg: hoverBg }}
              >
                <Td textAlign="center">
                  <Checkbox
                    isChecked={stateValues[r.id]}
                    onChange={(e) => {
                      const v = e.target.checked;
                      setStateValues((prev) => ({ ...prev, [r.id]: v }));
                      updateField(r.id, "state", v);
                    }}
                    size="sm"
                    colorScheme="green"
                  />
                </Td>
                <Td>{r.item}</Td>
                <Td>{r.descripcion || "-"}</Td>
                <Td isNumeric>
                  <Input
                    size="xs"
                    variant="outline"
                    borderWidth="1px"
                    borderColor={inputBorderColor}
                    borderRadius="sm"
                    _hover={{ borderColor: "green.400" }}
                    type="number"
                    value={realValues[r.id]}
                    onChange={(e) =>
                      setRealValues((prev) => ({
                        ...prev,
                        [r.id]: e.target.value,
                      }))
                    }
                    onBlur={(e) =>
                      updateField(r.id, "cantidad_real", e.target.value)
                    }
                    textAlign="center"
                    focusBorderColor="green.400"
                  />
                </Td>
                <Td isNumeric>
                  <Text textAlign="center">{r.cantidad_base}</Text>
                </Td>
                <Td isNumeric>
                  <Text textAlign="center">{r.cantidad_requerida}</Text>
                </Td>
                <Td>
                  <Text textAlign="center">{r.nombre_unidad}</Text>
                </Td>
                <Td>{r.almacen_name || r.id_almacen}</Td>
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
  receta: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      item: PropTypes.string.isRequired,
      descripcion: PropTypes.string,
      cantidad_base: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      cantidad_requerida: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
      ]),
      nombre_unidad: PropTypes.string,
      almacen_name: PropTypes.string,
      state: PropTypes.bool,
    })
  ).isRequired,
  isLoading: PropTypes.bool,
};

RecetaTable.defaultProps = {
  isLoading: false,
};
