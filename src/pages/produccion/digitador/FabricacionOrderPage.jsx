import { useState, useMemo } from "react";
import {
  Box,
  Center,
  Spinner,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Button,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Textarea,
  Checkbox,
  useDisclosure,
  useToast,
  useColorModeValue,
  Input,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import {
  useGetPedidosAgrupadosQuery,
  useAvanzarEtapaMutation,
  useAvanzarMultiEtapaDetalleMutation,
  useGetRecetaByPedidoQuery,
  useGetAlmacenesQuery,
} from "../../../services/pedidoProductionApi";
import FilterPanelFabricacion from "../../../components/production/fabricacion/FilterPanelFabricacion";
import { FabricacionRow } from "../../../components/production/fabricacion/FabricacionRow";

const FabricacionPage = () => {
  const { pedidoId: raw } = useParams();
  const pedidoId = Number(raw);
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    data: groups = [],
    isLoading,
    error,
  } = useGetPedidosAgrupadosQuery({
    etapaId: 3,
  });

  const headBg = useColorModeValue("gray.50", "gray.800");
  const tableBorder = useColorModeValue("gray.200", "gray.700");
  const modalBg = useColorModeValue("white", "gray.700");

  const [avanzarEtapa, { isLoading: sendingPedido }] =
    useAvanzarEtapaMutation();
  const [avanzarMultiDetalle, { isLoading: sendingDetalles }] =
    useAvanzarMultiEtapaDetalleMutation();

  const group = useMemo(
    () => groups.find((g) => g.pedidoId === pedidoId),
    [groups, pedidoId],
  );

  const { data: receta = [], isLoading: cargandoReceta } =
    useGetRecetaByPedidoQuery({ pedidoId });

  const baseItems = useMemo(() => group?.items ?? [], [group]);

  const [term, setTerm] = useState("");
  const [estado, setEstado] = useState("");
  const [mesa, setMesa] = useState("");
  const [comment, setComment] = useState("");
  const [noComment, setNoComment] = useState(false);
  const [dateSAP, setDateSAP] = useState("");
  const isSending = sendingPedido || sendingDetalles;

  console.log({ pedidoId });

  const filtered = useMemo(() => {
    const txt = term.toLowerCase();

    return baseItems
      .filter((it) => {
        const byText =
          !term ||
          it.itemCode.toLowerCase().includes(txt) ||
          it.productoNombre.toLowerCase().includes(txt);

        const byEstado =
          !estado || (it.completo ? "Completado" : "Pendiente") === estado;

        const byMesa = !mesa || String(it.id_asigArea) === mesa;

        return byText && byEstado && byMesa;
      })
      .sort((a, b) =>
        a.productoNombre.localeCompare(b.productoNombre, "es", {
          sensitivity: "base",
        }),
      );
  }, [baseItems, term, estado, mesa]);

  if (isLoading) {
    return (
      <Center py={20}>
        <Spinner size="xl" />
      </Center>
    );
  }

  const handleOpenModal = () => {
    if (!filtered.length) {
      toast({
        title: "Sin ítems",
        description: "No hay ítems filtrados para enviar.",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    setComment("");
    setNoComment(false);
    setDateSAP("");
    onOpen();
  };

  const handleCargarSAP = async () => {
    if (!dateSAP) {
      toast({
        title: "Falta fecha",
        description: "Debe seleccionar una fecha de orden para cargar a SAP.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const usuarioId = Number(localStorage.getItem("usuarioId") ?? 1);
    const comentario = noComment ? null : comment.trim();

    const detalleIds = filtered.map((o) => o.id_detallePedido);
    const pedidoId = Number(filtered[0]?.pedidoId ?? 0);

    const nuevaEtapaId = 4;

    try {
      if (detalleIds.length) {
        await avanzarMultiDetalle({
          detalleOrdenIds: detalleIds,
          usuarioId,
          nuevaEtapaId,
          comentario,
          fechaOrden: dateSAP,
        }).unwrap();
      }

      await avanzarEtapa({
        pedidoId,
        usuarioId,
        nuevaEtapaId,
        comentario,
        fechaOrden: dateSAP,
      }).unwrap();

      toast({
        title: "Pedido enviado a SAP",
        description: "Se avanzó a la etapa 3 correctamente.",
        status: "success",
        duration: 3500,
        isClosable: true,
      });

      onClose();
      navigate(-1);
    } catch (err) {
      toast({
        title: "Error",
        description: err?.data?.error || "No se pudo cargar a SAP.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  if (isLoading) {
    return (
      <Center py={20}>
        <Spinner size="xl" />
      </Center>
    );
  }

  if (error) {
    return (
      <Center py={20}>
        <Text color="red.500">Error al cargar órdenes de fabricación.</Text>
      </Center>
    );
  }

  return (
    <Box p={6}>
      <FilterPanelFabricacion
        term={term}
        onTermChange={setTerm}
        estado={estado}
        onEstadoChange={setEstado}
        mesa={mesa}
        onMesaChange={setMesa}
      />

      <Table
        variant="simple"
        size="sm"
        border="1px solid"
        borderColor={tableBorder}
      >
        <Thead bg={headBg}>
          <Tr>
            <Th />
            <Th>PRODUCTO</Th>
            <Th>Pedido</Th>
            <Th>Completar despacho</Th>
            <Th>Despacho</Th>
            <Th>Faltante</Th>
            <Th>Unidad de medida</Th>
            <Th>Cantidad</Th>
            <Th>No. Trazabilidad</Th>
            <Th>Almacén</Th>
            <Th>Rechazo</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filtered.map((o, idx) => (
            <FabricacionRow
              key={o.id_detallePedido ?? o.id}
              order={o}
              pedidoId={pedidoId}
              receta={receta}
              cargandoReceta={cargandoReceta}
              mostrarReceta={idx === 0}
              index={idx}
            />
          ))}
        </Tbody>
      </Table>

      <Flex
        mt={8}
        justify="space-between"
        align="center"
        flexWrap="wrap"
        gap={3}
      >
        <Button
          leftIcon={<ArrowBackIcon />}
          variant="outline"
          colorScheme="green"
          w="fit-content"
          onClick={() => navigate("/fabricacion/orden")}
        >
          Regresar
        </Button>

        <Button
          colorScheme="green"
          w="fit-content"
          onClick={handleOpenModal}
          isDisabled={!filtered.length}
        >
          Cargar a SAP
        </Button>
      </Flex>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent bg={modalBg}>
          <ModalHeader>Cargar a SAP</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb={2} fontWeight="bold">
              Fecha de Orden (Obligatorio):
            </Text>
            <Input
              type="date"
              value={dateSAP}
              onChange={(e) => setDateSAP(e.target.value)}
              mb={4}
            />
            <Text mb={2}>Comentario:</Text>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              isDisabled={noComment}
              placeholder="Escribe un comentario..."
              mb={3}
            />
            <Checkbox
              isChecked={noComment}
              onChange={(e) => setNoComment(e.target.checked)}
            >
              No agregar comentario
            </Checkbox>
          </ModalBody>
          <ModalFooter>
            <Button mr={3} onClick={onClose}>
              Cancelar
            </Button>
            <Button
              colorScheme="green"
              onClick={handleCargarSAP}
              isLoading={isSending}
              isDisabled={!dateSAP}
            >
              Aceptar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default FabricacionPage;
