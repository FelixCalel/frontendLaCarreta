import { memo, useCallback, useMemo, Fragment } from "react";
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
  useUpdatePedidoProduccionMutation,
  useUpdateMultiplePedidosProduccionMutation,
  useGetRechazoByPedidoProduccionIdQuery,
} from "../../services/pedidoProductionApi";
import { debounce } from "lodash";
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
    const [updatePedido] = useUpdatePedidoProduccionMutation();
    const [updateMultiplePedidos] =
      useUpdateMultiplePedidosProduccionMutation();
    const toast = useToast();

    const primaryOrder = item.originalItems[0];
    const pedidoId = primaryOrder?.id;

    const rechazoQty = useMemo(
      () =>
        item.originalItems.reduce(
          (sum, i) => sum + (Number(i.cantidadRechazada) || 0),
          0,
        ),
      [item.originalItems],
    );

    const handleTrazabilidadUpdate = useCallback(
      (value) => {
        if (!pedidoId) return;
        updatePedido({
          id: pedidoId,
          data: { trazabilidad_Prod: value },
        })
          .unwrap()
          .catch((err) => {
            console.error("Error updating trazabilidad:", err);
            toast({
              title: "Error",
              description: "No se pudo actualizar la trazabilidad",
              status: "error",
            });
          });
      },
      [pedidoId, updatePedido, toast],
    );

    const debouncedTrazabilidadUpdate = useMemo(
      () => debounce(handleTrazabilidadUpdate, 500),
      [handleTrazabilidadUpdate],
    );

    const inputBg = useColorModeValue("white", "gray.800");
    const inputBorder = useColorModeValue("gray.300", "gray.600");

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
              onChange={() => onToggleSelection(item.productoNombre)}
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
          <Td px={2} py={2} fontWeight="bold" fontSize="sm">
            {item.productoNombre}
          </Td>
          <Td px={2} py={2}>
            <Input
              size="xs"
              width="80px"
              defaultValue={primaryOrder?.trazabilidad_Prod || ""}
              placeholder="-"
              onChange={(e) => debouncedTrazabilidadUpdate(e.target.value)}
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
        </Tr>
        {isExpanded && (
          <Tr>
            <Td colSpan={9} p={0} border="none">
              <ConsolidatedExpandedRow
                item={item}
                isExpanded={isExpanded}
                rechazoQty={rechazoQty}
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
