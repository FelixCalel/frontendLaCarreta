import { useState, useEffect, Fragment } from "react";
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

const clamp = (v, min, max) => Math.max(min, Math.min(v, max));
const numOrEmpty = (v) => (v === null || v === undefined ? "" : v);

export const FabricacionRow = ({ order, index = 0 }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const maxPedido = order.cantidadUnidad ?? 0;
  const [cant, setCant] = useState(order.cantidad ?? 0);
  const [desp, setDesp] = useState(order.despacho ?? 0);
  const [falt, setFalt] = useState(order.faltante ?? maxPedido - cant);

  const [updatePedido] = useUpdatePedidoProduccionMutation();

  const bgOdd = useColorModeValue("white", "gray.900");
  const bgEven = useColorModeValue("gray.50", "gray.800");
  const rowBg = index % 2 === 0 ? bgOdd : bgEven;

  const hoverBg = useColorModeValue("gray.200", "gray.600");
  const panelBg = useColorModeValue("white", "gray.700");
  const panelBorder = useColorModeValue("gray.200", "gray.600");
  const titleColor = useColorModeValue("gray.600", "gray.300");

  const recetaArg = isExpanded ? { pedidoId: order.id } : skipToken;
  const { data: receta = [], isLoading: loadingReceta } =
    useGetRecetaByPedidoQuery(recetaArg);

  const { data: almacenes = [] } = useGetAlmacenesQuery();

  useEffect(() => {
    setCant(order.cantidad ?? 0);
    setDesp(order.despacho ?? 0);
    setFalt(order.faltante ?? maxPedido - (order.cantidad ?? 0));
  }, [order.cantidad, order.despacho, order.faltante, maxPedido]);

  const persist = (field, value) =>
    updatePedido({ id: order.id, data: { [field]: value } })
      .unwrap()
      .catch(() => {});

  const onCantidadChange = (raw) => {
    const v = clamp(Number(raw) || 0, 0, maxPedido);
    const nfalt = maxPedido - v;
    setCant(v);
    setFalt(nfalt);
    persist("cantidad", v);
    persist("faltante", nfalt);
  };

  const onDespachoChange = (raw) => {
    const v = clamp(Number(raw) || 0, 0, maxPedido);
    setDesp(v);
    persist("despacho", v);
  };

  const onFaltanteChange = (raw) => {
    const v = clamp(Number(raw) || 0, 0, maxPedido);
    setFalt(v);
    persist("faltante", v);
  };

  return (
    <Fragment>
      <Tr bg={rowBg} _hover={{ bg: hoverBg }} transition="background 0.2s">
        <Td px={2} py={1}>
          <IconButton
            size="sm"
            variant="ghost"
            icon={isExpanded ? <ChevronDownIcon /> : <ChevronRightIcon />}
            aria-label="Expandir"
            onClick={() => setIsExpanded((v) => !v)}
          />
        </Td>

        <Td px={2} py={1}>
          {order.itemCode}
        </Td>
        <Td px={2} py={1}>
          {order.productoNombre}
        </Td>
        <Td px={2} py={1} isNumeric>
          {maxPedido}
        </Td>

        <Td px={2} py={1} textAlign="center">
          <Checkbox isChecked={!!order.completo} isReadOnly size="sm" />
        </Td>

        <Td px={2} py={1} isNumeric>
          <Input
            size="xs"
            w="60px"
            type="number"
            value={numOrEmpty(desp)}
            onChange={(e) => onDespachoChange(e.target.value)}
          />
        </Td>

        <Td px={2} py={1} isNumeric>
          <Input
            size="xs"
            w="60px"
            type="number"
            value={numOrEmpty(falt)}
            onChange={(e) => onFaltanteChange(e.target.value)}
          />
        </Td>

        <Td px={2} py={1}>
          {order.unidadMedida ?? "-"}
        </Td>

        <Td px={2} py={1}>
          <Input
            size="xs"
            w="60px"
            type="number"
            value={numOrEmpty(cant)}
            onChange={(e) => onCantidadChange(e.target.value)}
          />
        </Td>

        <Td px={2} py={1}>
          {order.trazabilidad_Prod ?? "-"}
        </Td>

        {/* Nueva celda para mostrar almacén */}
        <Td px={2} py={1}>
          {order.almacen?.nombre || order.almacen?.name || "-"}
        </Td>

        <Td px={2} py={1}>
          <Button size="xs" onClick={onOpen}>
            Rechazo
          </Button>
        </Td>
      </Tr>

      <Tr>
        <Td colSpan={11} p={0} border="none">
          <Collapse in={isExpanded} animateOpacity>
            <Box
              bg={panelBg}
              border="1px solid"
              borderColor={panelBorder}
              borderRadius="md"
              p={2}
            >
              <Text
                fontSize="sm"
                fontWeight="semibold"
                color={titleColor}
                mb={2}
                textAlign="center"
              >
                Detalles de fabricación
              </Text>

              <FabricacionDetailsTable details={order.details || []} />

              <Box mt={-14}>
                {loadingReceta ? (
                  <Center py={2}>
                    <Spinner size="sm" />
                  </Center>
                ) : receta.length ? (
                  <RecetaTable
                    pedidoId={order.id}
                    receta={receta}
                    almacenes={almacenes}
                  />
                ) : (
                  <Center py={2}>
                    <Text
                      color={useColorModeValue("gray.600", "gray.400")}
                      fontSize="sm"
                    >
                      — No hay receta para este pedido —
                    </Text>
                  </Center>
                )}
              </Box>
            </Box>
          </Collapse>
        </Td>
      </Tr>
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
  order: PropTypes.shape({
    id: PropTypes.number.isRequired,
    itemCode: PropTypes.string,
    productoNombre: PropTypes.string,
    cantidadUnidad: PropTypes.number,
    cantidad: PropTypes.number,
    despacho: PropTypes.number,
    faltante: PropTypes.number,
    completo: PropTypes.bool,
    unidadMedida: PropTypes.string,
    trazabilidad_Prod: PropTypes.string,
    details: PropTypes.array,
    rechazo: PropTypes.number,
  }).isRequired,
};
