import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Flex,
  Center,
  Spinner,
  Text,
  Heading,
  Button,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import {
  useGetPedidosAgrupadosQuery,
  useAvanzarEtapaMutation,
  useAvanzarEtapaDetalleMutation,
  useAvanzarMultiEtapaDetalleMutation,
} from "../../../services/pedidoProductionApi";
import { FilterPanel } from "../../../components/production/FilterPanel";
import { OrdersTable } from "../../../components/production/OrdersTable";
import { ActionButtons } from "../../../components/production/ActionButtons";
import FinalizeModal from "./FinalizeModal";

const ProductionOrderDetailPage = () => {
  const { pedidoId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    data: agrupados = [],
    isLoading,
    error,
  } = useGetPedidosAgrupadosQuery();

  const [term, setTerm] = useState("");
  const [country, setCountry] = useState("");
  const [client, setClient] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [avanzarEtapa, { isLoading: sendPedido }] = useAvanzarEtapaMutation();
  const [avanzarDetalle, { isLoading: sendOne }] =
    useAvanzarEtapaDetalleMutation();
  const [avanzarDetallesMultiples, { isLoading: sendMultiple }] =
    useAvanzarMultiEtapaDetalleMutation();
  const isSending = sendPedido || sendOne || sendMultiple;
  const group = useMemo(
    () => agrupados.find((g) => g.pedidoId === Number(pedidoId)),
    [agrupados, pedidoId]
  );
  const items = useMemo(() => (group ? group.items : []), [group]);
  const allDone = useMemo(() => items.every((i) => i.completo), [items]);
  const countries = useMemo(
    () => [...new Set(items.map((i) => i.pais))],
    [items]
  );
  const clients = useMemo(
    () => [...new Set(items.map((i) => i.tienda))],
    [items]
  );
  const states = useMemo(
    () => [
      ...new Set(items.map((i) => (i.completo ? "Completado" : "Pendiente"))),
    ],
    [items]
  );

  const filtered = useMemo(() => {
    return items
      .filter((i) => {
        const mt =
          !term || i.productoNombre.toLowerCase().includes(term.toLowerCase());
        const mc = !country || i.pais === country;
        const mcl = !client || i.tienda === client;
        const ms =
          !stateFilter ||
          (i.completo ? "Completado" : "Pendiente") === stateFilter;
        return mt && mc && mcl && ms;
      })
      .sort((a, b) =>
        a.productoNombre.localeCompare(b.productoNombre, undefined, {
          sensitivity: "base",
        })
      );
  }, [items, term, country, client, stateFilter]);

  const [comment, setComment] = useState("");
  const [noComment, setNoComment] = useState(false);

  const handleFinalizeClick = () => {
    if (!allDone) {
      toast({
        title: "Productos pendientes",
        description:
          "Todos los productos deben estar completados antes de finalizar.",
        status: "warning",
        duration: 4000,
        isClosable: true,
      });
      return;
    }
    setComment("");
    setNoComment(false);
    onOpen();
  };

  const handleAccept = async () => {
    const usuarioId = Number(localStorage.getItem("usuarioId") ?? 1);
    const comentario = noComment ? null : comment.trim();

    const detalleIds = items.map((i) => i.id_detallePedido);

    try {
      if (detalleIds.length === 1) {
        await avanzarDetalle({
          detalleOrdenId: detalleIds[0],
          usuarioId,
        }).unwrap();
      } else {
        await avanzarDetallesMultiples({
          detalleOrdenIds: detalleIds,
          usuarioId,
        }).unwrap();
      }

      await avanzarEtapa({
        pedidoId: Number(pedidoId),
        usuarioId,
        comentario,
      }).unwrap();

      toast({
        title: "Pedido avanzado.",
        description: "Se cambió a la siguiente etapa correctamente.",
        status: "success",
        duration: 3500,
        isClosable: true,
      });
      onClose();
      navigate(-1);
    } catch (err) {
      toast({
        title: "Error",
        description: err?.data?.error || "No se pudo avanzar de etapa.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  if (isLoading)
    return (
      <Center py={20}>
        <Spinner size="xl" />
      </Center>
    );

  if (error)
    return (
      <Center py={20}>
        <Text color="red.500">Error al cargar el pedido.</Text>
      </Center>
    );

  if (!group)
    return (
      <Center py={20}>
        <Text color="gray.600">Pedido no encontrado.</Text>
      </Center>
    );

  return (
    <Box p={4}>
      <Flex justify="space-between" align="center" mb={6}>
        <Button variant="link" onClick={() => navigate(-1)}>
          ← Volver
        </Button>
        <Heading size="md">Detalle Pedido #{group.pedidoId}</Heading>
        <ActionButtons onFinish={handleFinalizeClick} />
      </Flex>

      <FilterPanel
        itemFilter={term}
        onItemChange={setTerm}
        countryFilter={country}
        onCountryChange={setCountry}
        clientFilter={client}
        onClientChange={setClient}
        stateFilter={stateFilter}
        onStateChange={setStateFilter}
        countries={countries}
        clients={clients}
        states={states}
      />

      <OrdersTable data={filtered} />

      <FinalizeModal
        isOpen={isOpen}
        onClose={onClose}
        comment={comment}
        onChangeComment={setComment}
        noComment={noComment}
        onToggleNoComment={() => setNoComment(!noComment)}
        onAccept={handleAccept}
        isSending={isSending}
      />
    </Box>
  );
};

export default ProductionOrderDetailPage;
