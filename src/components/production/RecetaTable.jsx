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
  useDisclosure,
  Flex,
  Button,
} from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { AddIcon } from "@chakra-ui/icons";
import {
  pedidoProduccionApi,
  useUpdateRecetaLineaMutation,
} from "../../services/pedidoProductionApi";
import AddMaterialModal from "./modals/AddMaterialModal";

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
      value={
        internalValue === 0 || internalValue === "0"
          ? ""
          : (internalValue ?? "")
      }
      placeholder="0"
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

const OptimisticCheckbox = memo(({ isChecked, onChange }) => {
  const [checked, setChecked] = useState(isChecked);

  useEffect(() => {
    setChecked(isChecked);
  }, [isChecked]);

  const handleChange = (e) => {
    const newValue = e.target.checked;
    setChecked(newValue);
    onChange(newValue);
  };

  return (
    <Checkbox
      isChecked={checked}
      onChange={handleChange}
      size="sm"
      colorScheme="green"
      borderColor={useColorModeValue("gray.300", "gray.500")}
    />
  );
});
OptimisticCheckbox.displayName = "OptimisticCheckbox";

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
  const optionBg = useColorModeValue("white", "gray.700");

  return (
    <Tr bg={idx % 2 === 0 ? "transparent" : stripeBg} _hover={{ bg: hoverBg }}>
      <Td px={2} py={2} textAlign="center">
        <OptimisticCheckbox
          isChecked={!!r.state}
          onChange={(newValue) => {
            setTimeout(() => {
              console.log(
                "[RecetaTable] Optimistic update for:",
                r.id,
                newValue,
              );
              handleLocalChange(r.id, "state", newValue);
              updateField(r.id, "state", newValue);
            }, 50);
          }}
        />
      </Td>
      {/* <Td px={1} py={2} textAlign="center">
        <Text fontSize="xs" fontWeight="bold" color="gray.500">
          {idx + 1}
        </Text>
      </Td> */}
      <Td px={2} py={2}>
        <Box>
          <Text
            fontSize="xs"
            fontWeight="semibold"
            color={useColorModeValue("gray.700", "white")}
          >
            {r.item}
          </Text>
          {r.descripcion && (
            <Text fontSize="2xs" color="gray.500" title={r.descripcion}>
              {r.descripcion}
            </Text>
          )}
        </Box>
      </Td>
      {["mpUtilizada", "cantidad_real"].map((field) => (
        <Td key={field} px={1} py={2} isNumeric>
          <CustomInput
            size="xs"
            variant="outline"
            bg={useColorModeValue("white", "gray.800")}
            borderWidth="1px"
            borderColor={inputBorderColor}
            borderRadius="sm"
            _hover={{ borderColor: "blue.400" }}
            type="number"
            value={r[field]}
            onChange={(e) => handleLocalChange(r.id, field, e.target.value)}
            onBlur={(e) => updateField(r.id, field, e.target.value)}
            textAlign="center"
            focusBorderColor="blue.400"
            fontWeight="medium"
            w="56px"
          />
        </Td>
      ))}
      <Td px={1} py={2} textAlign="center">
        <Text fontSize="xs" color="gray.600">
          {r.cantidad_base}
        </Text>
      </Td>
      <Td px={1} py={2} textAlign="center">
        <Text fontSize="xs" fontWeight="bold" color="blue.600">
          {r.cantidad_requerida}
        </Text>
      </Td>
      <Td px={1} py={2}>
        <Select
          size="xs"
          h="24px"
          fontSize="xs"
          value={r.nombre_unidad}
          onChange={(e) => updateField(r.id, "nombre_unidad", e.target.value)}
          bg={useColorModeValue("white", "gray.700")}
          borderRadius="md"
          variant="filled"
          _focus={{ borderColor: "blue.400" }}
          width="70px"
        >
          {["Unidad", "Libra", "KG", "Gramos", "Litro", "ML", "Onza"].map(
            (unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ),
          )}
        </Select>
      </Td>
      <Td px={1} py={2} textAlign="center">
        <Select
          size="xs"
          h="24px"
          fontSize="xs"
          value={r.id_almacen}
          onChange={(e) => updateField(r.id, "id_almacen", e.target.value)}
          isDisabled={!almacenes.length}
          bg={optionBg}
          borderRadius="md"
          variant="filled"
          _focus={{ bg: optionBg, borderColor: "blue.400" }}
          textAlign="center"
          sx={{ textAlignLast: "center" }}
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

export const RecetaTable = ({
  pedidoId,
  receta,
  isLoading = false,
  almacenes = [],
}) => {
  const [updateLinea] = useUpdateRecetaLineaMutation();
  const toast = useToast();
  const dispatch = useDispatch();
  const headBg = useColorModeValue("gray.100", "gray.700");
  const inputBorderColor = useColorModeValue("gray.300", "gray.600");
  const headColor = useColorModeValue("gray.700", "gray.200");
  const stripeBg = useColorModeValue("gray.50", "gray.800");
  const hoverBg = useColorModeValue("blue.50", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  const handleLocalChange = useCallback(
    (id, field, value) => {
      dispatch(
        pedidoProduccionApi.util.updateQueryData(
          "getRecetaByPedido",
          { pedidoId: Number(pedidoId) },
          (draft) => {
            console.log("[RecetaTable] Updating cache for pedido:", pedidoId);
            const line = draft.find((line) => line.id === id);
            if (line) {
              console.log("[RecetaTable] Found line:", id, "Setting:", value);
              if (typeof value === "boolean") {
                line[field] = value;
              } else {
                line[field] = value === "" ? null : Number(value);
              }
            } else {
              console.warn("[RecetaTable] Line not found in cache:", id);
            }
          },
        ),
      );
    },
    [dispatch, pedidoId],
  );

  const updateField = useCallback(
    async (id, field, raw) => {
      const isNumeric = [
        "cantidad_base",
        "cantidad_real",
        "mpUtilizada",
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
        dispatch(
          pedidoProduccionApi.util.invalidateTags([
            { type: "Receta", id: pedidoId },
          ]),
        );
      }
    },
    [dispatch, pedidoId, toast, updateLinea],
  );

  const { isOpen, onOpen, onClose } = useDisclosure();

  if (isLoading) {
    return (
      <Box py={4} textAlign="center">
        <Spinner size="sm" />
      </Box>
    );
  }

  return (
    <Box mt={2}>
      <Flex justify="space-between" align="center" mb={2}>
        <Text
          fontSize="xs"
          fontWeight="bold"
          color="gray.500"
          textTransform="uppercase"
          letterSpacing="wide"
        >
          Lista de Materiales (Receta)
        </Text>
        <Button
          size="xs"
          colorScheme="blue"
          variant="outline"
          leftIcon={<AddIcon />}
          onClick={onOpen}
        >
          Agregar
        </Button>
      </Flex>

      <AddMaterialModal isOpen={isOpen} onClose={onClose} pedidoId={pedidoId} />

      <Box
        borderWidth="1px"
        borderColor={borderColor}
        borderRadius="md"
        overflow="hidden"
        bg={useColorModeValue("white", "gray.800")}
      >
        <TableContainer maxH="400px" overflowY="auto">
          <Table size="sm" variant="simple">
            <Thead bg={headBg} position="sticky" top={0} zIndex={10}>
              <Tr>
                <Th w="40px" px={2} py={2} color={headColor} fontSize="2xs">
                  Activo
                </Th>
                {/* <Th
                  w="40px"
                  px={1}
                  py={2}
                  color={headColor}
                  fontSize="2xs"
                  textAlign="center"
                >
                  #
                </Th> */}
                <Th minW="180px" px={2} py={2} color={headColor} fontSize="2xs">
                  Material
                </Th>
                <Th
                  w="65px"
                  px={1}
                  py={2}
                  color={headColor}
                  fontSize="2xs"
                  textAlign="center"
                  isNumeric
                >
                  MP Utilizada
                </Th>
                <Th
                  w="65px"
                  px={1}
                  py={2}
                  color={headColor}
                  fontSize="2xs"
                  textAlign="center"
                  isNumeric
                >
                  Cant. Real
                </Th>
                <Th
                  w="80px"
                  px={1}
                  py={2}
                  color={headColor}
                  fontSize="2xs"
                  textAlign="center"
                >
                  C. Base
                </Th>
                <Th
                  w="80px"
                  px={1}
                  py={2}
                  color={headColor}
                  fontSize="2xs"
                  textAlign="center"
                >
                  C. Req.
                </Th>
                <Th w="0px" px={2} py={2} color={headColor} fontSize="2xs">
                  Unidad
                </Th>
                <Th
                  w="100px"
                  px={0}
                  py={2}
                  color={headColor}
                  fontSize="2xs"
                  textAlign="center"
                >
                  Almacén MP
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {receta.length === 0 ? (
                <Tr>
                  <Td colSpan={8} textAlign="center" py={4} color="gray.500">
                    <Text fontSize="sm">
                      No hay materiales registrados en la receta.
                    </Text>
                  </Td>
                </Tr>
              ) : (
                receta.map((r, idx) => (
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
                ))
              )}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
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
    }),
  ).isRequired,
  isLoading: PropTypes.bool,
  almacenes: PropTypes.arrayOf(PropTypes.object).isRequired,
};
