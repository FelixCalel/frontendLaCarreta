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
import NumberInputBox from "./components/NumberInputBox";
import AlmacenSelect from "./components/AlmacenSelect";

const clamp = (v, min, max) => Math.max(min, Math.min(v, max));
const numOrEmpty = (v) => (v === null || v === undefined ? "" : v);

export const FabricacionRow = ({ order, index = 0 }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const maxPedido = order.cantidadUnidad ?? 0;
  const [cant, setCant] = useState(order.cantidad ?? 0);
  const [desp, setDesp] = useState(order.despacho ?? 0);
  const [falt, setFalt] = useState(order.faltante ?? maxPedido - cant);
  const { data: almacenes = [] } = useGetAlmacenesQuery();

  const defaultAlmacenId = useMemo(() => {
    if (order.id_almacen) return String(order.id_almacen);
    if (order.almacen?.id) return String(order.almacen.id);

    if (order.codigoAlmacen && almacenes.length > 0) {
      const code = String(order.codigoAlmacen).trim();
      const match = almacenes.find(
        (a) => String(a.name).trim() === code || String(a.name).includes(code),
      );
      if (match) return String(match.id);
    }
    return "";
  }, [order.id_almacen, order.almacen, order.codigoAlmacen, almacenes]);

  const [almacenId, setAlmacenId] = useState(defaultAlmacenId);

  const [updatePedido] = useUpdatePedidoProduccionMutation();

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

  const [prevOrderStats, setPrevOrderStats] = useState({
    cantidad: order.cantidad,
    despacho: order.despacho,
    faltante: order.faltante,
    maxPedido,
  });

  if (
    order.cantidad !== prevOrderStats.cantidad ||
    order.despacho !== prevOrderStats.despacho ||
    order.faltante !== prevOrderStats.faltante ||
    maxPedido !== prevOrderStats.maxPedido
  ) {
    setPrevOrderStats({
      cantidad: order.cantidad,
      despacho: order.despacho,
      faltante: order.faltante,
      maxPedido,
    });
    setCant(order.cantidad ?? 0);
    setDesp(order.despacho ?? 0);
    setFalt(order.faltante ?? maxPedido - (order.cantidad ?? 0));
  }

  const [prevDefaultAlmacenId, setPrevDefaultAlmacenId] =
    useState(defaultAlmacenId);
  if (defaultAlmacenId !== prevDefaultAlmacenId) {
    setPrevDefaultAlmacenId(defaultAlmacenId);
    setAlmacenId(defaultAlmacenId);
  }

  const persist = (field, value) => {
    updatePedido({ id: order.id, data: { [field]: value } })
      .unwrap()
      .catch((err) => {
        console.error(`Error updating ${field}:`, err);
        toast({
          title: "Error",
          description: `No se pudo actualizar ${field}`,
          status: "error",
        });
      });
  };

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

  const handleAlmacenChange = async (newId) => {
    setAlmacenId(newId);
    try {
      await updatePedido({
        id: order.id,
        data: { id_almacen: newId ? Number(newId) : null },
      }).unwrap();
    } catch {
      setAlmacenId(order.id_almacen ? String(order.id_almacen) : "");
      toast({
        title: "Error",
        description: "No se pudo actualizar el almacén",
        status: "error",
      });
    }
  };

  const memoizedRecetaTable = useMemo(
    () =>
      loadingReceta ? (
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
          <Text color="gray.500" fontSize="sm">
            — No hay receta para este pedido —
          </Text>
        </Center>
      ),
    [order.id, receta, loadingReceta, almacenes],
  );

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

      <Tr>
        <Td colSpan={11} p={0} border="none">
          <Collapse in={isExpanded} animateOpacity>
            <Box
              bg={panelBg}
              p={3}
              borderBottomWidth="1px"
              borderColor={panelBorder}
            >
              <Flex gap={4} direction={{ base: "column", xl: "row" }}>
                <Box flex="1" maxW={{ xl: "40%" }}>
                  <Box
                    bg={detailsBgColor}
                    p={3}
                    borderRadius="md"
                    shadow="sm"
                    borderWidth="1px"
                    borderColor="gray.200"
                    h="100%"
                  >
                    <Text
                      fontSize="sm"
                      fontWeight="bold"
                      color="blue.600"
                      mb={3}
                    >
                      Detalles del Pedido
                    </Text>
                    <FabricacionDetailsTable details={order.details || []} />
                  </Box>
                </Box>

                <Box flex="1">{memoizedRecetaTable}</Box>
              </Flex>
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
  order: PropTypes.object.isRequired,
  index: PropTypes.number,
};
