import {
  memo,
  useCallback,
  useMemo,
  Fragment,
  useState,
  useEffect,
} from "react";
import PropTypes from "prop-types";
import {
  Tr,
  Td,
  Checkbox,
  Icon,
  Input,
  Box,
  Text,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { ChevronRightIcon, ChevronDownIcon } from "@chakra-ui/icons";
import {
  useUpdateMultiplePedidosProduccionMutation,
  useGetRechazoByPedidoProduccionIdQuery,
  useGetAlmacenesQuery,
} from "../../services/pedidoProductionApi";
import debounce from "lodash/debounce";
import { ConsolidatedExpandedRow } from "./ConsolidatedExpandedRow";

export const ConsolidatedOrderRow = memo(
  ({
    item,
    isExpanded,
    onToggleExpand,
    isSelected,
    onToggleSelection,
    summaryRowBg,
    summaryRowHoverBg,
    summaryRowBorderColor,
  }) => {
    const [updateMultiplePedidos] =
      useUpdateMultiplePedidosProduccionMutation();
    const { data: almacenes = [] } = useGetAlmacenesQuery();
    const toast = useToast();

    const primaryOrder = item.originalItems[0];

    const defaultAlmacenId = useMemo(() => {
      if (primaryOrder?.id_almacen) return String(primaryOrder.id_almacen);
      if (primaryOrder?.almacen?.id) return String(primaryOrder.almacen.id);

      if (primaryOrder?.codigoAlmacen && almacenes.length > 0) {
        const code = String(primaryOrder.codigoAlmacen).trim();
        const match = almacenes.find(
          (a) =>
            String(a.name).trim() === code || String(a.name).includes(code),
        );
        if (match) return String(match.id);
      }
      return "";
    }, [primaryOrder, almacenes]);

    const [almacenId, setAlmacenId] = useState(defaultAlmacenId);

    useEffect(() => {
      setAlmacenId(defaultAlmacenId);
    }, [defaultAlmacenId]);

    const rechazoQty = useMemo(
      () =>
        item.originalItems.reduce(
          (sum, i) => sum + (Number(i.cantidadRechazada) || 0),
          0,
        ),
      [item.originalItems],
    );

    const handleTrazabilidadUpdate = useCallback(
      async (value) => {
        const idsToUpdate = item.originalItems.map((subItem) => subItem.id);
        if (idsToUpdate.length === 0) return;

        const normalizedValue = String(value ?? "").trim();

        try {
          await updateMultiplePedidos({
            ids: idsToUpdate,
            data: { trazabilidad_Prod: normalizedValue },
          }).unwrap();
        } catch (err) {
          console.error("Error updating consolidated trazabilidad:", err);
          toast({
            title: "Error",
            description: "No se pudo actualizar la trazabilidad",
            status: "error",
          });
        }
      },
      [item.originalItems, updateMultiplePedidos, toast],
    );

    const debouncedTrazabilidadUpdate = useMemo(
      () => debounce(handleTrazabilidadUpdate, 500),
      [handleTrazabilidadUpdate],
    );

    useEffect(() => {
      return () => {
        debouncedTrazabilidadUpdate.cancel();
      };
    }, [debouncedTrazabilidadUpdate]);

    const [localTrazabilidad, setLocalTrazabilidad] = useState(
      primaryOrder?.trazabilidad_Prod || "",
    );

    useEffect(() => {
      setLocalTrazabilidad(primaryOrder?.trazabilidad_Prod || "");
    }, [primaryOrder?.trazabilidad_Prod]);

    const handleTrazabilidadChange = (e) => {
      const val = e.target.value;
      setLocalTrazabilidad(val);
      debouncedTrazabilidadUpdate(val);
    };

    const inputBg = useColorModeValue("white", "gray.800");
    const inputBorder = useColorModeValue("gray.300", "gray.600");
    const selectBorderColor = useColorModeValue("#E2E8F0", "#4A5568");
    const selectColor = useColorModeValue("#2D3748", "#EDF2F7");
    const selectBg = useColorModeValue("#fff", "#2D3748");
    const optionColor = useColorModeValue("#222", "#fff");
    const optionBg = useColorModeValue("#fff", "#222");

    const isGroupComplete =
      item.originalItems.length > 0 &&
      item.originalItems.every((i) => i.completo);

    const handleCheckboxChange = async (e) => {
      const newCheckedState = e.target.checked;
      const idsToUpdate = item.originalItems.map((subItem) => subItem.id);

      try {
        await updateMultiplePedidos({
          ids: idsToUpdate,
          data: { completo: newCheckedState },
        }).unwrap();
      } catch (err) {
        console.error("Error updating completion status:", err);
        toast({
          title: "Error",
          description: "No se pudo actualizar el estado de completado",
          status: "error",
        });
      }
    };

    const handleAlmacenChange = async (newId) => {
      setAlmacenId(newId);
      const idsToUpdate = item.originalItems.map((subItem) => subItem.id);

      try {
        await updateMultiplePedidos({
          ids: idsToUpdate,
          data: { id_almacen: newId ? Number(newId) : null },
        }).unwrap();
      } catch (err) {
        console.error("Error updating warehouse:", err);
        setAlmacenId(
          primaryOrder?.id_almacen ? String(primaryOrder.id_almacen) : "",
        );
        toast({
          title: "Error",
          description: "No se pudo actualizar el almacén",
          status: "error",
        });
      }
    };

    const solicitud = item.cantidadUnidad;
    const procesado = (item.cantidad || 0) + rechazoQty;
    const faltante = solicitud - ((item.cantidad || 0) + rechazoQty);

    return (
      <Fragment>
        <Tr
          bg={isExpanded ? summaryRowHoverBg : summaryRowBg}
          _hover={{ bg: summaryRowHoverBg }}
          borderBottom="1px solid"
          borderColor={summaryRowBorderColor}
          transition="background 0.2s"
        >
          <Td w="36px" px={2} py={2}>
            <Checkbox
              isChecked={isSelected}
              onChange={() => onToggleSelection(`${item.deudorCodigo || ""}|${item.productoNombre}`)}
              size="md"
              colorScheme="green"
              borderColor="gray.500"
            />
          </Td>
          <Td w="36px" px={2} py={2}>
            <Icon
              as={isExpanded ? ChevronDownIcon : ChevronRightIcon}
              boxSize={5}
              cursor="pointer"
              onClick={() => onToggleExpand(item.id)}
              color="gray.500"
            />
          </Td>
          <Td px={2} py={2}>
            <Box>
              <Text fontWeight="bold" fontSize="sm">
                {item.productoNombre}
              </Text>
              <Text fontSize="xs" color="gray.500" mt={0.5}>
                {item.itemCode || "N/A"}
              </Text>
            </Box>
          </Td>
          <Td px={2} py={2}>
            <Input
              size="xs"
              width="80px"
              value={localTrazabilidad}
              placeholder="-"
              onChange={handleTrazabilidadChange}
              bg={inputBg}
              borderColor={inputBorder}
            />
          </Td>
          <Td px={2} py={2} textAlign="center">
            <Box>
              <Text fontWeight="bold" fontSize="md" color="blue.500">
                {solicitud ?? "-"}
              </Text>
              <Text fontSize="2xs" color="gray.400" textTransform="uppercase">
                Solicita
              </Text>
            </Box>
          </Td>
          <Td px={2} py={2} textAlign="center">
            <Checkbox
              isChecked={isGroupComplete}
              onChange={handleCheckboxChange}
              size="md"
              colorScheme="green"
              cursor="pointer"
              borderColor="gray.500"
            />
          </Td>
          <Td px={2} py={2} textAlign="center">
            <Box>
              <Text fontWeight="bold" fontSize="md" color="green.500">
                {procesado}
              </Text>
              <Text fontSize="2xs" color="gray.400" textTransform="uppercase">
                Procesado
              </Text>
            </Box>
          </Td>
          <Td px={2} py={2} textAlign="center">
            <Box>
              <Text
                fontWeight="bold"
                fontSize="md"
                color={faltante > 0 ? "red.400" : "gray.400"}
              >
                {faltante}
              </Text>
              <Text fontSize="2xs" color="gray.400" textTransform="uppercase">
                Faltante
              </Text>
            </Box>
          </Td>
          <Td px={2} py={2} textAlign="right">
            <Box
              display="inline-flex"
              flexDirection="column"
              alignItems="flex-end"
            >
              <select
                value={almacenId}
                onChange={(e) => handleAlmacenChange(e.target.value)}
                style={{
                  fontSize: "12px",
                  padding: "2px 4px",
                  borderRadius: "4px",
                  border: "1px solid",
                  borderColor: selectBorderColor,
                  color: selectColor,
                  background: selectBg,
                  cursor: "pointer",
                  outline: "none",
                  width: "100%",
                  maxWidth: "100px",
                }}
              >
                <option value="">-- Seleccionar --</option>
                {almacenes.map((almacen) => (
                  <option
                    key={almacen.id}
                    value={almacen.id}
                    style={{
                      color: optionColor,
                      background: optionBg,
                    }}
                  >
                    {almacen.nombre || almacen.name}
                  </option>
                ))}
              </select>
            </Box>
          </Td>
        </Tr>
        {isExpanded && (
          <Tr>
            <Td colSpan={10} p={0} border="none">
              <ConsolidatedExpandedRow
                item={item}
                isExpanded={isExpanded}
                rechazoQty={rechazoQty}
                trazabilidad={localTrazabilidad}
              />
            </Td>
          </Tr>
        )}
      </Fragment>
    );
  },
);

ConsolidatedOrderRow.displayName = "ConsolidatedOrderRow";

ConsolidatedOrderRow.propTypes = {
  item: PropTypes.object.isRequired,
  isExpanded: PropTypes.bool.isRequired,
  onToggleExpand: PropTypes.func.isRequired,
  isSelected: PropTypes.bool.isRequired,
  onToggleSelection: PropTypes.func.isRequired,
  summaryRowBg: PropTypes.string,
  summaryRowHoverBg: PropTypes.string,
  summaryRowBorderColor: PropTypes.string,
};
