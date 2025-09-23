import { useEffect, useState, memo, useCallback } from "react";
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
  Select,
} from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import {
  pedidoProduccionApi,
  useUpdateRecetaLineaMutation,
} from "../../services/pedidoProductionApi";

// Componente de Input Memoizado
const CustomInput = memo(function CustomInput({
  value,
  onChange,
  onBlur,
  ...props
}) {
  const [internalValue, setInternalValue] = useState(value);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const handleChange = (e) => {
    setInternalValue(e.target.value);
    onChange(e);
  };

  return (
    <Input
      value={internalValue ?? ""}
      onChange={handleChange}
      onBlur={onBlur}
      {...props}
    />
  );
});

CustomInput.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
};
CustomInput.displayName = "CustomInput";

// Componente de Fila de Tabla Memoizado
const MemoizedRecetaRow = memo(function MemoizedRecetaRow({
  r,
  idx,
  stripeBg,
  hoverBg,
  inputBorderColor,
  handleLocalChange,
  updateField,
  almacenes,
}) {
  return (
    <Tr bg={idx % 2 === 0 ? "transparent" : stripeBg} _hover={{ bg: hoverBg }}>
      <Td px={2} textAlign="center">
        <Checkbox
          isChecked={!!r.state}
          onChange={(e) => updateField(r.id, "state", e.target.checked)}
          size="sm"
          colorScheme="green"
        />
      </Td>
      <Td px={4}>{r.item}</Td>
      <Td px={4}>{r.descripcion || "-"}</Td>
      {["mpUtilizada", "mp1ra", "mp2da", "mp3ra", "cantidad_real"].map(
        (field) => (
          <Td key={field} px={4} isNumeric>
            <CustomInput
              size="sm"
              variant="outline"
              borderWidth="1px"
              borderColor={inputBorderColor}
              borderRadius="sm"
              _hover={{ borderColor: "green.400" }}
              type="number"
              value={r[field]}
              onChange={(e) => handleLocalChange(r.id, field, e.target.value)}
              onBlur={(e) => updateField(r.id, field, e.target.value)}
              textAlign="center"
              focusBorderColor="green.400"
            />
          </Td>
        )
      )}
      <Td px={4} isNumeric>
        <Text textAlign="center">{r.cantidad_base}</Text>
      </Td>
      <Td px={4} isNumeric>
        <Text textAlign="center">{r.cantidad_requerida}</Text>
      </Td>
      <Td px={4}>
        <Text textAlign="center">{r.nombre_unidad}</Text>
      </Td>
      <Td px={4}>
        <Select
          size="sm"
          value={r.id_almacen}
          onChange={(e) => updateField(r.id, "id_almacen", e.target.value)}
          isDisabled={!almacenes.length}
        >
          {almacenes.map((almacen) => (
            <option key={almacen.id} value={almacen.id}>
              {almacen.name}
            </option>
          ))}
        </Select>
      </Td>
    </Tr>
  );
});

MemoizedRecetaRow.propTypes = {
  r: PropTypes.object.isRequired,
  idx: PropTypes.number.isRequired,
  stripeBg: PropTypes.string.isRequired,
  hoverBg: PropTypes.string.isRequired,
  inputBorderColor: PropTypes.string.isRequired,
  handleLocalChange: PropTypes.func.isRequired,
  updateField: PropTypes.func.isRequired,
  almacenes: PropTypes.arrayOf(PropTypes.object).isRequired,
};
MemoizedRecetaRow.displayName = "MemoizedRecetaRow";

export const RecetaTable = ({ pedidoId, receta, isLoading = false, almacenes = [] }) => {
  const [updateLinea] = useUpdateRecetaLineaMutation();
  const toast = useToast();
  const dispatch = useDispatch();

  const headBg = useColorModeValue("green.100", "green.700");
  const inputBorderColor = useColorModeValue("gray.300", "gray.600");
  const headColor = useColorModeValue("gray.800", "whiteAlpha.900");
  const stripeBg = useColorModeValue("gray.50", "gray.800");
  const hoverBg = useColorModeValue("gray.100", "gray.600");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  const handleLocalChange = useCallback(
    (id, field, value) => {
      dispatch(
        pedidoProduccionApi.util.updateQueryData(
          "getRecetaByPedido",
          pedidoId,
          (draft) => {
            const line = draft.find((line) => line.id === id);
            if (line) {
              line[field] = value === "" ? null : Number(value);
            }
          }
        )
      );
    },
    [dispatch, pedidoId]
  );

  const updateField = useCallback(
    async (id, field, raw) => {
      const isNumeric = [
        "cantidad_base",
        "cantidad_real",
        "mpUtilizada",
        "mp1ra",
        "mp2da",
        "mp3ra",
      ].includes(field);

      const value = isNumeric ? (raw === "" ? null : Number(raw)) : raw;

      try {
        await updateLinea({ id, pedidoId, data: { [field]: value } }).unwrap();
        toast({
          status: "success",
          duration: 1500,
          description: "Campo actualizado",
          isClosable: true,
        });
      } catch {
        toast({
          status: "error",
          description: "Error al guardar",
          duration: 3000,
          isClosable: true,
        });
        // Revert optimistic update on error
        dispatch(
          pedidoProduccionApi.util.invalidateTags([
            { type: "Receta", id: pedidoId },
          ])
        );
      }
    },
    [dispatch, pedidoId, toast, updateLinea]
  );

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
            style={{ wordWrap: "break-word", whiteSpace: "normal" }}
          >
            <Tr>
              <Th w="40px" px={2} />
              <Th
                w="90px"
                px={4}
                textTransform="uppercase"
                fontWeight="bold"
                isTruncated
              >
                No.
              </Th>
              <Th
                minW="250px"
                px={4}
                textTransform="uppercase"
                fontWeight="bold"
                isTruncated
              >
                Descripción
              </Th>
              <Th
                w="85px"
                px={0}
                textTransform="uppercase"
                fontWeight="bold"
                isNumeric
                isTruncated
              >
                MP Utilizada
              </Th>
              <Th
                w="85px"
                px={2}
                textTransform="uppercase"
                fontWeight="bold"
                isNumeric
                isTruncated
              >
                MP 1ra
              </Th>
              <Th
                w="85px"
                px={2}
                textTransform="uppercase"
                fontWeight="bold"
                isNumeric
                isTruncated
              >
                MP 2da
              </Th>
              <Th
                w="85px"
                px={2}
                textTransform="uppercase"
                fontWeight="bold"
                isNumeric
                isTruncated
              >
                MP 3ra
              </Th>
              <Th
                w="85px"
                px={1}
                textTransform="uppercase"
                fontWeight="bold"
                isNumeric
                isTruncated
              >
                Cant. real
              </Th>
              <Th
                w="85px"
                px={1}
                textTransform="uppercase"
                fontWeight="bold"
                isNumeric
                isTruncated
              >
                Cant. base
              </Th>
              <Th
                w="85px"
                px={2}
                textTransform="uppercase"
                fontWeight="bold"
                isNumeric
                isTruncated
              >
                Ctd. req.
              </Th>
              <Th
                w="80px"
                px={2}
                textTransform="uppercase"
                fontWeight="bold"
                isTruncated
              >
                Unidad
              </Th>
              <Th
                w="150px"
                px={4}
                textTransform="uppercase"
                fontWeight="bold"
                isTruncated
              >
                Almacén
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {receta.map((r, idx) => (
              <MemoizedRecetaRow
                key={r.id}
                r={r}
                idx={idx}
                stripeBg={stripeBg}
                hoverBg={hoverBg}
                inputBorderColor={inputBorderColor}
                handleLocalChange={handleLocalChange}
                updateField={updateField}
                almacenes={almacenes}
              />
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
      id_almacen: PropTypes.number,
    })
  ).isRequired,
  isLoading: PropTypes.bool,
  almacenes: PropTypes.arrayOf(PropTypes.object).isRequired,
};
