import { useState, useEffect, Fragment, useMemo } from "react";
import PropTypes from "prop-types";
import {
  Tr,
  Td,
  Checkbox,
  IconButton,
  Collapse,
  Box,
  Input,
  Spinner,
  Center,
  Text,
  useColorModeValue,
  Button,
  useDisclosure,
  Flex,
  useToast,
} from "@chakra-ui/react";
import { ChevronRightIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { skipToken } from "@reduxjs/toolkit/query";
import {
  useGetRecetaByPedidoQuery,
  useUpdatePedidoProduccionMutation,
  useGetAlmacenesQuery,
} from "../../../services/pedidoProductionApi";
import { FabricacionDetailsTable } from "./FabricacionDetailsTable";
import { RecetaTable } from "../RecetaTable";
import { RechazoModal } from "../../modals/RechazoModal";
import { NumberInputBox } from "./components/NumberInputBox";
import { AlmacenSelect } from "./components/AlmacenSelect";

const clamp = (v, min, max) => Math.max(min, Math.min(v, max));

import { useFabricacionRow } from "./hooks/useFabricacionRow";
import { FabricacionCollapsePanel } from "./components/FabricacionCollapsePanel";

const numOrEmpty = (v) => (v === null || v === undefined ? "" : v);

export const FabricacionRow = ({ order, index = 0 }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    cant,
    desp,
    falt,
    almacenId,
    almacenes,
    onCantidadChange,
    onDespachoChange,
    onFaltanteChange,
    handleAlmacenChange,
    maxPedido,
  } = useFabricacionRow(order);

  const bgOdd = useColorModeValue("white", "gray.900");
  const bgEven = useColorModeValue("gray.50", "gray.800");
  const rowBg = index % 2 === 0 ? bgOdd : bgEven;

  const hoverBg = useColorModeValue("gray.200", "gray.600");
  const panelBg = useColorModeValue("gray.50", "gray.900");
  const panelBorder = useColorModeValue("gray.200", "gray.700");

  const inputBgColor = useColorModeValue("white", "gray.700");
  const selectBorderColor = useColorModeValue("#E2E8F0", "#4A5568");
  const selectColor = useColorModeValue("#2D3748", "#EDF2F7");
  const selectBgColor = useColorModeValue("#fff", "#2D3748");
  const optionColor = useColorModeValue("#222", "#fff");
  const optionBgColor = useColorModeValue("#fff", "#222");
  const detailsBgColor = useColorModeValue("white", "gray.800");

  const recetaArg = isExpanded ? { pedidoId: order.id } : skipToken;
  const { data: receta = [], isLoading: loadingReceta } =
    useGetRecetaByPedidoQuery(recetaArg);

  return (
    <Fragment>
      <Tr bg={rowBg} _hover={{ bg: hoverBg }} transition="background 0.2s">
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
            onClick={() => setIsExpanded((v) => !v)}
            variant="ghost"
            colorScheme="blue"
            borderRadius="full"
          />
        </Td>

        <Td px={2} py={2}>
          <Box>
            <Text fontWeight="bold" fontSize="sm">
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
              Mesa/Pedido {order.pedidoId || "-"}
            </Text>
            <Text fontSize="xs" color="gray.500">
              {order.tienda}
            </Text>
          </Box>
        </Td>

        <Td px={2} py={2} textAlign="center">
          <Checkbox
            isChecked={!!order.completo}
            isReadOnly
            size="md"
            colorScheme="green"
          />
        </Td>

        <Td px={2} py={2} textAlign="center">
          <NumberInputBox
            value={numOrEmpty(desp)}
            onChange={onDespachoChange}
            label="Despacho"
            bg={inputBgColor}
          />
        </Td>

        <Td px={2} py={2} textAlign="center">
          <NumberInputBox
            value={numOrEmpty(falt)}
            onChange={onFaltanteChange}
            label="Faltante"
            bg={inputBgColor}
            color={falt > 0 ? "red.500" : "inherit"}
            fontWeight={falt > 0 ? "bold" : "normal"}
          />
        </Td>

        <Td px={2} py={2}>
          {order.unidadMedida ?? "-"}
        </Td>

        <Td px={2} py={2} textAlign="center">
          <NumberInputBox
            value={numOrEmpty(cant)}
            onChange={onCantidadChange}
            label="Procesado"
            bg={inputBgColor}
            color="green.500"
            fontWeight="bold"
          />
        </Td>

        <Td px={2} py={2}>
          {order.trazabilidad_Prod ?? "-"}
        </Td>

        <Td px={2} py={2}>
          <AlmacenSelect
            almacenId={almacenId}
            handleAlmacenChange={handleAlmacenChange}
            selectBorderColor={selectBorderColor}
            selectColor={selectColor}
            selectBgColor={selectBgColor}
            almacenes={almacenes}
            optionColor={optionColor}
            optionBgColor={optionBgColor}
          />
        </Td>

        <Td px={2} py={2} textAlign="center">
          <Button
            size="xs"
            onClick={onOpen}
            colorScheme="red"
            variant="outline"
          >
            Rechazo
          </Button>
        </Td>
      </Tr>

      <FabricacionCollapsePanel
        isExpanded={isExpanded}
        panelBg={panelBg}
        panelBorder={panelBorder}
        detailsBgColor={detailsBgColor}
        order={order}
        loadingReceta={loadingReceta}
        receta={receta}
        almacenes={almacenes}
      />

      {isOpen && (
        <RechazoModal
          isOpen={isOpen}
          onClose={onClose}
          rechazoId={order.rechazo}
        />
      )}
    </Fragment>
  );
};

FabricacionRow.propTypes = {
  order: PropTypes.object.isRequired,
  index: PropTypes.number,
};
