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

export const RecetaTable = ({ pedidoId, receta, isLoading = false }) => {
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
  const [mpUtilizadaValues, setMpUtilizadaValues] = useState({});
  const [mp1raValues, setMp1raValues] = useState({});
  const [mp2daValues, setMp2daValues] = useState({});
  const [mp3raValues, setMp3raValues] = useState({});

  useEffect(() => {
    const b = {};
    const rVals = {};
    const s = {};
    const mpUtilizadaVals = {};
    const mp1raVals = {};
    const mp2daVals = {};
    const mp3raVals = {};
    receta.forEach((r) => {
      b[r.id] = r.cantidad_base != null ? String(r.cantidad_base) : "";
      rVals[r.id] = r.cantidad_real != null ? String(r.cantidad_real) : "";
      s[r.id] = !!r.state;
      mpUtilizadaVals[r.id] =
        r.mpUtilizada != null ? String(r.mpUtilizada) : "";
      mp1raVals[r.id] = r.mp1ra != null ? String(r.mp1ra) : "";
      mp2daVals[r.id] = r.mp2da != null ? String(r.mp2da) : "";
      mp3raVals[r.id] = r.mp3ra != null ? String(r.mp3ra) : "";
    });
    setBaseValues(b);
    setRealValues(rVals);
    setStateValues(s);
    setMpUtilizadaValues(mpUtilizadaVals);
    setMp1raValues(mp1raVals);
    setMp2daValues(mp2daVals);
    setMp3raValues(mp3raVals);
  }, [receta]);

  const updateField = async (id, field, raw) => {
    const data = {};
    const numeric = [
      "cantidad_base",
      "cantidad_real",
      "mpUtilizada",
      "mp1ra",
      "mp2da",
      "mp3ra",
    ];
    data[field] = numeric.includes(field)
      ? raw === ""
        ? null
        : Number(raw)
      : raw;
    console.log("Updating field:", { id, pedidoId, data }); // Log data being sent
    try {
      await updateLinea({ id, pedidoId, data }).unwrap();
      toast({
        status: "success",
        duration: 1500,
        description: "Campo actualizado",
      });
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
      mt={4}
    >
      <TableContainer maxH="360px" overflowY="auto">
        <Table size="sm" variant="striped" sx={{ tableLayout: "fixed" }}>
          <Thead
            bg={headBg}
            color={headColor}
            position="sticky"
            top={0}
            zIndex={1}
          >
            <Tr>
              <Th w="40px" px={2} />
              <Th w="80px" px={4} textTransform="uppercase" fontWeight="bold">No.</Th>
              <Th minW="250px" px={4} textTransform="uppercase" fontWeight="bold">Descripción</Th>
              <Th w="80px" px={4} textTransform="uppercase" fontWeight="bold" isNumeric>MP Utilizada</Th>
              <Th w="80px" px={4} textTransform="uppercase" fontWeight="bold" isNumeric>MP 1ra</Th>
              <Th w="80px" px={4} textTransform="uppercase" fontWeight="bold" isNumeric>MP 2da</Th>
              <Th w="80px" px={4} textTransform="uppercase" fontWeight="bold" isNumeric>MP 3ra</Th>
              <Th w="80px" px={4} textTransform="uppercase" fontWeight="bold" isNumeric>Cant. real</Th>
              <Th w="80px" px={4} textTransform="uppercase" fontWeight="bold" isNumeric>Cant. base</Th>
              <Th w="80px" px={4} textTransform="uppercase" fontWeight="bold" isNumeric>Ctd. req.</Th>
              <Th w="80px" px={4} textTransform="uppercase" fontWeight="bold">Unidad</Th>
              <Th w="100px" px={4} textTransform="uppercase" fontWeight="bold">Almacén</Th>
            </Tr>
          </Thead>
          <Tbody>
            {receta.map((r, idx) => (
              <Tr
                key={r.id}
                bg={idx % 2 === 0 ? "transparent" : stripeBg}
                _hover={{ bg: hoverBg }}
              >
                <Td px={2} textAlign="center">
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
                <Td px={4}>{r.item}</Td>
                <Td px={4}>{r.descripcion || "-"}</Td>
                <Td px={4} isNumeric>
                  <Input
                    size="sm"
                    variant="outline"
                    borderWidth="1px"
                    borderColor={inputBorderColor}
                    borderRadius="sm"
                    _hover={{ borderColor: "green.400" }}
                    type="number"
                    value={mpUtilizadaValues[r.id] ?? ""}
                    onChange={(e) =>
                      setMpUtilizadaValues((prev) => ({
                        ...prev,
                        [r.id]: e.target.value,
                      }))
                    }
                    onBlur={(e) =>
                      updateField(r.id, "mpUtilizada", e.target.value)
                    }
                    textAlign="center"
                    focusBorderColor="green.400"
                  />
                </Td>
                <Td px={4} isNumeric>
                  <Input
                    size="sm"
                    variant="outline"
                    borderWidth="1px"
                    borderColor={inputBorderColor}
                    borderRadius="sm"
                    _hover={{ borderColor: "green.400" }}
                    type="number"
                    value={mp1raValues[r.id] ?? ""}
                    onChange={(e) =>
                      setMp1raValues((prev) => ({
                        ...prev,
                        [r.id]: e.target.value,
                      }))
                    }
                    onBlur={(e) => updateField(r.id, "mp1ra", e.target.value)}
                    textAlign="center"
                    focusBorderColor="green.400"
                  />
                </Td>
                <Td px={4} isNumeric>
                  <Input
                    size="sm"
                    variant="outline"
                    borderWidth="1px"
                    borderColor={inputBorderColor}
                    borderRadius="sm"
                    _hover={{ borderColor: "green.400" }}
                    type="number"
                    value={mp2daValues[r.id] ?? ""}
                    onChange={(e) =>
                      setMp2daValues((prev) => ({
                        ...prev,
                        [r.id]: e.target.value,
                      }))
                    }
                    onBlur={(e) => updateField(r.id, "mp2da", e.target.value)}
                    textAlign="center"
                    focusBorderColor="green.400"
                  />
                </Td>
                <Td px={4} isNumeric>
                  <Input
                    size="sm"
                    variant="outline"
                    borderWidth="1px"
                    borderColor={inputBorderColor}
                    borderRadius="sm"
                    _hover={{ borderColor: "green.400" }}
                    type="number"
                    value={mp3raValues[r.id] ?? ""}
                    onChange={(e) =>
                      setMp3raValues((prev) => ({
                        ...prev,
                        [r.id]: e.target.value,
                      }))
                    }
                    onBlur={(e) => updateField(r.id, "mp3ra", e.target.value)}
                    textAlign="center"
                    focusBorderColor="green.400"
                  />
                </Td>
                <Td px={4} isNumeric>
                  <Input
                    size="sm"
                    variant="outline"
                    borderWidth="1px"
                    borderColor={inputBorderColor}
                    borderRadius="sm"
                    _hover={{ borderColor: "green.400" }}
                    type="number"
                    value={realValues[r.id] ?? ""}
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
                <Td px={4} isNumeric>
                  <Text textAlign="center">{r.cantidad_base}</Text>
                </Td>
                <Td px={4} isNumeric>
                  <Text textAlign="center">{r.cantidad_requerida}</Text>
                </Td>
                <Td px={4}>
                  <Text textAlign="center">{r.nombre_unidad}</Text>
                </Td>
                <Td px={4}>{r.almacen_name || r.id_almacen}</Td>
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
      mpUtilizada: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      mp1ra: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      mp2da: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      mp3ra: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
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