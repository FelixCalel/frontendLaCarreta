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
  useGetRechazoByPedidoProduccionIdQuery,
} from "../../services/pedidoProductionApi";
import { OrderDetailsTable } from "./OrderDetailsTable";
import { RecetaTable } from "./RecetaTable";
import { skipToken } from "@reduxjs/toolkit/query";
import { RechazoModal } from "../modals/RechazoModal";

const FIELD_LABELS = {
  mpUtilizada: "MP Utilizada",

  mpSobrante: "MP Sobrante",
  basura: "Basura",
  trazabilidad_Prod: "Trazabilidad",
  mp1ra: "MP 1ra",
  mp2da: "MP 2da",
  mp3ra: "MP 3ra",
};

const FIELD_SPECS = {
  mpUtilizada: { w: "51px", type: "number" },

  mpSobrante: { w: "51px", type: "number" },
  basura: { w: "51px", type: "number" },
  trazabilidad_Prod: { w: "65px", type: "text" },
  mp1ra: { w: "51px", type: "number" },
  mp2da: { w: "51px", type: "number" },
  mp3ra: { w: "51px", type: "number" },
};

const ROW_1 = ["mpUtilizada", "mpSobrante", "basura", "trazabilidad_Prod"];
const ROW_2 = ["mp1ra", "mp2da", "mp3ra"];

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
    isFetching,
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
  const [prodFields, setProdFields] = useState({
    mpUtilizada: Number(order.mpUtilizada) || 0,

    mpSobrante: Number(order.mpSobrante) || 0,
    basura: Number(order.basura) || 0,
    trazabilidad_Prod: order.trazabilidad_Prod ?? "",
    mp1ra: Number(order.mp1ra) || 0,
    mp2da: Number(order.mp2da) || 0,
    mp3ra: Number(order.mp3ra) || 0,
  });
  const [almacenId, setAlmacenId] = useState(
    order.id_almacen ? String(order.id_almacen) : "",
  );
  useEffect(() => {
    setAlmacenId(order.id_almacen ? String(order.id_almacen) : "");
  }, [order.id_almacen]);

  useEffect(() => {
    if (isSuccess) {
      console.log("[OrderRow] RECETA OK", receta);
    }
    if (isError) {
      console.error("[OrderRow] RECETA ERROR", error);
    }
  }, [isSuccess, isError, receta, error]);

  useEffect(() => {
    /*
     Lógica para "Reducir del faltante" y "Reducir de procesado":
     - Procesado (Visual) = Cantidad Total - Rechazo. (Mostrar solo lo bueno).
     - Faltante = Solicitado - (Cantidad Total + Rechazo). (Considerar rechazo como "ya atendido" para bajar el faltante).
    */
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

  useEffect(() => {
    setProdFields({
      mpUtilizada: Number(order.mpUtilizada) || 0,

      mpSobrante: Number(order.mpSobrante) || 0,
      basura: Number(order.basura) || 0,
      trazabilidad_Prod: order.trazabilidad_Prod ?? "",
      mp1ra: Number(order.mp1ra) || 0,
      mp2da: Number(order.mp2da) || 0,
      mp3ra: Number(order.mp3ra) || 0,
    });
  }, [
    order.mpUtilizada,

    order.mpSobrante,
    order.basura,
    order.trazabilidad_Prod,
    order.mp1ra,
    order.mp2da,
    order.mp3ra,
  ]);

  const handleFieldChange = (field, raw) => {
    const isText = field === "trazabilidad_Prod";
    let value = isText ? raw : Number(raw);

    const fieldsToValidate = [
      "mpUtilizada",
      "mpSobrante",
      "basura",
      "mp1ra",
      "mp2da",
      "mp3ra",
    ];

    if (!isText) {
      if (Number.isNaN(value) || value < 0) {
        value = 0;
      }

      if (fieldsToValidate.includes(field)) {
        const maxAllowed = Number(order.cantidadUnidad) || 0;
        let totalCheck = value;

        if (field === "mpUtilizada") {
          totalCheck = value + rechazoQty;
        }

        if (totalCheck > maxAllowed) {
          const errorMsg =
            field === "mpUtilizada"
              ? `No se puede guardar: La cantidad total procesada (MP Utilizada: ${value} + Rechazo: ${rechazoQty} = ${totalCheck}) excede la cantidad solicitada (${maxAllowed}).`
              : `El valor no puede ser mayor que "Solic. Ventas" (${maxAllowed}).`;

          toast({
            title: "Valor inválido",
            description: errorMsg,
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
      const nuevoFaltante =
        (Number(order.cantidadUnidad) || 0) - (nuevaCantidad + rechazoQty);

      setCantidadLocal(nuevaCantidad + rechazoQty);
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
            (Number(order.cantidadUnidad) || 0) - revertCantidad,
          );
        }
      });
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
        borderColor={useColorModeValue("gray.100", "gray.700")}
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
          <Box
            display="inline-flex"
            flexDirection="column"
            alignItems="flex-end"
          >
            <Text
              fontSize="2xs"
              mb={0.5}
              fontWeight="bold"
              color="gray.500"
              textTransform="uppercase"
            >
              Almacén Destino
            </Text>
            <select
              value={almacenId}
              onChange={async (e) => {
                const newId = e.target.value;
                setAlmacenId(newId);
                try {
                  await updatePedido({
                    id: order.id,
                    data: { id_almacen: newId ? Number(newId) : null },
                  }).unwrap();
                } catch {
                  setAlmacenId(
                    order.id_almacen ? String(order.id_almacen) : "",
                  );
                }
              }}
              style={{
                fontSize: "12px",
                padding: "2px 6px",
                borderRadius: "4px",
                border: "1px solid",
                borderColor: useColorModeValue("#E2E8F0", "#4A5568"),
                color: useColorModeValue("#2D3748", "#EDF2F7"),
                background: useColorModeValue("#fff", "#2D3748"),
                cursor: "pointer",
                outline: "none",
              }}
            >
              <option value="">-- Seleccionar --</option>
              {almacenes.map((almacen) => (
                <option
                  key={almacen.id}
                  value={almacen.id}
                  style={{
                    color: useColorModeValue("#222", "#fff"),
                    background: useColorModeValue("#fff", "#222"),
                  }}
                >
                  {almacen.nombre || almacen.name}
                </option>
              ))}
            </select>
          </Box>
        </Td>
      </Tr>

      <Tr>
        <Td colSpan={8} p={0} border="none">
          <Collapse in={isExpanded} animateOpacity>
            <Box
              pl={2}
              pr={1}
              py={2}
              bg={useColorModeValue("gray.50", "gray.900")}
              borderBottomWidth="1px"
              borderColor="gray.200"
            >
              <Flex gap={4} direction={{ base: "column", xl: "row" }}>
                <Box width="fit-content">
                  <Box
                    bg={useColorModeValue("white", "gray.800")}
                    p={1.5}
                    borderRadius="md"
                    shadow="sm"
                    borderWidth="1px"
                    borderColor="gray.200"
                    mb={2}
                  >
                    <Flex align="center" justify="space-between" mb={1}>
                      <Text fontSize="sm" fontWeight="bold" color="blue.600">
                        Registro
                      </Text>
                      <Button
                        size="xs"
                        h="20px"
                        onClick={onOpen}
                        colorScheme="red"
                        variant="ghost"
                        leftIcon={<ChevronRightIcon boxSize={3} />}
                        fontSize="xs"
                      >
                        Registrar Rechazo
                      </Button>
                    </Flex>

                    <Flex gap={2} wrap="wrap" align="center">
                      {ROW_1.map((field) => {
                        const value = prodFields[field];
                        const spec = FIELD_SPECS[field] ?? {
                          w: "80px",
                          type: "number",
                        };
                        return (
                          <Flex key={field} direction="column" align="center">
                            <Text
                              fontSize="10px"
                              fontWeight="bold"
                              color="gray.500"
                              mb={0.5}
                              textTransform="uppercase"
                              textAlign="center"
                            >
                              {FIELD_LABELS[field]}
                            </Text>
                            <Input
                              size="xs"
                              h="24px"
                              w={spec.w}
                              type={spec.type}
                              value={
                                spec.type === "number" && value === 0
                                  ? ""
                                  : value
                              }
                              placeholder={spec.type === "number" ? "0" : ""}
                              onChange={(e) =>
                                handleFieldChange(field, e.target.value)
                              }
                              focusBorderColor="blue.400"
                              borderRadius="sm"
                              bg={useColorModeValue("gray.50", "gray.700")}
                              textAlign="center"
                              fontSize="xs"
                            />
                          </Flex>
                        );
                      })}
                    </Flex>

                    {/* Fila 2: MP 1ra, 2da, 3ra */}
                    {/*  <Flex gap={2} wrap="wrap" justify="center">
                      {ROW_2.map((field) => {
                        const value = prodFields[field];
                        const spec = FIELD_SPECS[field] ?? {
                          w: "80px",
                          type: "number",
                        };
                        return (
                          <Flex key={field} direction="column" align="center">
                            <Text
                              fontSize="10px"
                              fontWeight="bold"
                              color="gray.500"
                              mb={0.5}
                              textTransform="uppercase"
                              textAlign="center"
                            >
                              {FIELD_LABELS[field]}
                            </Text>
                            <Input
                              size="xs"
                              w={spec.w}
                              type={spec.type}
                              value={value}
                              onChange={(e) =>
                                handleFieldChange(field, e.target.value)
                              }
                              focusBorderColor="blue.400"
                              borderRadius="sm"
                              bg={useColorModeValue("gray.50", "gray.700")}
                              textAlign="center"
                            />
                          </Flex>
                        );
                      })}
                    </Flex>*/}
                  </Box>

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
              trazabilidadPadre={prodFields.trazabilidad_Prod}
              maxQuantity={Number(order.cantidadUnidad) || 0}
              currentMpUtilizada={prodFields.mpUtilizada}
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
  }).isRequired,
  isExpanded: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  sx: PropTypes.object,
  almacenes: PropTypes.array,
};
