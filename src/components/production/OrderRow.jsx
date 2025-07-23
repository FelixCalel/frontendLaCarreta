import { useState, useEffect } from "react";
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
  Input,
  useColorModeValue,
} from "@chakra-ui/react";
import { ChevronRightIcon, ChevronDownIcon } from "@chakra-ui/icons";
import {
  useGetDetallesYProduccionQuery,
  useUpdatePedidoProduccionMutation,
  useGetRecetaByPedidoQuery,
} from "../../services/pedidoProductionApi";
import { OrderDetailsTable } from "./OrderDetailsTable";
import { RecetaTable } from "./RecetaTable";
import { skipToken } from "@reduxjs/toolkit/query";

const FIELD_LABELS = {
  mpUtilizada: "MP Utilizada",
  mp1ra: "MP 1ra.",
  mp2da: "MP 2da.",
  mp3ra: "MP 3ra.",
  mpSobrante: "MP Sobrante",
  rechazo: "Rechazo",
  basura: "Basura",
  trazabilidad_Prod: "Trazabilidad",
};

const FIELD_SPECS = {
  mpUtilizada: { w: "70px", type: "number" },
  mp1ra: { w: "70px", type: "number" },
  mp2da: { w: "70px", type: "number" },
  mp3ra: { w: "70px", type: "number" },
  mpSobrante: { w: "70px", type: "number" },
  rechazo: { w: "70px", type: "number" },
  basura: { w: "70px", type: "number" },
  trazabilidad_Prod: { w: "70px", type: "text" },
};

export const OrderRow = ({ order, isExpanded, onToggle }) => {
  const shouldFetch = isExpanded && !order.ptmq;
  const recetaArg = shouldFetch ? order.id : skipToken;

  console.log("[OrderRow] getRecetaByPedido arg =>", recetaArg);
  const {
    data: receta = [],
    isFetching: loadingReceta,
    isSuccess,
    isError,
    error,
    requestId,
  } = useGetRecetaByPedidoQuery(recetaArg);
  const hasReceta = receta.length > 0;
  const [updatePedido] = useUpdatePedidoProduccionMutation();
  const [isPTMQ, setIsPTMQ] = useState(order.ptmq ?? false);
  const [cantidadLocal, setCantidadLocal] = useState(order.cantidad || 0);
  const [faltanteLocal, setFaltanteLocal] = useState(
    (order.cantidadUnidad ?? 0) - (order.cantidad || 0)
  );
  const {
    data: details = [],
    isLoading: loadingDetalles,
    refetch: refetchDetalles,
  } = useGetDetallesYProduccionQuery(shouldFetch ? order.id : skipToken);
  const [prodFields, setProdFields] = useState({
    mpUtilizada: order.mpUtilizada ?? 0,
    mp1ra: order.mp1ra ?? 0,
    mp2da: order.mp2da ?? 0,
    mp3ra: order.mp3ra ?? 0,
    mpSobrante: order.mpSobrante ?? 0,
    rechazo: order.rechazo ?? 0,
    basura: order.basura ?? 0,
    trazabilidad_Prod: order.trazabilidad_Prod ?? "",
  });

  useEffect(() => {
    if (loadingReceta) {
      console.log("[OrderRow] FETCHING /receta/pedido/", order.id, {
        requestId,
      });
    }
  }, [loadingReceta, order.id, requestId]);

  useEffect(() => {
    if (isSuccess) {
      console.log("[OrderRow] RECETA OK", receta);
    }
    if (isError) {
      console.error("[OrderRow] RECETA ERROR", error);
    }
  }, [isSuccess, isError, receta, error]);

  useEffect(() => {
    setCantidadLocal(order.cantidad || 0);
    setFaltanteLocal((order.cantidadUnidad ?? 0) - (order.cantidad || 0));
  }, [order.cantidad, order.cantidadUnidad]);

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

  useEffect(() => {
    setProdFields({
      mpUtilizada: order.mpUtilizada ?? "",
      mp1ra: order.mp1ra ?? "",
      mp2da: order.mp2da ?? "",
      mp3ra: order.mp3ra ?? "",
      mpSobrante: order.mpSobrante ?? "",
      rechazo: order.rechazo ?? "",
      basura: order.basura ?? "",
      trazabilidad_Prod: order.trazabilidad_Prod ?? "",
    });
  }, [
    order.mpUtilizada,
    order.mp1ra,
    order.mp2da,
    order.mp3ra,
    order.mpSobrante,
    order.rechazo,
    order.basura,
    order.trazabilidad_Prod,
  ]);

  const handleCantidadChange = (raw) => {
    const maximo = order.cantidadUnidad ?? 0;
    const nueva = Math.min(Math.max(0, raw), maximo);
    const nuevoFalt = maximo - nueva;

    setCantidadLocal(nueva);
    setFaltanteLocal(nuevoFalt);

    updatePedido({
      id: order.id,
      data: { cantidad: nueva, faltante: nuevoFalt },
    })
      .unwrap()
      .catch(() => {
        const revert = order.cantidad || 0;
        setCantidadLocal(revert);
        setFaltanteLocal((order.cantidadUnidad ?? 0) - revert);
      });
  };

  const handleFieldChange = (field, raw) => {
    const isText = field === "trazabilidad_Prod";
    let value = isText ? raw : Number(raw);
    if (!isText) {
      if (isNaN(value) || value < 0) value = 0;
    }

    setProdFields((prev) => ({ ...prev, [field]: value }));
    updatePedido({
      id: order.id,
      data: { [field]: value },
    })
      .unwrap()
      .catch(() => {
        setProdFields((prev) => ({
          ...prev,
          [field]: order[field] ?? (isText ? "" : 0),
        }));
      });
  };

  const handleCompletoChange = (checked) => {
    updatePedido({ id: order.id, data: { completo: checked } }).unwrap();
  };

  const stripeColor = useColorModeValue("gray.50", "gray.800");
  const hoverBg = useColorModeValue("gray.200", "gray.600");
  const panelBg = useColorModeValue("gray.50", "gray.800");

  return (
    <>
      <Tr
        bg={stripeColor}
        _hover={{ bg: hoverBg }}
        transition="background 0.2s"
      >
        <Td px={2} py={2}>
          <IconButton
            size="sm"
            icon={isExpanded ? <ChevronDownIcon /> : <ChevronRightIcon />}
            aria-label="Expandir"
            onClick={() => onToggle(order.id)}
            variant="ghost"
          />
        </Td>
        <Td px={2} py={2} isTruncated>
          {order.productoNombre}
        </Td>
        <Td px={2} py={2} isTruncated>
          {order.pais}
        </Td>
        <Td px={2} py={2} isTruncated>
          {order.tienda}
        </Td>
        <Td px={2} py={2} textAlign="center">
          {order.cantidadUnidad ?? "-"}
        </Td>
        <Td px={2} py={2} textAlign="center">
          <Checkbox
            isChecked={order.completo}
            size="sm"
            onChange={(e) => handleCompletoChange(e.target.checked)}
          />
        </Td>
        <Td px={2} py={2} textAlign="center">
          <Input
            size="sm"
            type="number"
            min={0}
            max={order.cantidadUnidad ?? 0}
            value={cantidadLocal}
            onChange={(e) => handleCantidadChange(Number(e.target.value))}
            w="60px"
          />
        </Td>
        <Td px={2} py={2} textAlign="center">
          {faltanteLocal}
        </Td>
      </Tr>

      <Tr>
        <Td colSpan={8} p={0} border="none">
          <Collapse in={isExpanded} animateOpacity>
            <Box p={3} bg={panelBg} align="center">
              <Flex
                gap={3}
                wrap="nowrap"
                overflowX="auto"
                justify="center"
                align="center"
                fontSize="sm"
                mb={3}
              >
                {Object.entries(prodFields).map(([field, value]) => {
                  const spec = FIELD_SPECS[field] ?? {
                    w: "80px",
                    type: "number",
                  };
                  return (
                    <Box key={field} flex="0 0 auto" whiteSpace="nowrap">
                      <Text fontWeight="semibold" mb={1}>
                        {FIELD_LABELS[field]}:
                      </Text>
                      <Input
                        size="xs"
                        h="26px"
                        w={spec.w}
                        type={spec.type}
                        value={value}
                        min={0}
                        onChange={(e) =>
                          handleFieldChange(field, e.target.value)
                        }
                        focusBorderColor="green.400"
                        px={2}
                      />
                    </Box>
                  );
                })}
              </Flex>

              <OrderDetailsTable
                details={details}
                isLoading={loadingDetalles}
                showPTMQ={!hasReceta}
                isPTMQ={isPTMQ}
                onTogglePTMQ={handlePTMQToggle}
              />

              {hasReceta && (
                <RecetaTable
                  pedidoId={order.id}
                  receta={receta}
                  isLoading={loadingReceta}
                />
              )}
            </Box>
          </Collapse>
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
    rechazo: PropTypes.number,
    basura: PropTypes.number,
    trazabilidad_Prod: PropTypes.string,
    ptmq: PropTypes.bool,
  }).isRequired,
  isExpanded: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
};
