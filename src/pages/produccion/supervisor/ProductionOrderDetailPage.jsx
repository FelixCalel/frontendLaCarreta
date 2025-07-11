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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Textarea,
  Checkbox,
  useDisclosure,
  useColorModeValue,
  Stack,
  useToast,
} from "@chakra-ui/react";
import {
  useGetPedidosAgrupadosQuery,
  useAvanzarEtapaMutation,
} from "../../../services/pedidoProductionApi";
import { FilterPanel } from "../../../components/production/FilterPanel";
import { OrdersTable } from "../../../components/production/OrdersTable";
import { ActionButtons } from "../../../components/production/ActionButtons";

const ProductionOrderDetailPage = () => {
  const { pedidoId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const {
    data: agrupados = [],
    isLoading,
    error,
  } = useGetPedidosAgrupadosQuery();

  const [term, setTerm] = useState("");
  const [country, setCountry] = useState("");
  const [client, setClient] = useState("");
  const [stateFilter, setStateFilter] = useState("");

  const group = useMemo(
    () => agrupados.find((g) => g.pedidoId === Number(pedidoId)),
    [agrupados, pedidoId]
  );
  const items = useMemo(() => (group ? group.items : []), [group]);

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

  const filtered = useMemo(
    () =>
      items
        .filter((i) => {
          const mt =
            !term ||
            i.productoNombre.toLowerCase().includes(term.toLowerCase());
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
        ),
    [items, term, country, client, stateFilter]
  );

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [comment, setComment] = useState("");
  const [noComment, setNoComment] = useState(false);

  const [avanzarEtapa, { isLoading: isSending }] = useAvanzarEtapaMutation();

  const handleFinalizeClick = () => {
    setComment("");
    setNoComment(false);
    onOpen();
  };

  const handleAccept = async () => {
    const usuarioId = Number(localStorage.getItem("usuarioId") || 1);
    const comentario = noComment ? null : comment.trim();

    try {
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

  const overlayBg = useColorModeValue("blackAlpha.300", "whiteAlpha.300");
  const modalBg = useColorModeValue("white", "gray.700");
  const inputBg = useColorModeValue("gray.50", "gray.600");
  const inputBorder = useColorModeValue("gray.300", "gray.500");
  const textColor = useColorModeValue("gray.800", "gray.100");

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

      <Modal isOpen={isOpen} onClose={onClose} isCentered size="xl">
        <ModalOverlay bg={overlayBg} />
        <ModalContent bg={modalBg} borderRadius="lg" p={6}>
          <ModalHeader color={textColor}>Comentario</ModalHeader>
          <ModalBody>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Escribe aquí tu comentario"
              bg={inputBg}
              borderColor={inputBorder}
              color={textColor}
              resize="vertical"
              minH="160px"
              isDisabled={noComment}
            />
            <Checkbox
              mt={4}
              isChecked={noComment}
              onChange={(e) => setNoComment(e.target.checked)}
              color={textColor}
            >
              Ningún comentario
            </Checkbox>
          </ModalBody>
          <ModalFooter>
            <Stack direction="row" spacing={3}>
              <Button
                colorScheme="green"
                onClick={handleAccept}
                isLoading={isSending}
              >
                Aceptar
              </Button>
              <Button variant="outline" colorScheme="red" onClick={onClose}>
                Cancelar
              </Button>
            </Stack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ProductionOrderDetailPage;
