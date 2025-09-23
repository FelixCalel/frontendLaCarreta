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
  Input,
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
  useGetAlmacenesQuery,
} from "../../services/pedidoProductionApi";
import { OrderDetailsTable } from "./OrderDetailsTable";
import { RecetaTable } from "./RecetaTable";
import { skipToken } from "@reduxjs/toolkit/query";
import { RechazoModal } from "../modals/RechazoModal";

const FIELD_LABELS = {
  mpUtilizada: "MP Utilizada",
  mp1ra: "MP 1ra.",
  mp2da: "MP 2da.",
  mp3ra: "MP 3ra.",
  mpSobrante: "MP Sobrante",
  basura: "Basura",
  trazabilidad_Prod: "Trazabilidad",
};

const FIELD_SPECS = {
  mpUtilizada: { w: "70px", type: "number" },
  mp1ra: { w: "70px", type: "number" },
  mp2da: { w: "70px", type: "number" },
  mp3ra: { w: "70px", type: "number" },
  mpSobrante: { w: "70px", type: "number" },
  basura: { w: "70px", type: "number" },
  trazabilidad_Prod: { w: "70px", type: "text" },
};

export const OrderRow = ({ order, isExpanded, onToggle, sx = {} }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const shouldFetch = isExpanded;

  const { data: almacenes = [], isLoading: loadingAlmacenes } = useGetAlmacenesQuery();

  const recetaArg = shouldFetch ? { pedidoId: order.id } : skipToken;

  const {
    data: receta = [],
    isFetching: loadingReceta,
    isSuccess,
    isError,
    error,
  } = useGetRecetaByPedidoQuery(recetaArg);
  const hasReceta = receta.length > 0;
  const [updatePedido] = useUpdatePedidoProduccionMutation();
  const [createRechazo, { isLoading: isCreatingRechazo }] =
    useCreateRechazoMutation();
  const [updateRechazo, { isLoading: isUpdatingRechazo }] =
    useUpdateRechazoMutation();
  const [isPTMQ, setIsPTMQ] = useState(order.ptmq ?? false);
  const [cantidadLocal, setCantidadLocal] = useState(
    Number(order.cantidad) || 0
  );
  const [faltanteLocal, setFaltanteLocal] = useState(
    (Number(order.cantidadUnidad) ?? 0) - (Number(order.cantidad) || 0)
  );
  const {
    data: details = [],
    isLoading: loadingDetalles,
    refetch: refetchDetalles,
  } = useGetDetallesYProduccionQuery(shouldFetch ? order.id : skipToken);
  const [prodFields, setProdFields] = useState({
    mpUtilizada: Number(order.mpUtilizada) ?? 0,
    mp1ra: Number(order.mp1ra) ?? 0,
    mp2da: Number(order.mp2da) ?? 0,
    mp3ra: Number(order.mp3ra) ?? 0,
    mpSobrante: Number(order.mpSobrante) ?? 0,
    basura: Number(order.basura) ?? 0,
    trazabilidad_Prod: order.trazabilidad_Prod ?? "",
  });

  useEffect(() => {
    if (isSuccess) {
      console.log("[OrderRow] RECETA OK", receta);
    }
    if (isError) {
      console.error("[OrderRow] RECETA ERROR", error);
    }
  }, [isSuccess, isError, receta, error]);

  useEffect(() => {
    setCantidadLocal(Number(order.cantidad) || 0);
    setFaltanteLocal(
      (Number(order.cantidadUnidad) ?? 0) - (Number(order.cantidad) || 0)
    );
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
      mpUtilizada: Number(order.mpUtilizada) ?? 0,
      mp1ra: Number(order.mp1ra) ?? 0,
      mp2da: Number(order.mp2da) ?? 0,
      mp3ra: Number(order.mp3ra) ?? 0,
      mpSobrante: Number(order.mpSobrante) ?? 0,
      basura: Number(order.basura) ?? 0,
      trazabilidad_Prod: order.trazabilidad_Prod ?? "",
    });
  }, [
    order.mpUtilizada,
    order.mp1ra,
    order.mp2da,
    order.mp3ra,
    order.mpSobrante,
    order.basura,
    order.trazabilidad_Prod,
  ]);

  const handleFieldChange = (field, raw) => {
    const isText = field === "trazabilidad_Prod";
    let value = isText ? raw : Number(raw);

    const fieldsToValidate = [
      "mpUtilizada",
      "mp1ra",
      "mp2da",
      "mp3ra",
      "mpSobrante",
      "basura",
    ];

    if (!isText) {
      if (isNaN(value) || value < 0) {
        value = 0;
      }

      if (fieldsToValidate.includes(field)) {
        const maxAllowed = Number(order.cantidadUnidad) ?? 0;
        if (value > maxAllowed) {
          toast({
            title: "Valor inválido",
            description: `El valor no puede ser mayor que "Solic. Ventas" (${maxAllowed}).`,
            status: "error",
            duration: 4000,
            isClosable: true,
          });
          return;
        }
      }
    }

    setProdFields((prev) => ({ ...prev, [field]: value }));

    const updateData = { [field]: value };

    if (field === "mpUtilizada") {
      const nuevaCantidad = value;
      const nuevoFaltante = (Number(order.cantidadUnidad) ?? 0) - nuevaCantidad;

      setCantidadLocal(nuevaCantidad);
      setFaltanteLocal(nuevoFaltante);

      updateData.cantidad = nuevaCantidad;
      updateData.faltante = nuevoFaltante;
    }

    updatePedido({
      id: order.id,
      data: updateData,
    })
      .unwrap()
      .catch(() => {
        setProdFields((prev) => ({
          ...prev,
          [field]: order[field] ?? (isText ? "" : 0),
        }));
        if (field === "mpUtilizada") {
          const revertCantidad = Number(order.cantidad) || 0;
          setCantidadLocal(revertCantidad);
          setFaltanteLocal(
            (Number(order.cantidadUnidad) ?? 0) - revertCantidad
          );
        }
      });
  };

  const handleCompletoChange = (checked) => {
    updatePedido({ id: order.id, data: { completo: checked } }).unwrap();
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
  const hoverBg = useColorModeValue("gray.200", "gray.600");
  const panelBg = useColorModeValue("gray.50", "gray.800");

  const memoizedRecetaTable = useMemo(
    () => (
      <RecetaTable
        pedidoId={order.id}
        receta={receta}
        isLoading={loadingReceta}
        almacenes={almacenes}
      />
    ),
    [order.id, receta, loadingReceta, almacenes]
  );

  return (
    <>
      <Tr
        bg={stripeColor}
        _hover={{ bg: hoverBg }}
        transition="background 0.2s"
        sx={sx}
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
          <Text>{cantidadLocal}</Text>
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
                        onChange={(e) =>
                          handleFieldChange(field, e.target.value)
                        }
                        px={2}
                        focusBorderColor="green.400"
                      />
                    </Box>
                  );
                })}
                <Box flex="0 0 auto" whiteSpace="nowrap">
                  <Text fontWeight="semibold" mb={1}>
                    Rechazo:
                  </Text>
                  <Button size="xs" h="26px" onClick={onOpen}>
                    Gestionar
                  </Button>
                </Box>
              </Flex>

              <OrderDetailsTable
                details={details}
                isLoading={loadingDetalles}
                showPTMQ={!hasReceta}
                isPTMQ={isPTMQ}
                onTogglePTMQ={handlePTMQToggle}
              />
              {hasReceta ? (
                memoizedRecetaTable
              ) : (
                <Box py={4} textAlign="center" mt={4}>
                  <Text color="gray.500" fontSize="sm">
                    No hay una receta definida para este producto.
                  </Text>
                </Box>
              )}
            </Box>
          </Collapse>
          {isOpen && (
            <RechazoModal
              isOpen={isOpen}
              onClose={onClose}
              pedidoProduccionId={order.id}
              onSave={handleSaveRechazo}
              isLoading={isCreatingRechazo || isUpdatingRechazo}
              trazabilidadPadre={prodFields.trazabilidad_Prod}
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
  }).isRequired,
  isExpanded: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  sx: PropTypes.object,
};
