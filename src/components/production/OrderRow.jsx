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

const EMPTY_OBJECT = {};
const EMPTY_ARRAY = [];
import { useOrderRow } from "./hooks/useOrderRow";

export const OrderRow = ({
  order,
  isExpanded,
  onToggle,
  sx = EMPTY_OBJECT,
  almacenes = EMPTY_ARRAY,
  index = 0,
}) => {
  const {
    rechazoQty,
    receta,
    loadingReceta,
    isPTMQ,
    cantidadLocal,
    faltanteLocal,
    details,
    loadingDetalles,
    completoLocal,
    handlePTMQToggle,
    handleUpdateStats,
    handleCompletoChange,
    handleSaveRechazo,
    modalPedidoProduccionId,
    modalMaxQuantity,
    modalCurrentMpUtilizada,
    isOpen,
    onOpen,
    onClose,
    isSavingRechazo,
  } = useOrderRow(order, isExpanded);

  const hasReceta = receta && receta.length > 0;
  const bgOdd = useColorModeValue("white", "gray.900");
  const bgEven = useColorModeValue("gray.100", "gray.800");
  const rowBg = index % 2 === 0 ? bgOdd : bgEven;

  const hoverBg = useColorModeValue("gray.200", "gray.600");
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
              <Flex
                gap={4}
                direction={{ base: "column", md: "row" }}
                align="flex-start"
              >
                <Box width="fit-content">
                  <OrderProductionRegistry
                    order={order}
                    rechazoQty={rechazoQty}
                    onUpdateStats={handleUpdateStats}
                    onOpenRechazo={onOpen}
                  />
                  <OrderDetailsTable
                    details={details}
                    isLoading={loadingDetalles}
                    showPTMQ={!hasReceta}
                    isPTMQ={isPTMQ}
                    onTogglePTMQ={handlePTMQToggle}
                  />
                </Box>
                <Box flex="1">{memoizedRecetaTable}</Box>
              </Flex>
            </Box>
          </Collapse>
          {isOpen && (
            <RechazoModal
              isOpen={isOpen}
              onClose={onClose}
              pedidoProduccionId={modalPedidoProduccionId}
              onSave={handleSaveRechazo}
              isLoading={isSavingRechazo}
              trazabilidadPadre={order.trazabilidad_Prod}
              maxQuantity={modalMaxQuantity}
              currentMpUtilizada={modalCurrentMpUtilizada}
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
