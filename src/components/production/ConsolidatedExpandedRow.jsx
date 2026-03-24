import { memo, useCallback, useMemo, useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  useColorModeValue,
  Button,
  Flex,
  useToast,
  Text,
  Input,
  Center,
  Spinner,
  Box,
  useDisclosure,
} from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";
import {
  useGetRecetaByPedidoQuery,
  useGetAlmacenesQuery,
  useUpdatePedidoProduccionMutation,
  useCreateRechazoMutation,
  useUpdateRechazoMutation,
} from "../../services/pedidoProductionApi";
import { RecetaTable } from "./RecetaTable";
import { OrderDetailsTable } from "./OrderDetailsTable";
import { skipToken } from "@reduxjs/toolkit/query";
import debounce from "lodash/debounce";
import { RechazoModal } from "../modals/RechazoModal";

const FIELD_LABELS = {
  mpUtilizada: "MP Utilizada",
  mpSobrante: "MP Sobrante",
  basura: "Basura",
  trazabilidad_Prod: "Trazabilidad",
};

const FIELD_SPECS = {
  mpUtilizada: { w: "55px", type: "number" },
  mpSobrante: { w: "55px", type: "number" },
  basura: { w: "55px", type: "number" },
  trazabilidad_Prod: { w: "70px", type: "text" },
};

const ROW_1 = ["mpUtilizada", "mpSobrante", "basura"];

export const ConsolidatedExpandedRow = memo(
  ({ item, isExpanded, rechazoQty = 0, trazabilidad = "" }) => {
    const [updatePedido] = useUpdatePedidoProduccionMutation();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [createRechazo, { isLoading: isCreatingRechazo }] =
      useCreateRechazoMutation();
    const [updateRechazo, { isLoading: isUpdatingRechazo }] =
      useUpdateRechazoMutation();

    const toast = useToast();
    const primaryOrder = item.originalItems[0];
    const orderWithRechazo =
      item.originalItems.find(
        (order) => Number(order?.cantidadRechazada) > 0,
      ) || primaryOrder;
    const pedidoId = primaryOrder?.id;
    const recetaArg = isExpanded && pedidoId ? { pedidoId } : skipToken;
    const { data: receta = [], isLoading: loadingReceta } =
      useGetRecetaByPedidoQuery(recetaArg);
    const hasReceta = receta && receta.length > 0;
    const { data: almacenes = [] } = useGetAlmacenesQuery(undefined, {
      skip: !isExpanded,
    });
    const allDetails = item.originalItems.flatMap((o) => o.details || []);

    const initialLocalValues = useMemo(() => {
      const vals = {};
      ROW_1.forEach((field) => {
        if (["mpUtilizada", "mpSobrante", "basura"].includes(field)) {
          vals[field] = item.originalItems.reduce((sum, order) => {
            return sum + (Number(order[field]) || 0);
          }, 0);
        } else {
          vals[field] = item.originalItems[0][field];
        }
      });
      return vals;
    }, [item.originalItems]);

    const [localValuesState, setLocalValuesState] = useState(() => ({
      sourceKey: JSON.stringify(initialLocalValues),
      values: initialLocalValues,
    }));
    const serializedInitialValues = useMemo(
      () => JSON.stringify(initialLocalValues),
      [initialLocalValues],
    );
    const localValues =
      localValuesState.sourceKey === serializedInitialValues
        ? localValuesState.values
        : initialLocalValues;

    const handleUpdate = useCallback(
      async (field, value) => {
        let finalValue = field === "trazabilidad_Prod" ? value : value;

        if (field !== "trazabilidad_Prod") {
          if (finalValue === "") {
            finalValue = 0;
          } else {
            const numVal = Number(finalValue);
            if (Number.isNaN(numVal) || numVal < 0) {
              finalValue = 0;
            } else {
              finalValue = numVal;
            }
          }
        }

        if (
          field !== "mpUtilizada" &&
          field !== "mpSobrante" &&
          field !== "basura"
        ) {
          if (!pedidoId) return;
          try {
            await updatePedido({
              id: pedidoId,
              data: { [field]: finalValue },
            }).unwrap();
          } catch (err) {
            console.error("Error updating pedido:", err);
          }
          return;
        }

        const solicitudTotal = Number(item.cantidadUnidad) || 0;
        const totalCheck = finalValue + Number(rechazoQty || 0);

        if (field === "mpUtilizada" && totalCheck > solicitudTotal) {
          toast({
            title: "Valor inválido",
            description: `No se puede guardar: La cantidad total procesada (MP Utilizada: ${finalValue} + Rechazo: ${rechazoQty} = ${totalCheck}) excede la cantidad solicitada (${solicitudTotal}).`,
            status: "error",
            duration: 4000,
            isClosable: true,
          });
          return;
        }

        if (field === "mpUtilizada") {
          let remainingToAllocate = finalValue;
          const updatePromises = item.originalItems.map((order) => {
            const orderSolicitud = Number(order.cantidadUnidad) || 0;
            const allocation = Math.min(orderSolicitud, remainingToAllocate);
            remainingToAllocate -= allocation;
            const newFaltante = orderSolicitud - allocation;

            return updatePedido({
              id: order.id,
              data: {
                mpUtilizada: allocation,
                cantidad: allocation,
                faltante: newFaltante,
              },
            }).unwrap();
          });

          try {
            await Promise.all(updatePromises);
          } catch (err) {
            console.error("Error distributing mpUtilizada:", err);
            toast({
              title: "Error",
              description: "Hubo un error al distribuir la cantidad.",
              status: "error",
            });
          }
        }

        if (field === "mpSobrante" || field === "basura") {
          let remainingToAllocate = finalValue;
          const totalSolicitud = Number(item.cantidadUnidad) || 1;
          const updatePromises = item.originalItems.map((order, index) => {
            const isLast = index === item.originalItems.length - 1;
            let allocation = 0;

            if (isLast) {
              allocation = Number(remainingToAllocate.toFixed(2));
            } else {
              const weight =
                (Number(order.cantidadUnidad) || 0) / totalSolicitud;
              allocation = Number((finalValue * weight).toFixed(2));
              remainingToAllocate -= allocation;
            }

            return updatePedido({
              id: order.id,
              data: {
                [field]: allocation,
              },
            }).unwrap();
          });

          try {
            await Promise.all(updatePromises);
          } catch (err) {
            console.error(`Error distributing ${field}:`, err);
            toast({
              title: "Error",
              description: `Hubo un error al distribuir ${field}.`,
              status: "error",
            });
          }
        }
      },
      [
        pedidoId,
        updatePedido,
        item.cantidadUnidad,
        item.originalItems,
        rechazoQty,
        toast,
      ],
    );

    const [ptmqOptimistic, setPtmqOptimistic] = useState(null);
    const isPTMQ = ptmqOptimistic ?? primaryOrder?.ptmq ?? false;

    const handlePTMQToggle = useCallback(
      async (checked) => {
        if (!pedidoId) return;
        setPtmqOptimistic(checked);
        try {
          await updatePedido({
            id: pedidoId,
            data: { ptmq: checked },
          }).unwrap();
        } catch (err) {
          console.error("Error updating PTMQ:", err);
          setPtmqOptimistic(null);
          toast({
            title: "Error",
            description: "No se pudo actualizar el estado PTMQ",
            status: "error",
          });
        }
      },
      [pedidoId, updatePedido, toast],
    );

    const debouncedUpdate = useMemo(
      () => debounce(handleUpdate, 500),
      [handleUpdate],
    );

    useEffect(() => {
      return () => {
        debouncedUpdate.cancel();
      };
    }, [debouncedUpdate]);

    const inputBg = useColorModeValue("gray.50", "gray.700");
    const boxBg = useColorModeValue("gray.50", "gray.900");
    const containerBg = useColorModeValue("white", "gray.800");

    if (!isExpanded) return null;

    return (
      <Box
        pl={2}
        pr={1}
        py={2}
        bg={boxBg}
        borderBottomWidth="1px"
        borderColor="gray.200"
      >
        <Flex
          gap={4}
          direction={{ base: "column", md: "row" }}
          align="flex-start"
        >
          <Box width="fit-content">
            {primaryOrder && (
              <Box
                bg={containerBg}
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
                    colorScheme="red"
                    variant="ghost"
                    leftIcon={<ChevronRightIcon boxSize={3} />}
                    fontSize="xs"
                    onClick={onOpen}
                    title="Salidas de Inventario"
                  >
                    Salidas de Inventario
                  </Button>
                </Flex>

                <Flex gap={2} wrap="wrap" align="center">
                  {ROW_1.map((field) => {
                    let currentValue;

                    if (
                      ["mpUtilizada", "mpSobrante", "basura"].includes(field)
                    ) {
                      currentValue = item.originalItems.reduce(
                        (sum, order) => sum + (Number(order[field]) || 0),
                        0,
                      );
                    } else {
                      currentValue = item.originalItems[0][field];
                    }

                    const isReadOnly = FIELD_SPECS[field]?.isReadOnly;
                    const spec = FIELD_SPECS[field];

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
                          width={spec.w}
                          textAlign="center"
                          bg={isReadOnly ? "red.50" : inputBg}
                          color={isReadOnly ? "red.600" : "inherit"}
                          borderColor={isReadOnly ? "red.200" : "inherit"}
                          value={
                            spec.type === "number" &&
                            (localValues[field] === 0 ||
                              localValues[field] === "0")
                              ? ""
                              : localValues[field] === undefined
                                ? ""
                                : localValues[field]
                          }
                          placeholder={spec.type === "number" ? "0" : ""}
                          isReadOnly={isReadOnly}
                          onChange={(e) => {
                            if (!isReadOnly) {
                              const v = e.target.value;
                              setLocalValuesState((prev) => {
                                const baseValues =
                                  prev.sourceKey === serializedInitialValues
                                    ? prev.values
                                    : initialLocalValues;

                                return {
                                  sourceKey: serializedInitialValues,
                                  values: {
                                    ...baseValues,
                                    [field]: v,
                                  },
                                };
                              });
                              debouncedUpdate(field, v);
                            }
                          }}
                          onClick={field === "rechazo" ? onOpen : undefined}
                          cursor={field === "rechazo" ? "pointer" : "text"}
                        />
                      </Flex>
                    );
                  })}
                </Flex>
              </Box>
            )}

            <Box>
              <OrderDetailsTable
                details={allDetails}
                isLoading={false}
                showPTMQ={!hasReceta}
                isPTMQ={isPTMQ}
                onTogglePTMQ={handlePTMQToggle}
              />
            </Box>
          </Box>
          <Box flex="1">
            {loadingReceta ? (
              <Center py={2}>
                <Spinner size="sm" />
              </Center>
            ) : (
              <RecetaTable
                pedidoId={pedidoId}
                receta={receta}
                almacenes={almacenes}
              />
            )}
          </Box>
        </Flex>
        {isOpen && (
          <RechazoModal
            isOpen={isOpen}
            onClose={onClose}
            pedidoProduccionId={orderWithRechazo?.id}
            trazabilidadPadre={trazabilidad}
            onSave={async ({ formData, existingRechazo }) => {
              try {
                if (existingRechazo) {
                  await updateRechazo({
                    id: existingRechazo.id,
                    data: formData,
                    id_pedidoProd: orderWithRechazo?.id,
                  }).unwrap();
                } else {
                  const totalRejection =
                    Number(formData.cantidadRechazada) || 0;
                  let remainingRejection = totalRejection;

                  for (const order of item.originalItems) {
                    const orderCapacity = Number(order.cantidadUnidad) || 0;
                    const currentMp = Number(order.mpUtilizada) || 0;
                    const availableSpace = Math.max(
                      0,
                      orderCapacity - currentMp,
                    );
                    const amount = Math.min(remainingRejection, availableSpace);
                    const currentRejection =
                      Number(order.cantidadRechazada) || 0;

                    if (amount !== currentRejection) {
                      await createRechazo({
                        ...formData,
                        cantidadRechazada: amount,
                        id_pedidoProd: order.id,
                      }).unwrap();

                      remainingRejection -= amount;
                    }
                  }
                }

                onClose();
              } catch (err) {
                console.error("Failed to save rechazo:", err);
                toast({
                  title: "Error",
                  description: "Hubo un error al distribuir el rechazo.",
                  status: "error",
                });
              }
            }}
            isLoading={isCreatingRechazo || isUpdatingRechazo}
            maxQuantity={Number(item.cantidadUnidad) || 0}
            currentMpUtilizada={item.originalItems.reduce(
              (sum, order) => sum + (Number(order.mpUtilizada) || 0),
              0,
            )}
            initialQuantity={rechazoQty}
          />
        )}
      </Box>
    );
  },
);

ConsolidatedExpandedRow.displayName = "ConsolidatedExpandedRow";

ConsolidatedExpandedRow.propTypes = {
  item: PropTypes.object.isRequired,
  isExpanded: PropTypes.bool.isRequired,
  rechazoQty: PropTypes.number,
};
