import { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import {
  Tr,
  Td,
  Checkbox,
  IconButton,
  Collapse,
  Box,
  Flex,
  Text,
  useColorModeValue,
  Button,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { ChevronRightIcon, ChevronDownIcon } from "@chakra-ui/icons";
import {
  useGetDetallesYProduccionQuery,
  useUpdatePedidoProduccionMutation,
  useGetRecetaByPedidoQuery,
  useCreateRechazoMutation,
  useUpdateRechazoMutation,
  useGetRechazoByPedidoProduccionIdQuery,
} from "../../services/pedidoProductionApi";
import { OrderDetailsTable } from "./OrderDetailsTable";
import { RecetaTable } from "./RecetaTable";
import { skipToken } from "@reduxjs/toolkit/query";
import { RechazoModal } from "../modals/RechazoModal";
import { OrderProductionRegistry } from "./OrderProductionRegistry";
import { OrderWarehouseSelector } from "./OrderWarehouseSelector";

export const OrderRow = ({
  order,
  isExpanded,
  onToggle,
  sx = {},
  almacenes = [],
  index = 0,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const shouldFetch = isExpanded;

  const { data: rechazoData } = useGetRechazoByPedidoProduccionIdQuery(
    order.id,
    {
      skip: !order.id,
    },
  );
  const rechazoQty = rechazoData?.cantidadRechazada || 0;

  const recetaArg = shouldFetch ? { pedidoId: Number(order.id) } : skipToken;

  const {
    data: receta = [],
    isLoading: loadingReceta,
    isSuccess,
    isError,
    error,
  } = useGetRecetaByPedidoQuery(recetaArg);
  const hasReceta = receta && receta.length > 0;
  const [updatePedido] = useUpdatePedidoProduccionMutation();
  const [createRechazo, { isLoading: isCreatingRechazo }] =
    useCreateRechazoMutation();
  const [updateRechazo, { isLoading: isUpdatingRechazo }] =
    useUpdateRechazoMutation();
  const [isPTMQ, setIsPTMQ] = useState(order.ptmq ?? false);
  const [cantidadLocal, setCantidadLocal] = useState(
    Number(order.cantidad) || 0,
  );
  const [faltanteLocal, setFaltanteLocal] = useState(
    (Number(order.cantidadUnidad) || 0) - (Number(order.cantidad) || 0),
  );
  const {
    data: details = [],
    isLoading: loadingDetalles,
    refetch: refetchDetalles,
  } = useGetDetallesYProduccionQuery(shouldFetch ? order.id : skipToken);

  useEffect(() => {
    if (isSuccess) {
      console.log("[OrderRow] RECETA OK", receta);
    }
    if (isError) {
      console.error("[OrderRow] RECETA ERROR", error);
    }
  }, [isSuccess, isError, receta, error]);

  useEffect(() => {
    setCantidadLocal((order.cantidad ?? 0) + rechazoQty);
    setFaltanteLocal(
      (order.cantidadUnidad ?? 0) - ((order.cantidad ?? 0) + rechazoQty),
    );
  }, [order.cantidad, order.cantidadUnidad, rechazoQty]);

  useEffect(() => setIsPTMQ(order.ptmq), [order.ptmq]);

  useEffect(() => {
    if (shouldFetch) {
      refetchDetalles?.();
    }
  }, [shouldFetch, refetchDetalles]);

  useEffect(() => {
    if (isSuccess && receta.length === 0 && !order.ptmq) {
      updatePedido({ id: order.id, data: { ptmq: true } }).catch(() => {});
    }
  }, [isSuccess, receta.length, order.ptmq, order.id, updatePedido]);

  const handlePTMQToggle = async (checked) => {
    try {
      await updatePedido({ id: order.id, data: { ptmq: checked } }).unwrap();
      setIsPTMQ(checked);
    } catch {
      setIsPTMQ(order.ptmq);
    }
  };

  const handleUpdateStats = (newCantidad, newFaltante) => {
    setCantidadLocal(newCantidad + rechazoQty);
    setFaltanteLocal(newFaltante);
  };

  const [completoLocal, setCompletoLocal] = useState(order.completo);

  useEffect(() => {
    setCompletoLocal(order.completo);
  }, [order.completo]);

  const handleCompletoChange = (checked) => {
    setCompletoLocal(checked);
    updatePedido({ id: order.id, data: { completo: checked } })
      .unwrap()
      .catch(() => setCompletoLocal(!checked));
  };

  const handleSaveRechazo = async ({ formData, existingRechazo }) => {
    try {
      if (existingRechazo) {
        await updateRechazo({
          id: existingRechazo.id,
          data: formData,
          id_pedidoProd: order.id,
        }).unwrap();
      } else {
        await createRechazo({ ...formData, id_pedidoProd: order.id }).unwrap();
      }
      onClose();
    } catch (err) {
      console.error("Failed to save rechazo:", err);
    }
  };

  const stripeColor = useColorModeValue("gray.50", "gray.800");
  const bgOdd = useColorModeValue("white", "gray.900");
  const bgEven = useColorModeValue("gray.100", "gray.800");
  const rowBg = index % 2 === 0 ? bgOdd : bgEven;

  const hoverBg = useColorModeValue("gray.200", "gray.600");
  const panelBg = useColorModeValue("gray.50", "gray.800");
  const borderColor = useColorModeValue("gray.100", "gray.700");
  const collapseBg = useColorModeValue("gray.50", "gray.900");

  const memoizedRecetaTable = useMemo(
    () => (
      <RecetaTable
        pedidoId={order.id}
        receta={receta}
        isLoading={loadingReceta}
        almacenes={almacenes}
      />
    ),
    [order.id, receta, loadingReceta, almacenes],
  );

  return (
    <>
      <Tr
        bg={rowBg}
        _hover={{ bg: hoverBg }}
        transition="all 0.2s"
        sx={sx}
        borderBottomWidth="1px"
        borderColor={borderColor}
      >
        <Td px={2} py={2}>
          <IconButton
            size="xs"
            icon={
              isExpanded ? (
                <ChevronDownIcon boxSize={4} />
              ) : (
                <ChevronRightIcon boxSize={4} />
              )
            }
            aria-label="Expandir"
            onClick={() => onToggle(order.id)}
            variant="ghost"
            colorScheme="blue"
            borderRadius="full"
          />
        </Td>
        <Td px={2} py={2}>
          <Box>
            <Text
              fontWeight="bold"
              fontSize="sm"
              color={useColorModeValue("gray.700", "white")}
            >
              {order.productoNombre}
            </Text>
            <Text fontSize="xs" color="gray.500" mt={0.5}>
              {order.itemCode || "N/A"}
            </Text>
            {order.comentario_sap &&
              !order.comentario_sap.includes("Avance automático") && (
                <Text
                  fontSize="xs"
                  color="orange.500"
                  fontStyle="italic"
                  mt={1}
                >
                  "{order.comentario_sap}"
                </Text>
              )}
          </Box>
        </Td>
        <Td px={2} py={2}>
          <Box>
            <Text fontSize="xs" fontWeight="medium">
              {order.pais}
            </Text>
            <Text fontSize="xs" color="gray.500">
              {order.tienda}
            </Text>
          </Box>
        </Td>
        <Td px={2} py={2} textAlign="center">
          <Box>
            <Text fontWeight="bold" fontSize="md" color="blue.500">
              {order.cantidadUnidad ?? "-"}
            </Text>
            <Text fontSize="2xs" color="gray.400" textTransform="uppercase">
              Solicita
            </Text>
          </Box>
        </Td>
        <Td px={2} py={2} textAlign="center">
          <Checkbox
            isChecked={completoLocal}
            size="md"
            colorScheme="green"
            onChange={(e) => handleCompletoChange(e.target.checked)}
          />
        </Td>
        <Td px={2} py={2} textAlign="center">
          <Box>
            <Text fontWeight="bold" fontSize="md" color="green.500">
              {cantidadLocal}
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
              color={faltanteLocal > 0 ? "red.400" : "gray.400"}
            >
              {faltanteLocal}
            </Text>
            <Text fontSize="2xs" color="gray.400" textTransform="uppercase">
              Faltante
            </Text>
          </Box>
        </Td>
        <Td px={2} py={2} textAlign="right">
          <OrderWarehouseSelector order={order} almacenes={almacenes} />
        </Td>
      </Tr>

      <Tr>
        <Td colSpan={8} p={0} border="none">
          <Collapse in={isExpanded} animateOpacity>
            <Box
              pl={2}
              pr={1}
              py={2}
              bg={collapseBg}
              borderBottomWidth="1px"
              borderColor="gray.200"
            >
              <Flex gap={4} direction={{ base: "column", xl: "row" }}>
                <Box width="fit-content">
                  <OrderProductionRegistry
                    order={order}
                    rechazoQty={rechazoQty}
                    onUpdateStats={handleUpdateStats}
                    onOpenRechazo={onOpen}
                  />

                  <Box>
                    <OrderDetailsTable
                      details={details}
                      isLoading={loadingDetalles}
                      showPTMQ={!hasReceta}
                      isPTMQ={isPTMQ}
                      onTogglePTMQ={handlePTMQToggle}
                    />
                  </Box>
                </Box>

                <Box flex="1">{memoizedRecetaTable}</Box>
              </Flex>
            </Box>
          </Collapse>
          {isOpen && (
            <RechazoModal
              isOpen={isOpen}
              onClose={onClose}
              pedidoProduccionId={order.id}
              onSave={handleSaveRechazo}
              isLoading={isCreatingRechazo || isUpdatingRechazo}
              trazabilidadPadre={order.trazabilidad_Prod}
              maxQuantity={Number(order.cantidadUnidad) || 0}
              currentMpUtilizada={Number(order.mpUtilizada) || 0}
            />
          )}
        </Td>
      </Tr>
    </>
  );
};

OrderRow.propTypes = {
  order: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    productoNombre: PropTypes.string.isRequired,
    pais: PropTypes.string.isRequired,
    tienda: PropTypes.string.isRequired,
    cantidadUnidad: PropTypes.number,
    cantidad: PropTypes.number,
    faltante: PropTypes.number,
    completo: PropTypes.bool.isRequired,
    mpUtilizada: PropTypes.number,
    mp1ra: PropTypes.number,
    mp2da: PropTypes.number,
    mp3ra: PropTypes.number,
    mpSobrante: PropTypes.number,
    rechazoId: PropTypes.number,
    basura: PropTypes.number,
    trazabilidad_Prod: PropTypes.string,
    ptmq: PropTypes.bool,
    almacenId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    itemCode: PropTypes.string,
    codigoAlmacen: PropTypes.string,
    almacen: PropTypes.object,
    id_almacen: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  }).isRequired,
  isExpanded: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  sx: PropTypes.object,
  almacenes: PropTypes.array,
};
