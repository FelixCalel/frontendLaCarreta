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
} from "../../services/pedidoProductionApi";
import { OrderDetailsTable } from "./OrderDetailsTable";

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

export const OrderRow = ({ order, isExpanded, onToggle }) => {
  const {
    data: details,
    isLoading,
    refetch,
  } = useGetDetallesYProduccionQuery(order.id, { skip: order.ptmq });
  const [updatePedido] = useUpdatePedidoProduccionMutation();
  const [isPTMQ, setIsPTMQ] = useState(order.ptmq ?? false);
  const [cantidadLocal, setCantidadLocal] = useState(order.cantidad || 0);
  const [faltanteLocal, setFaltanteLocal] = useState(
    (order.cantidadUnidad ?? 0) - (order.cantidad || 0)
  );

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
    setCantidadLocal(order.cantidad || 0);
    setFaltanteLocal((order.cantidadUnidad ?? 0) - (order.cantidad || 0));
  }, [order.cantidad, order.cantidadUnidad]);

  useEffect(() => setIsPTMQ(order.ptmq), [order.ptmq]);

  const handlePTMQToggle = (checked) => {
    updatePedido({ id: order.id, data: { ptmq: checked } })
      .unwrap()
      .then(() => {
        setIsPTMQ(checked);
        if (!checked) refetch();
      })
      .catch(() => setIsPTMQ(order.ptmq));
  };

  useEffect(() => {
    setProdFields({
      mpUtilizada: order.mpUtilizada ?? 0,
      mp1ra: order.mp1ra ?? 0,
      mp2da: order.mp2da ?? 0,
      mp3ra: order.mp3ra ?? 0,
      mpSobrante: order.mpSobrante ?? 0,
      rechazo: order.rechazo ?? 0,
      basura: order.basura ?? 0,
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
            <Box p={3} bg={panelBg}>
              <Flex wrap="wrap" fontSize="sm" mb={3}>
                {Object.entries(prodFields).map(([field, value]) => (
                  <Box key={field} flex="1 1 120px" mb={2}>
                    <Text fontWeight="semibold">{FIELD_LABELS[field]}:</Text>
                    <Input
                      size="sm"
                      type={field === "trazabilidad_Prod" ? "text" : "number"}
                      min={0}
                      value={value}
                      onChange={(e) => handleFieldChange(field, e.target.value)}
                      w="60px"
                    />
                  </Box>
                ))}
              </Flex>
              <OrderDetailsTable
                details={details}
                isLoading={isLoading}
                isPTMQ={isPTMQ}
                onTogglePTMQ={handlePTMQToggle}
              />
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
