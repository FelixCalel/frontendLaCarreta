import { memo, useCallback, useMemo, useState } from "react";
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
import { debounce } from "lodash";
import { RechazoModal } from "../modals/RechazoModal";

const FIELD_LABELS = {
  mpUtilizada: "MP Utilizada",
  mpSobrante: "MP Sobrante",
  basura: "Basura",
  trazabilidad_Prod: "Trazabilidad",
};

const FIELD_SPECS = {
  mpUtilizada: { w: "51px", type: "number" },
  mpSobrante: { w: "51px", type: "number" },
  basura: { w: "51px", type: "number" },
  trazabilidad_Prod: { w: "65px", type: "text" },
};

const ROW_1 = ["mpUtilizada", "mpSobrante", "basura", "trazabilidad_Prod"];

export const ConsolidatedExpandedRow = memo(
  ({ item, isExpanded, rechazoQty = 0 }) => {
    const [updatePedido] = useUpdatePedidoProduccionMutation();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [createRechazo, { isLoading: isCreatingRechazo }] =
      useCreateRechazoMutation();
    const [updateRechazo, { isLoading: isUpdatingRechazo }] =
      useUpdateRechazoMutation();

    const toast = useToast();
    const primaryOrder = item.originalItems[0];
    const pedidoId = primaryOrder?.id;
    const recetaArg = isExpanded && pedidoId ? { pedidoId } : skipToken;
    const { data: receta = [], isLoading: loadingReceta } =
      useGetRecetaByPedidoQuery(recetaArg);
    const hasReceta = receta && receta.length > 0;
    const { data: almacenes = [] } = useGetAlmacenesQuery(undefined, {
      skip: !isExpanded,
    });
    const allDetails = item.originalItems.flatMap((o) => o.details || []);

    const handleUpdate = useCallback(
      async (field, value) => {
        let finalValue = field === "trazabilidad_Prod" ? value : Number(value);
        if (
          typeof finalValue === "number" &&
          (isNaN(finalValue) || finalValue < 0)
        ) {
          finalValue = 0;
        }

        if (field !== "mpUtilizada") {
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

        if (totalCheck > solicitudTotal) {
          toast({
            title: "Valor inválido",
            description: `No se puede guardar: La cantidad total procesada (MP Utilizada: ${finalValue} + Rechazo: ${rechazoQty} = ${totalCheck}) excede la cantidad solicitada (${solicitudTotal}).`,
            status: "error",
            duration: 4000,
            isClosable: true,
          });
          return;
        }

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
      },
      [pedidoId, updatePedido, item.cantidadUnidad, item.originalItems, toast],
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

    const inputBg = useColorModeValue("gray.50", "gray.700");

    if (!isExpanded) return null;

    return (
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
            {primaryOrder && (
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
                    colorScheme="red"
                    variant="ghost"
                    leftIcon={<ChevronRightIcon boxSize={3} />}
                    fontSize="xs"
                    onClick={onOpen}
                    title="Registrar Rechazo"
                  >
                    Registrar Rechazo
                  </Button>
                </Flex>

                <Flex gap={2} wrap="wrap" align="center">
                  {ROW_1.map((field) => {
                    let currentValue;
                    if (field === "mpUtilizada") {
                      currentValue = item.originalItems.reduce(
                        (sum, order) => sum + (Number(order.mpUtilizada) || 0),
                        0,
                      );
                    } else {
                      currentValue = item.originalItems[0][field];
                    }
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
                          h="24px"
                          w={spec.w}
                          type={spec.type}
                          defaultValue={
                            currentValue === 0 || currentValue === "0"
                              ? ""
                              : currentValue
                          }
                          placeholder="0"
                          onChange={(e) =>
                            debouncedUpdate(field, e.target.value)
                          }
                          focusBorderColor="blue.400"
                          borderRadius="sm"
                          bg={inputBg}
                          textAlign="center"
                          fontSize="xs"
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
            pedidoProduccionId={primaryOrder?.id}
            onSave={async ({ formData, existingRechazo }) => {
              try {
                if (existingRechazo) {
                  await updateRechazo({
                    id: existingRechazo.id,
                    data: formData,
                    id_pedidoProd: primaryOrder?.id,
                  }).unwrap();
                } else {
                  await createRechazo({
                    ...formData,
                    id_pedidoProd: primaryOrder?.id,
                  }).unwrap();
                }
                onClose();
              } catch (err) {
                console.error("Failed to save rechazo:", err);
              }
            }}
            isLoading={isCreatingRechazo || isUpdatingRechazo}
            trazabilidadPadre={primaryOrder?.trazabilidad_Prod}
            maxQuantity={Number(item.cantidadUnidad) || 0}
            currentMpUtilizada={item.originalItems.reduce(
              (sum, order) => sum + (Number(order.mpUtilizada) || 0),
              0,
            )}
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
